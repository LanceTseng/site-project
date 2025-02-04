
using System.IO;
using System.Reflection;
using MobileProject.Droid;
using SQLite;
using Android.App;
[assembly: Xamarin.Forms.Dependency(typeof(DatabaseConnection_Android))]
namespace MobileProject.Droid
{
    public class DatabaseConnection_Android : IDatabaseConnection
    {
        public SQLiteConnection DbConnection()
        {
            var dbName = "RestuarntDB.db";
            var personalFolderPath = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);
            var path = Path.Combine(personalFolderPath, dbName);

            // Check if the database exists in the personal folder
            if (!File.Exists(path))
            {
                // If not, copy it from the Assets folder
                using (var assetStream = Application.Context.Assets.Open(dbName))
                using (var fileStream = new FileStream(path, FileMode.CreateNew))
                {
                    assetStream.CopyTo(fileStream);
                }
            }

            return new SQLiteConnection(path);
        }
    }
}