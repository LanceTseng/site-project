using MongoDB.Bson;
using MongoDB.Driver;

namespace ConnectMongoDb;

public class Helper
{
    //Project name: "MDB_EDU"
    //Cluster name: "myAtlasClusterEDU"
    //Database user: "myAtlasDBUser"
    //Password: "myatlas-001"
    //Permissions: "readWriteAnyDatabase"

    public string AtlasUri =
        "mongodb+srv://myAtlasDBUser:myatlas-001@myatlasclusteredu.bi022rb.mongodb.net/?retryWrites=true&w=majority";

    public static void DbConnectionTest()
    {
        const string connectionUri = "mongodb+srv://myAtlasDBUser:myatlas-001@myatlasclusteredu.bi022rb.mongodb.net/?retryWrites=true&w=majority";
        var settings = MongoClientSettings.FromConnectionString(connectionUri);
        // Set the ServerApi field of the settings object to set the version of the Stable API on the client
        settings.ServerApi = new ServerApi(ServerApiVersion.V1);
        // Create a new client and connect to the server
        var client = new MongoClient(settings);
        // Send a ping to confirm a successful connection
        try
        {
            var result = client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));
            Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");

            var dbList = client.ListDatabases().ToList();
            foreach (var db in dbList)
            {
                Console.WriteLine(db);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

}