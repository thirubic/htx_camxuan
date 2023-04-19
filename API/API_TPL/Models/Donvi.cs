using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_TPL.Models
{
    public class Donvi
    {
        public string id { get; set; }
        public string name { get; set; }
        public string cap { get; set; }
        public Array children { get; set; }
    }

    public class Nguonphatsinh
    {
        public string id { get; set; }
        public string ma_nguonphatsinh { get; set; }
        public string ten { get; set; }
        public string noidung { get; set; }
        public string tendonvi { get; set; }
        public string madonvi { get; set; }
        public string trangthai { get; set; }
        public List<object> file { get; set; }
    }
}