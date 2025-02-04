namespace MobileProject.API.Models;

public class Response
{
    public int StatusCode { get; set; }
    public string StatusMessage { get; set; }

    public Response()
    {
        
    }

    public Response(int statusCode, string statusMessage)
    {
        StatusCode = statusCode;
        StatusMessage = statusMessage;
    }
  
}