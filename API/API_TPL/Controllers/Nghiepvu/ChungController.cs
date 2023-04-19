using API_TPL.DAL;
using Microsoft.AspNet.Identity;
using Oracle.ManagedDataAccess.Client;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using Telegram.Bot;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using System.Threading;
using System.Threading.Tasks;
using API_TPL.Models;

namespace API_TPL.Controllers.Danhmuc
{
    //[Authorize]
    [RoutePrefix("api/dmchung")]
    public class ChungController : ApiController
    {
        static String connString = ConfigurationManager.ConnectionStrings["PHANBONConnection"].ToString();
        SQL_DBHELPERs helper = new SQL_DBHELPERs(connString);
        TelegramBotClient botClient;
       
        [Route("get_key"), HttpPost]
        public IHttpActionResult get_keys([FromBody] dynamic obj)
        {
            string query_str = "get_keys";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("key", obj.key, System.Data.SqlDbType.NVarChar);
               
                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        ///<summary>
        ///<b>Mục đích:</b>Lấy danh sách phân xưởng. <br />
        ///<b>Tham số URI:</b> Không có. <br />
        ///<b>Trả về:</b> Datatable <br />
        ///</summary>
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("getdatahtx"), HttpGet]
        public IHttpActionResult getdatahtx()
        {
            string query_str = "tree_htx_camxuan";

            object[] aParams = new object[0];
            try
            {
                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        ///<summary>
        ///<b>Mục đích:</b>Lấy danh sách phân xưởng. <br />
        ///<b>Tham số URI:</b> Không có. <br />
        ///<b>Trả về:</b> Datatable <br />
        ///</summary>
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("getdatatree"), HttpGet]
        public IHttpActionResult tree_htx_camxuan()
        {
            string query_str = "tree_htx_camxuan";

            object[] aParams = new object[0];
            try
            {
                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);


                List<Donvi> listreturndv = new List<Donvi>();
                if (kq.Rows.Count > 0)
                {
                    Donvi dv0 = new Donvi();
                    dv0.id = kq.Rows[0]["ma_dv"].ToString();
                    dv0.cap = kq.Rows[0]["cap"].ToString();
                    dv0.name = kq.Rows[0]["ten_dv"].ToString() + " - " + kq.Rows[0]["ma_dv"].ToString();
                    dv0.children = Danh_sach_node(kq, kq.Rows[0]["ma_dv"].ToString()).ToArray();
                    listreturndv.Add(dv0);
                }

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, listreturndv));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
                
        public List<Donvi> Danh_sach_node(DataTable kq, string madonvi)
        {
            List<Donvi> donvvi_con = new List<Donvi>();
            List<DataRow> listdtr = new List<DataRow>();
            for (int i = 0; i < kq.Rows.Count; i++)
            {
                if (kq.Rows[i]["parent_id"].ToString() == madonvi)
                {
                    listdtr.Add(kq.Rows[i]);
                }
            }
            if (listdtr.Count > 0)
            {
                foreach (DataRow dtr in listdtr)
                {
                    Donvi cls = new Donvi();
                    cls.name = dtr["ten_dv"].ToString() + " - " + dtr["ma_dv"].ToString();
                    cls.id = dtr["ma_dv"].ToString();
                    cls.cap = dtr["cap"].ToString();
                    List<Donvi> dv_con = new List<Donvi>();
                    dv_con = Danh_sach_node(kq, dtr["ma_dv"].ToString());
                    if (dv_con != null)
                    {
                        cls.children = dv_con.ToArray();
                    }
                    else
                    {
                        cls.children = (new List<Donvi>()).ToArray();
                    }
                    donvvi_con.Add(cls);
                }
                return donvvi_con;
            }
            else
            {
                return null;
            }
        }
    }
}
