using API_TPL.DAL;
using Microsoft.AspNet.Identity;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API_TPL.Models;

namespace API_TPL.Controllers.Danhmuc
{
    //[Authorize]
    [RoutePrefix("api/dmdonvi")]
    public class DonviController : ApiController
    {
        static string connString = System.Configuration.ConfigurationManager.ConnectionStrings["QLCV"].ToString();
        DBHelper helper = new DBHelper(connString);
        /// <summary>
        /// <b>Mục đích::</b> Tạo mới đơn vị <br />
        /// <b>Tham số URI:</b> prmJsonData. JSON <br />
        ///<b>Trả về:</b> Datatable <br />
        /// </summary>      
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("create"), HttpPost]
        public IHttpActionResult DM_DONVI_INS([FromBody] dynamic obj)
        {
            string query_str = "DM_DONVI_INS";

            object[] aParams = new object[1];

            try
            {
                aParams[0] = helper.BuildParameter("prmJsonData", obj, OracleDbType.Clob, ParameterDirection.Input);
                String kq = helper.ExecuteNonQuery(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        /// <summary>
        /// <b>Mục đích::</b> Chỉnh sửa thông tin đơn vị <br />
        /// <b>Tham số URI:</b> prmJsonData. JSON <br />
        ///<b>Trả về:</b> Datatable <br />
        /// </summary>      
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("update"), HttpPost]
        public IHttpActionResult DM_DONVI_UP([FromBody] dynamic obj)
        {
            string query_str = "DM_DONVI_UP";

            object[] aParams = new object[1];

            try
            {
                aParams[0] = helper.BuildParameter("prmJsonData", obj, OracleDbType.Clob, ParameterDirection.Input);
                String kq = helper.ExecuteNonQuery(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        /// <summary>
        /// Xóa đơn vị
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>        
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("delete"), HttpPost]
        public IHttpActionResult DM_DONVI_DEL([FromBody] dynamic obj)
        {
            string query_str = "DM_DONVI_DEL";

            object[] aParams = new object[2];

            try
            {
                aParams[0] = helper.BuildParameter("prmMA_DV", obj.MA_DV, OracleDbType.Varchar2, ParameterDirection.Input);
                aParams[1] = helper.BuildParameter("prmNGUOI_NHAP", obj.NGUOI_NHAP, OracleDbType.Varchar2, ParameterDirection.Input);

                String kq = helper.ExecuteNonQuery(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        /// <summary>
        /// View nhân viên by id
        /// </summary>
        [Route("getbyma"), HttpGet]
        public IHttpActionResult DM_DONVI_BYMA(string prmMA_DV)
        {
            string query_str = "DM_DONVI_BYMA";
            object[] aParams = new object[2];
            try
            {
                aParams[0] = helper.BuildParameter("prmMA_DV", prmMA_DV, OracleDbType.Varchar2, ParameterDirection.Input);


                OracleParameter resultParam = new OracleParameter("results", OracleDbType.RefCursor);
                resultParam.Direction = ParameterDirection.Output;

                aParams[1] = resultParam;

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        /// <summary>
        /// View nhân viên by id
        /// </summary>
        [Route("getdonvigiaoviec"), HttpGet]
        public IHttpActionResult DM_DONVI_DONVIGIAOVIEC(string prmMA_DV)
        {
            string query_str = "DM_DONVI_BYMADVCHA";
            object[] aParams = new object[2];
            try
            {
                aParams[0] = helper.BuildParameter("prmMA_DV", prmMA_DV, OracleDbType.Varchar2, ParameterDirection.Input);


                OracleParameter resultParam = new OracleParameter("results", OracleDbType.RefCursor);
                resultParam.Direction = ParameterDirection.Output;

                aParams[1] = resultParam;

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        /// <summary>
        /// View nhân viên by id
        /// </summary>
        [Route("getdonviconlv3"), HttpGet]
        public IHttpActionResult getdonviconlv3(string prmMA_DV)
        {
            string query_str = "DM_DONVI_BYMADVCHA_LV3";
            object[] aParams = new object[2];
            try
            {
                aParams[0] = helper.BuildParameter("prmMA_DV", prmMA_DV, OracleDbType.Varchar2, ParameterDirection.Input);


                OracleParameter resultParam = new OracleParameter("results", OracleDbType.RefCursor);
                resultParam.Direction = ParameterDirection.Output;

                aParams[1] = resultParam;

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        /// <summary>
        /// View nhân viên by id
        /// </summary>
        [Route("gettreebyma"), HttpGet]
        public IHttpActionResult DM_DONVI_TREE_BYMA(string prmMA_DV)
        {
            string query_str = "DM_DONVI_VIEWTREE_BYMADV";
            object[] aParams = new object[2];
            try
            {
                aParams[0] = helper.BuildParameter("prmMA_DV", prmMA_DV, OracleDbType.Varchar2, ParameterDirection.Input);


                OracleParameter resultParam = new OracleParameter("results", OracleDbType.RefCursor);
                resultParam.Direction = ParameterDirection.Output;

                aParams[1] = resultParam;

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                List<Donvi> listreturndv = new List<Donvi>();
                if (kq.Rows.Count > 0)
                {
                    Donvi dv0 = new Donvi();
                    dv0.id = kq.Rows[0]["id"].ToString();
                    dv0.name = kq.Rows[0]["name"].ToString();
                    dv0.children = Danh_sach_node(kq, kq.Rows[0]["id"].ToString()).ToArray();
                    listreturndv.Add(dv0);
                }
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, listreturndv));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        ///<summary>
        ///<b>Mục đích:</b>Lấy danh sách trung tâm viễn thông. <br />
        ///<b>Tham số URI:</b> Không có. <br />
        ///<b>Trả về:</b> Datatable <br />
        ///</summary>
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("getAll"), HttpGet]
        public DataTable GetAll()
        {
            string qstr = "DM_DONVI_VIEW_ALL";
            object[] arr_params = new object[1];

            OracleParameter param1 = new OracleParameter("result", OracleDbType.RefCursor, ParameterDirection.Output);
            arr_params[0] = param1;
            return helper.ExecuteQueryStoreProcedure(qstr, arr_params);
        }

        public List<Donvi> Danh_sach_node(DataTable kq, string madonvi)
        {
            List<Donvi> donvvi_con = new List<Donvi>();
            List<DataRow> listdtr = new List<DataRow>();
            for (int i = 0; i < kq.Rows.Count; i++)
            {
                if (kq.Rows[i]["MA_DONVI_CHA"].ToString() == madonvi)
                {
                    listdtr.Add(kq.Rows[i]);
                }
            }
            if (listdtr.Count > 0)
            {
                foreach(DataRow dtr in listdtr)
                {
                    Donvi cls = new Donvi();
                    cls.name = dtr["name"].ToString();
                    cls.id = dtr["id"].ToString();                    
                    List<Donvi> dv_con = new List<Donvi>();
                    dv_con = Danh_sach_node(kq, dtr["id"].ToString());
                        if (dv_con!= null)
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
