using System;
using System.IO;
using System.Threading.Tasks;
using Android.Content;
using Android.Provider;
using MobileProject.Droid;
using Xamarin.Forms;

[assembly: Dependency(typeof(FileService))]
namespace MobileProject.Droid
{
    public class FileService : IFileService
    {
        public string SaveFileToExternalStorage(string fileName, string filePath)
        {
            throw new NotImplementedException();
        }

        public async Task SaveExcelFileAsync(byte[] fileData, string fileName)
        {
            try
            {
                var context = Android.App.Application.Context;
                var contentResolver = context.ContentResolver;

                // Create a new ContentValues object for MediaStore
                ContentValues values = new ContentValues();
                values.Put(MediaStore.IMediaColumns.DisplayName, fileName);
                values.Put(MediaStore.IMediaColumns.MimeType, "application/vnd.ms-excel");
                values.Put(MediaStore.Downloads.InterfaceConsts.RelativePath, Android.OS.Environment.DirectoryDownloads);

                // Insert file into MediaStore
                var uri = contentResolver.Insert(MediaStore.Downloads.ExternalContentUri, values);
                if (uri == null)
                {
                    Console.WriteLine("Failed to create MediaStore entry.");
                    return;
                }

                // Write file data to the stream
                using (var stream = contentResolver.OpenOutputStream(uri))
                {
                    if (stream != null)
                    {
                        await stream.WriteAsync(fileData, 0, fileData.Length);
                        await stream.FlushAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving file: {ex.Message}");
            }
        }
    }
}