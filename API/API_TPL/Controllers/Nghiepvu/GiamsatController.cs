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
    [RoutePrefix("api/giamsat")]
    public class GiamsatController : ApiController
    {
        static String connString = ConfigurationManager.ConnectionStrings["PHANBONConnection"].ToString();
        SQL_DBHELPERs helper = new SQL_DBHELPERs(connString);
        TelegramBotClient botClient;
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
                for (var i = 0; i < kq.Rows.Count; i++)
                {

                    var noidung = "<b>*=============TÌNH HÌNH SẢN XUẤT ===============*" + "</b>";
                    noidung = noidung + "\n<b>Luống " + kq.Rows[i]["ma_luong"] + " đã chuyển sang trạng thái "+ kq.Rows[i]["ten_trangthai"] + "</b>";
                    noidung = noidung + "\n<b>Vào ngày: " + kq.Rows[i]["ngay_capnhat"] + "</b>";
                    noidung = noidung + "\n<b>Ghi chú: " + kq.Rows[i]["mota"] + "</b>";
                    sendTeleMessage(noidung, "-967453591", "6127285473:AAGiPtBGszROgZYEYCHP9AdljyNmNFSRs-o");
                }
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
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
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
        private void sendTeleMessage(string noidung, string chatid, string token)
        {
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string _key_tele = token.ToString();
            string chat_id = chatid;
            botClient = new TelegramBotClient(_key_tele);
            try
            {
                var task = Task.Run(async () => await botClient.SendTextMessageAsync(
                  chatId: chat_id,
                  text: noidung,
                  parseMode: ParseMode.Html,
                  disableNotification: true
                ));
                var result = task.Result;
            }
            catch (Exception ex)
            {
                return;
            }

        }
    }
}
