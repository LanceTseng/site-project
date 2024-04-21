using System.Net;
using ConnectDatastax.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ConnectDatastax
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            //table
            //var session =
            //    Cluster.Builder()
            //        .WithCloudSecureConnectionBundle(@"secure-connect-project-test.zip")
            //        //or if on linux .WithCloudSecureConnectionBundle(@"/PATH/TO/>secure-connect-project-test.zip")
            //        .WithCredentials("fzCZLvyHQRffcoUbHPAFXvuh", "dXdZI_Tr8J2Rnfs0I_pqjAmbD2.BPLsgJ,qkDJpAtsqmM+Pn,2sH4d9AGf+9ZzqU1eUku-bI2DqWk1K4oZgP,kz.kJD0.ONp9g-p4pwFXBuSSZ6quDv8F_.+Key_Ydeo")
            //        .Build()
            //        .Connect();

            //var rowSet = session.Execute("select * from system.local");
            //Console.WriteLine(rowSet.First().GetValue<string>("key"));

            //get
            string url =
                @"https://7c2bf0aa-8317-4890-bc67-2f9589cbc5bf-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/user";
            var client = new HttpClient();
            var httpRequestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(url),
                Headers = {
                    { HttpRequestHeader.Accept.ToString(), "application/json" },
                    {"X-Cassandra-Token","AstraCS:fzCZLvyHQRffcoUbHPAFXvuh:821836b72951844991cbf115c3baadf0c6058b2b20b0a65a5ebd4797c9b0e3df" },
                },

            };

            var response = client.SendAsync(httpRequestMessage).Result;
            var responseBody = response.Content.ReadAsStringAsync().Result;
            //    string jsonString = @"
            //{
            //  ""data"": {
            //    ""69f63232-5228-4b58-9252-9445d4c6484a"": {
            //      ""password"": ""Ad@123"",
            //      ""user_id"": ""admin""
            //    }
            //  }
            //}";

            JObject jsonObject = JObject.Parse(responseBody);

            // 提取 documentId
            var dataNode = jsonObject["data"];
            var documentId = dataNode.First.First;

            // 创建包含 documentId 属性的对象
            DocumentObject documentObject = new DocumentObject
            {
                documentId = JsonConvert.DeserializeObject<User>(documentId.ToString())
            };

            // 输出动态属性的值
            Console.WriteLine("User ID: " + documentObject.documentId.user_id);
            Console.WriteLine("Password: " + documentObject.documentId.password);


        }
    }
}