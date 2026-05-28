using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using TravelPro.Api.Dtos;
using TravelPro.Model;

namespace TravelPro.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class JourneyGalleryController : ApiController
    {
        [HttpPost]
        [Route("AddJourneyGallery")]
        public bool AddJourneyGallery(JourneyGalleryDto dataDto)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (dataDto.Id > 0)
                {
                    var data = context.JourneyGalleries.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data != null)
                    {
                        data.JourneyDetailId = dataDto.JourneyDetailId;
                        data.JourneyId = dataDto.JourneyId;

                        if (!string.IsNullOrEmpty(dataDto.Photo) &&
                               data.Photo != dataDto.Photo &&
                               !dataDto.Photo.Contains("UploadedFiles"))
                        {
                            Guid id = Guid.NewGuid();
                            var imgData = dataDto.Photo.Substring(dataDto.Photo.IndexOf(",") + 1);
                            byte[] bytes = Convert.FromBase64String(imgData);
                            Image image;
                            using (MemoryStream ms = new MemoryStream(bytes))
                            {
                                image = Image.FromStream(ms);
                            }
                            Bitmap b = new Bitmap(image);
                            string filePath = System.Web.HttpContext.Current.Server.MapPath("~") + "UploadedFiles\\" + id + ".jpg";
                            b.Save(filePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                            data.Photo = "UploadedFiles\\" + id + ".jpg";
                        }


                        context.SaveChanges();
                        return true;
                    }
                    return false;
                }
                else
                {
                    JourneyGallery data = new JourneyGallery();

                    data.JourneyDetailId = dataDto.JourneyDetailId;
                    data.JourneyId = dataDto.JourneyId;
                    data.IsActive = true;

                    if (!string.IsNullOrEmpty(dataDto.Photo))
                    {
                        Guid id = Guid.NewGuid();
                        var imgData = dataDto.Photo.Substring(dataDto.Photo.IndexOf(",") + 1);
                        byte[] bytes = Convert.FromBase64String(imgData);
                        Image image;
                        using (MemoryStream ms = new MemoryStream(bytes))
                        {
                            image = Image.FromStream(ms);
                        }
                        Bitmap b = new Bitmap(image);
                        string filePath = System.Web.HttpContext.Current.Server.MapPath("~") + "UploadedFiles\\" + id + ".jpg";
                        b.Save(filePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                        data.Photo = "UploadedFiles\\" + id + ".jpg";
                    }


                    dataDto.IsActive = true;
                    context.JourneyGalleries.Add(data);
                    context.SaveChanges();
                    return true;
                }
            }
        }


        [HttpGet]
        [Route("DeleteJourneyGallery/{id}")]
        public bool DeleteJourneyGallery(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.JourneyGalleries.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    data.IsActive = false;
                    context.Entry(data).Property(x => x.IsActive).IsModified = true;
                    context.SaveChanges();
                    return true;
                }
            }
            return false;
        }

        [HttpGet]
        [Route("JourneyGalleryList/{id}")]
        public List<JourneyGalleryDto> JourneyGalleryList(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.JourneyGalleries
                    .Where(x => x.IsActive && x.JourneyDetailId == id)
                    .Select(x => new JourneyGalleryDto
                    {
                        Id = x.Id,
                        Photo = x.Photo,
                        JourneyId = x.JourneyId,
                        JourneyDetailId = x.JourneyDetailId,
                        IsActive = x.IsActive,
                        JourneyDetail = new JourneyDetailDto
                        {
                            Id = x.JourneyDetail.Id,
                            Title = x.JourneyDetail.Title
                        },
                        Journey = new JourneyDto
                        {
                            Id = x.Journey.Id,
                            Title = x.Journey.Title
                        },
                    }).ToList();
            }
        }

    }
}
