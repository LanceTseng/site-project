
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ConnectMongoDb.Model
{
    internal class User
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("user_id")]
        public string UserId { get; set; }

        [BsonElement("user_password")]
        public string UserPassword { get; set; }

        [BsonElement("created")]
        public DateTime Created { get; set; }

    }
}
