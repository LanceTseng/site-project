using SQLite;
using Xamarin.Forms;

namespace MobileProject.Repository
{
    public class CommonRepository
    {
        private static SQLiteConnection database;

        public CommonRepository()
        {
            database =
                DependencyService.Get<IDatabaseConnection>().
                    DbConnection();
        }


    }
}