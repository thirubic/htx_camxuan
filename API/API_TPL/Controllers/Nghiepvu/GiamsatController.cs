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
    [RoutePrefix("api/giamsat")]
    public class GiamsatController : ApiController
    {
        static String connString = ConfigurationManager.ConnectionStrings["PHANBONConnection"].ToString();
        SQL_DBHELPERs helper = new SQL_DBHELPERs(connString);

        [Route("capnhattrangthai"), HttpPost]
        public IHttpActionResult CAPNHAT_TRANGTHAI_LUONG([FromBody] dynamic obj)
        {
            string query_str = "hoso_luongphan_capnhattrangthai";

            object[] aParams = new object[3];
            try
            {
                aParams[0] = helper.BuildParameter("ma_luong", obj.ma_luong, System.Data.SqlDbType.NVarChar);
                aParams[1] = helper.BuildParameter("trangthai", obj.trangthai, System.Data.SqlDbType.Int);
                aParams[2] = helper.BuildParameter("nguoi_capnhat", obj.nguoi_capnhat, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                //return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
                string err = ex.Message.Substring(0, ex.Message.IndexOf("\n", 0)).Substring(ex.Message.IndexOf(":") + 2).Trim();
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }
        }
        [Route("getbytrangthai"), HttpPost]
        public IHttpActionResult DANHACH_LUONG_BYTRANGTHAI ([FromBody] dynamic obj)
        {
            string query_str = "hoso_luongphan_getbytrangthai";

            object[] aParams = new object[2];
            try
            {
                aParams[0] = helper.BuildParameter("ma_duong", obj.ma_duong, System.Data.SqlDbType.NVarChar);
                aParams[1] = helper.BuildParameter("trangthai", obj.trangthai, System.Data.SqlDbType.Int);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                //return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
                string err = ex.Message.Substring(0, ex.Message.IndexOf("\n", 0)).Substring(ex.Message.IndexOf(":") + 2).Trim();
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, err));
            }
        }
    }
}
