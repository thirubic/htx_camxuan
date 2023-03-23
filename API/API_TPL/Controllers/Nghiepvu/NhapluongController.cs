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
    [RoutePrefix("api/nhapluong")]
    public class NhapluongController : ApiController
    {
        static String connString = ConfigurationManager.ConnectionStrings["PHANBONConnection"].ToString();
        SQL_DBHELPERs helper = new SQL_DBHELPERs(connString);

        
        [Route("nhapnguyenlieu_tukho"), HttpPost]
        public IHttpActionResult nhap_nguyenlieu_luong([FromBody] dynamic obj)
        {
            string query_str = "nhap_nguyenlieu_luong";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("data", obj.data, System.Data.SqlDbType.NVarChar);

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
        [Route("nhapnguyenlieu_tuluongkhac"), HttpPost]
        public IHttpActionResult nhap_nguyenlieu_tuluongkhac([FromBody] dynamic obj)
        {
            string query_str = "nhap_nguyenlieu_tuluongkhac";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("data", obj.data, System.Data.SqlDbType.NVarChar);

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
        [Route("xoa"), HttpPost]
        public IHttpActionResult KHO_VATTU_XOA([FromBody] dynamic obj)
        {
            string query_str = "xoavattukho";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("ma_vattu", obj.ma_vattu, System.Data.SqlDbType.NVarChar);

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
        [Route("getsoluong"), HttpPost]
        public IHttpActionResult GET_SOLUONG([FromBody] dynamic obj)
        {
            string query_str = "get_soluong_vatttu_trongkho";

            object[] aParams = new object[2];
            try
            {
                aParams[0] = helper.BuildParameter("ma_kho", obj.ma_kho, System.Data.SqlDbType.NVarChar);
                aParams[1] = helper.BuildParameter("ma_vattu", obj.ma_vattu, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        [Route("get_nguyenlieu_byluong"), HttpPost]
        public IHttpActionResult get_nguyenlieu_byluong([FromBody] dynamic obj)
        {
            string query_str = "get_nguyenlieu_byluong";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("ma_luong", obj.ma_luong, System.Data.SqlDbType.NVarChar);
                
                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        [Route("get_khoiluong_byluong"), HttpPost]
        public IHttpActionResult get_khoiluong_byluong([FromBody] dynamic obj)
        {
            string query_str = "get_khoiluong_nguyenlieu_trongluong";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("ma_luong", obj.ma_luong, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        [Route("getbyloaivt"), HttpPost]
        public IHttpActionResult DM_VATTU_BYLOAIVT([FromBody] dynamic obj)
        {
            string query_str = "vattu_theoloaivattu";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("loai_vattu", obj.loai_vattu, System.Data.SqlDbType.Int);

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
