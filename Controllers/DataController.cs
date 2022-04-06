using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DevTest1.Controllers
{
    [ApiController]

    public class DataController : Controller
    {
        [HttpPost("data/page", Name = "page")]
        public JsonResult page([FromBody] ParamsObj paramsObj)
        {

            try
            {
                //https://jsonplaceholder.typicode.com/photos
                string Json = string.Empty;
                string url = @"https://jsonplaceholder.typicode.com/photos";

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.AutomaticDecompression = DecompressionMethods.GZip;

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream))
                {
                    Json = reader.ReadToEnd();
                }

                List<RootImgObj> RootImgObjs = JsonConvert.DeserializeObject<List<RootImgObj>>(Json);

                RootImgObjs = RootImgObjs.GetRange(paramsObj.from, paramsObj.itemsPerPage); // Retrieves 10 items starting with index #50

                return new JsonResult(new { Result = "OK", Data = RootImgObjs });

            }
            catch (Exception ex)
            {

                return new JsonResult(new { Result = "ERROR", Data = ex.Message });

            }
        }
        public class ParamsObj
        {
            public int from { get; set; }
            public int itemsPerPage { get; set; }

        }
        public class RootImgObj
        {
            public int albumId { get; set; }
            public int id { get; set; }
            public string title { get; set; }
            public string url { get; set; }
            public string thumbnailUrl { get; set; }
        }
    }
}
