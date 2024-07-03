// Fig. 23.4: FickrViewerForm.cs
// Invoking a web service asynchronously with class HttpClient
using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;

namespace FlickrViewer
{
    public partial class FickrViewerForm : Form
    {
        // Use your Flickr API key here--you can get one at:
        // https://www.flickr.com/services/apps/create/apply
        private const string KEY = "API_KEY";

        // object used to invoke Flickr web service
        private static HttpClient flickrClient = new HttpClient();

        private Task<string> flickrTask = null; // Task<string> that queries Flickr

        public FickrViewerForm()
        {
            InitializeComponent();
            DeleteAllThumbnail();
        }

        // initiate asynchronous Flickr search query;
        // display results when query completes
        private async void searchButton_Click(object sender, EventArgs e)
        {
            // if flickrTask already running, prompt user
            if (flickrTask?.Status != TaskStatus.RanToCompletion)
            {
                var result = MessageBox.Show(
                   "Cancel the current Flickr search?",
                   "Are you sure?", MessageBoxButtons.YesNo,
                   MessageBoxIcon.Question);

                // determine whether user wants to cancel prior search
                if (result == DialogResult.No)
                {
                    return;
                }
                else
                {
                    flickrClient.CancelPendingRequests(); // cancel search
                }
            }

            // Flickr's web service URL for searches
            var flickrURL = "https://api.flickr.com/services/rest/?method=" +
               $"flickr.photos.search&api_key={KEY}&" +
               $"tags={inputTextBox.Text.Replace(" ", ",")}" +
               "&tag_mode=all&per_page=500&privacy_filter=1";

            imagesListBox.DataSource = null; // remove prior data source
            imagesListBox.Items.Clear(); // clear imagesListBox
            pictureBox.Image = null; // clear pictureBox
            imagesListBox.Items.Add("Loading..."); // display Loading...

            // invoke Flickr web service to search Flick with user's tags
            flickrTask = flickrClient.GetStringAsync(flickrURL);

            // await flickrTask then parse results with XDocument and LINQ
            XDocument flickrXML = XDocument.Parse(await flickrTask);

            // gather information on all photos
            var flickrPhotos =
               from photo in flickrXML.Descendants("photo")
               let id = photo.Attribute("id").Value
               let title = photo.Attribute("title").Value
               let secret = photo.Attribute("secret").Value
               let server = photo.Attribute("server").Value
               let farm = photo.Attribute("farm").Value
               select new FlickrResult
               {
                   Title = title,
                   URL = $"https://farm{farm}.staticflickr.com/" +
                     $"{server}/{id}_{secret}.jpg"
               };
            imagesListBox.Items.Clear(); // clear imagesListBox

            // set ListBox properties only if results were found
            if (flickrPhotos.Any())
            {
                imagesListBox.DataSource = flickrPhotos.ToList();
                imagesListBox.DisplayMember = "Title";
            }
            else // no matches were found
            {
                imagesListBox.Items.Add("No matches");
            }
        }

        // display selected image
        private async void imagesListBox_SelectedIndexChanged(
           object sender, EventArgs e)
        {
            try
            {
                if (imagesListBox.SelectedItem != null)
                {
                    string selectedURL = ((FlickrResult)imagesListBox.SelectedItem).URL;

                    // use HttpClient to get selected image's bytes asynchronously
                    byte[] imageBytes = await flickrClient.GetByteArrayAsync(selectedURL);

                    // display downloaded image in pictureBox
                    using (var memoryStream = new MemoryStream(imageBytes))
                    {
                        pictureBox.Image = Image.FromStream(memoryStream);
                    }

                    var fileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + "_tbn.jpeg";
                    var thumbnail = new Thumbnail();
                    thumbnail.GenerateThumbnail(imageBytes);
                    Action download = () =>
                    {
                        thumbnail.Save(fileName);
                    };

                    Action display = () =>
                    {
                        if (pictureBox1.InvokeRequired)
                        {
                            pictureBox1.Invoke(new MethodInvoker(delegate
                            {
                                pictureBox1.Image = thumbnail.ThumbNailImage;
                            }));
                        }
                    };

                    await Task.Run(() =>
                    {
                        Parallel.Invoke(download, display);
                    });

                    Thread.Sleep(1000);
                }
            }
            catch (Exception exception)
            {
                MessageBox.Show(exception.Message);
            }

        }

        // download selected image
        //public void GenerateThumbnail(byte[] imageBytes, string thumbnailFileName)
        //{
        //    var tbn = new Thumbnail();
        //    int imageHeight = tbn.Height;
        //    int imageWidth = tbn.Width;

        //    Image fullSizeImg = Image.FromStream(new MemoryStream(imageBytes));
        //    Image.GetThumbnailImageAbort dummyCallBack = new Image.GetThumbnailImageAbort(ThumbnailCallback);
        //    Image thumbNailImage = fullSizeImg.GetThumbnailImage(imageWidth, imageHeight, dummyCallBack, IntPtr.Zero);
        //    thumbNailImage.Save(tbn.FilePath(thumbnailFileName), ImageFormat.Jpeg);
        //    thumbNailImage.Dispose();
        //    fullSizeImg.Dispose();
        //}


        //display image

        public void DeleteAllThumbnail()
        {
            var tbn = new Thumbnail();
            if (Directory.Exists(tbn.FilePath("")))
            {
                // Get all files in the directory
                string[] files = Directory.GetFiles(tbn.FilePath(""));

                // Delete each file
                foreach (string file in files)
                {
                    File.Delete(file);
                    Console.WriteLine($"Deleted file: {file}");
                }
            }
        }

        private void btnOpenFilePath_Click(object sender, EventArgs e)
        {
            var tbn = new Thumbnail();
            if (Directory.Exists(tbn.FilePath("")))
            {
                Process.Start(tbn.FilePath(""));
            }
        }
    }
}

/**************************************************************************
 * (C) Copyright 1992-2017 by Deitel & Associates, Inc. and               *
 * Pearson Education, Inc. All Rights Reserved.                           *
 *                                                                        *
 * DISCLAIMER: The authors and publisher of this book have used their     *
 * best efforts in preparing the book. These efforts include the          *
 * development, research, and testing of the theories and programs        *
 * to determine their effectiveness. The authors and publisher make       *
 * no warranty of any kind, expressed or implied, with regard to these    *
 * programs or to the documentation contained in these books. The authors *
 * and publisher shall not be liable in any event for incidental or       *
 * consequential damages in connection with, or arising out of, the       *
 * furnishing, performance, or use of these programs.                     *
 **************************************************************************/