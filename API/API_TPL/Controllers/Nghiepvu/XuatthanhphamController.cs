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
    [RoutePrefix("api/xuatthanhpham")]
    public class XuatthanhphamController : ApiController
    {
        static String connString = ConfigurationManager.ConnectionStrings["PHANBONConnection"].ToString();
        SQL_DBHELPERs helper = new SQL_DBHELPERs(connString);

        [Route("getbyloai"), HttpPost]
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
        [Route("themmoi_thanhpham_kho"), HttpPost]
        public IHttpActionResult themmoi_thanhpham_kho([FromBody] dynamic obj)
        {
            string query_str = "themmoi_thanhpham_kho";

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
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
    }
}
