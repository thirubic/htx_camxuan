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
        
    }
}
