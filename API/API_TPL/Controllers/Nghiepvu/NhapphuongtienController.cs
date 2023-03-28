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
    [RoutePrefix("api/nhapphuongtien")]
    public class NhapphuongtienController : ApiController
    {
        static String connString = ConfigurationManager.ConnectionStrings["PHANBONConnection"].ToString();
        SQL_DBHELPERs helper = new SQL_DBHELPERs(connString);

        
        [Route("nhap_phuongtien_luong"), HttpPost]
        public IHttpActionResult nhap_nguyenlieu_tuluongkhac([FromBody] dynamic obj)
        {
            string query_str = "nhap_phuongtien_luong";

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
        [Route("xoa_pt_luong"), HttpPost]
        public IHttpActionResult phuongtien_luong_delete([FromBody] dynamic obj)
        {
            string query_str = "phuongtien_luong_delete";

            object[] aParams = new object[2];
            try
            {
                aParams[0] = helper.BuildParameter("ma_luong", obj.ma_luong, System.Data.SqlDbType.NVarChar);
                aParams[1] = helper.BuildParameter("ma_pt", obj.ma_pt, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
       [Route("get_phuongtien_byluong"), HttpPost]
        public IHttpActionResult get_phuongtien_byluong([FromBody] dynamic obj)
        {
            string query_str = "get_phuongtien_byluong";

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
    }
}
