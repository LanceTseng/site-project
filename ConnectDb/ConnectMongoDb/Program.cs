using ConnectMongoDb.Model;
using MongoDB.Driver;

namespace ConnectMongoDb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            #region Db Connection
            //mongo
            var clinet = new MongoClient(new Helper().AtlasUri);
            var db = clinet.GetDatabase("bank");
            var accountCollection = db.GetCollection<Account>("account");

            //sql server


            #endregion Db Connection

            #region Interface

            var action = string.Empty;
            Console.Write("Welcome to MongoDB Bank!");
            action = Console.ReadLine();

            #endregion Interface

            do
            {
                switch (action)
                {
                    case "Rgstr":

                        break;
                    case "SignIn":

                        break;
                    case "C":
                        var newAccount = new Account
                        {
                            AccountId = "MDB202402041203",
                            AccountHolder = "Nick Pole",
                            AccountType = "checking",
                            Balance = 44
                        };
                        accountCollection.InsertOne(newAccount);

                        Console.WriteLine("Insert success");
                        break;

                    case "R":
                        var filterQ = Builders<Account>.Filter.Eq(x => x.AccountId, "MDB202402041203");

                        var resultQ = accountCollection.Find(filterQ).ToList();
                        var queryCount = resultQ.Count;

                        foreach (var account in resultQ)
                        {
                            Console.WriteLine($"{account.AccountId} / {account.AccountHolder} / {account.Balance}");
                        }

                        Console.WriteLine($"Query: {queryCount}");
                        break;

                    case "U":

                        var filterU = Builders<Account>.Filter.Eq(x => x.AccountId, "MDB202402041203");

                        var update = Builders<Account>
                            .Update
                            .Set(x => x.Balance, 4000);

                        var resultU = accountCollection.UpdateOne(filterU, update);
                        var updateCount = resultU.ModifiedCount;

                        if (resultU.IsAcknowledged)
                        {
                            Console.WriteLine($"Updated sccuessully. Mod Count:{updateCount}");
                        }

                        break;

                    case "D":
                        var filterD = Builders<Account>.Filter.Eq(x => x.AccountId, "MDB202402041203");

                        var resultD = accountCollection.DeleteOne(filterD);
                        var deleteCount = resultD.DeletedCount;
                        if (resultD.IsAcknowledged)
                        {
                            Console.WriteLine($"Delete sccuessully. Mod Count:{deleteCount}");
                        }
                        break;
                    default:
                        Console.WriteLine("C R U D");
                        break;
                }

                Console.Write("Next:");
                action = Console.ReadLine();
            } while (action != "-1");

            Console.WriteLine("End Action");
        }
    }
}