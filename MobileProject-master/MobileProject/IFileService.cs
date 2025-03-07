using System.Threading.Tasks;

namespace MobileProject
{
    public interface IFileService
    {
        string SaveFileToExternalStorage(string fileName, string filePath);

        Task SaveExcelFileAsync(byte[] fileData, string fileName);
    }
}