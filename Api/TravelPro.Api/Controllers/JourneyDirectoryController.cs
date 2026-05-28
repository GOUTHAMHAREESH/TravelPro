using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
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
    public class JourneyDirectoryController : ApiController
    {
        [HttpPost]
        [Route("AddJourneyDirectory")]
        public bool AddJourneyDirectory(JourneyDirectoryDto dataDto)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (dataDto.Id > 0)
                {
                    var data = context.JourneyDirectories.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data != null)
                    {
                        data.ContactType = dataDto.ContactType;
                        data.ContactNo = dataDto.ContactNo;
                        data.ContactPerson = dataDto.ContactPerson;
                        data.Cost = dataDto.Cost;
                        data.Description = dataDto.Description;

                        data.DestinationId = dataDto.DestinationId;
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
                    JourneyDirectory data = new JourneyDirectory();

                    data.ContactType = dataDto.ContactType;
                    data.ContactNo = dataDto.ContactNo;
                    data.ContactPerson = dataDto.ContactPerson;
                    data.Cost = dataDto.Cost;
                    data.Description = dataDto.Description;

                    data.DestinationId = dataDto.DestinationId;
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
                    context.JourneyDirectories.Add(data);
                    context.SaveChanges();
                    return true;
                }
            }
        }


        [HttpGet]
        [Route("DeleteJourneyDirectory/{id}")]
        public bool DeleteJourneyDirectory(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.JourneyDirectories.FirstOrDefault(x => x.Id == id);
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
        [Route("JourneyDirectoryList/{id}")]
        public List<JourneyDirectoryDto> JourneyDirectoryList(long id)
        {
            using (TravelProDB context = new TravelProDB())
            { 
                return context.JourneyDirectories
                    .Where(x => x.IsActive && x.JourneyDetailId == id)
                    .Select(x => new JourneyDirectoryDto
                    {
                        Id = x.Id,
                        ContactType = x.ContactType,
                        ContactNo = x.ContactNo,
                        ContactPerson = x.ContactPerson,
                        Cost = x.Cost,
                        Photo = x.Photo,
                        Description = x.Description,
                        JourneyId = x.JourneyId,
                        JourneyDetailId = x.JourneyDetailId,
                        DestinationId = x.DestinationId,
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
                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        }
                    }).ToList();
            }
        }

    }
}
