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



namespace API_TPL.Controllers.Danhmuc
{
    //[Authorize]
    [RoutePrefix("api/dmvattu")]
    public class DmVattuController : ApiController
    {
        static String connString = ConfigurationManager.ConnectionStrings["PHANBONConnection"].ToString();
        SQL_DBHELPERs helper = new SQL_DBHELPERs(connString);

        ///<summary>
        ///<b>Mục đích:</b>Lấy danh sách phân xưởng. <br />
        ///<b>Tham số URI:</b> Không có. <br />
        ///<b>Trả về:</b> Datatable <br />
        ///</summary>
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("getall"), HttpGet]
        public IHttpActionResult getAll()
        {
            string query_str = "dm_vattu_getall";

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

        [Route("capnhat"), HttpPost]
        public IHttpActionResult DM_VATTU([FromBody] dynamic obj)
        {
            string query_str = "dm_vattu_insert";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("data", obj.data, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        [Route("xoa"), HttpPost]
        public IHttpActionResult DM_VATTU_XOA([FromBody] dynamic obj)
        {
            string query_str = "dm_vattu_delete";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("ma_vattu", obj.ma_vattu, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        [Route("getbyma"), HttpPost]
        public IHttpActionResult DM_VATTU_BYID([FromBody] dynamic obj)
        {
            string query_str = "dm_vattu_getbyma";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("ma_vattu", obj.ma_vattu, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        [Route("dm_vattu_getbyloai"), HttpPost]
        public IHttpActionResult dm_vattu_getbyloai([FromBody] dynamic obj)
        {
            string query_str = "dm_vattu_getbyloai";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("loai_vt", obj.loai_vt, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        [Route("getbykho"), HttpPost]
        public IHttpActionResult vattu_bykho([FromBody] dynamic obj)
        {
            string query_str = "vattu_bykho";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("ma_kho", obj.ma_kho, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
    }
}
