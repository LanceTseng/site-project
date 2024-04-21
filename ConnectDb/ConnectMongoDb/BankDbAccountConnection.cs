using ConnectMongoDb.Model;
using MongoDB.Driver;

namespace ConnectMongoDb;

public class BankDbAccountConnection
{
    //var clinet = new MongoClient(new Helper().AtlasUri);
    //var db = clinet.GetDatabase("bank");
    //var accountCollection = db.GetCollection<Account>("account");

    public string DbName = "bank";

    private MongoClient MongoClient { get; set; }

    private IMongoDatabase MongoDatabase { get; set; }

    public IMongoCollection<Account> AccountCollection { get; set; }

    private BankDbAccountConnection()
    {
        MongoClient = new MongoClient( new Helper().AtlasUri);
        MongoDatabase = MongoClient.GetDatabase(DbName);
        AccountCollection = MongoDatabase.GetCollection<Account>("accounts");
    }

    //private IMongoDatabase MongoClient
    //{
    //    get
    //    {
    //        return MongoClient;
    //    }
    //    set
    //    {
    //        value = Client.GetDatabase(DbName);
    //    }
    //}

    //public IMongoCollection<Account> AccountCollection
    //{
    //    get
    //    {
    //        return AccountCollection;
    //    }
    //    set
    //    {
    //        value = MongoClient.GetCollection<Account>("account");
    //    }
    //}
}