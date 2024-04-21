namespace ConnectDatastax.Model;

public class User
{
    public string user_id { get; set; }
    public string password { get; set; }
}

public class DocumentObject
{
    public User documentId { get; set; }

    public DocumentObject()
    {
        // 在构造函数中初始化 documentId 属性
        documentId = new User();
    }
}