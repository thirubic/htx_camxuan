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
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System.IO;
using System.Net.Http.Headers;
using System.Web;
using System.Text;
using System.Configuration;

namespace API_TPL.Controllers.Congviec
{
    [Authorize]
    [RoutePrefix("api/baocao")]
    public class BaocaoController : ApiController
    {
        static String connString = ConfigurationManager.ConnectionStrings["PHANBONConnection"].ToString();
        SQL_DBHELPERs helper = new SQL_DBHELPERs(connString);

        [Route("baocao_thanhpham"), HttpPost]
        public IHttpActionResult baocao_thanhpham([FromBody] dynamic obj)
        {
            string query_str = "baocao_thanhpham";

            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("ma_xuong", obj.ma_xuong, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, kq));
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("baocao_thanhpham_exp"), HttpPost]
        public IHttpActionResult baocao_thanhpham_exp([FromBody] dynamic obj)
        {
           
            string query_str = "baocao_thanhpham";
           
            object[] aParams = new object[1];
            try
            {
                aParams[0] = helper.BuildParameter("ma_xuong", obj.ma_xuong, System.Data.SqlDbType.NVarChar);

                DataTable kq = helper.ExecuteQueryStoreProcedure(query_str, aParams);

                string templateDocument = HttpContext.Current.Server.MapPath("~/Templates/Baocaothanhpham.xlsx");

                MemoryStream output = new MemoryStream();

                using (FileStream templateDocumentStream = File.OpenRead(templateDocument))
                {
                    using (ExcelPackage package = new ExcelPackage(templateDocumentStream))
                    {
                        ExcelWorksheet sheet = package.Workbook.Worksheets["thongkethanhpham"];

                        int startRow = 4;
                        int rowIndex = startRow;
                        int SL = startRow + kq.Rows.Count + 1;
                        for (int i = 0; i < kq.Rows.Count; i++)
                        {
                            sheet.Cells[rowIndex, 2].Value = (i+1).ToString();
                            sheet.Cells[rowIndex, 3].Value = kq.Rows[i]["ten_xuong"].ToString();
                            sheet.Cells[rowIndex, 4].Value = kq.Rows[i]["ten_kho"].ToString();
                            sheet.Cells[rowIndex, 5].Value = kq.Rows[i]["ten_vattu"].ToString();
                            sheet.Cells[rowIndex, 6].Value = kq.Rows[i]["soluong"].ToString();
                            sheet.Cells[rowIndex, 7].Value = kq.Rows[i]["tong_khoiluong"].ToString();
                            sheet.Cells[rowIndex, 8].Value = kq.Rows[i]["donvi_tinh"].ToString();
                            rowIndex++;
                        }
                        
                        using (ExcelRange range = sheet.Cells[startRow, 2, rowIndex - 1, 14])
                        {
                            range.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            range.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            range.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            range.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        }
                        package.SaveAs(output);
                    }
                }

                string documentName = string.Format("Baocaothanhpham.{0}", "xlsx");

                HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);

                byte[] m = output.ToArray();
                // Reset Stream Position
                output.Position = 0;
                result.Content = new ByteArrayContent(m);

                // Generic Content Header
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");

                //Set Filename sent to client
                result.Content.Headers.ContentDisposition.FileName = documentName;

                return ResponseMessage(result);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
    }
    public class SubData
    {
        public string MA_DV { get; set; }
        public int LOAI_CV { get; set; }
        public string TUNGAY { get; set; }
        public string DENNGAY { get; set; }
        public int TINHCHAT { get; set; }
    }
}
