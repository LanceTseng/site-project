using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace FlickrViewer
{
    internal class Thumbnail
    {
        public int Height { get; set; } = 100;
        public int Width { get; set; } = 100;

        public Image ThumbNailImage { get; set; }

        public string FilePath(string thumbnailFileName)
        {
            string rootDebugPath = AppDomain.CurrentDomain.BaseDirectory + "image";
            string fullPath = Path.Combine(rootDebugPath, thumbnailFileName);
            return fullPath;
        }

        public void GenerateThumbnail(byte[] imageBytes)
        {
            Image fullSizeImg = Image.FromStream(new MemoryStream(imageBytes));
            ThumbNailImage = fullSizeImg.GetThumbnailImage(Width, Height, ThumbnailCallback, IntPtr.Zero);
            fullSizeImg.Dispose();
        }

        public void Save(string thumbnailFileName)
        {
            ThumbNailImage.Save(FilePath(thumbnailFileName), ImageFormat.Jpeg);
        }
        
        public bool ThumbnailCallback()
        {
            return false;
        }
    }
}