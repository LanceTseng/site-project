using System;
using System.Collections.Generic;
using System.Text;

namespace MobileProject
{
    public interface IDatabaseConnection
    {
        SQLite.SQLiteConnection DbConnection();
    }
}
