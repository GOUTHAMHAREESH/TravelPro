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
    public class JourneyController : ApiController
    {
        [HttpPost]
        [Route("AddJourney")]
        public bool AddJourney(JourneyDto dataDto)
        {
            if (dataDto != null)
            {
                using (TravelProDB context = new TravelProDB())
                {
                    if (dataDto.Id > 0)
                    {
                        var data = context.Journeys.FirstOrDefault(x => x.Id == dataDto.Id);
                        if (data != null)
                        {
                            data.Title = dataDto.Title;
                            data.Description = dataDto.Description;
                            data.DateFrom = dataDto.DateFrom;
                            data.DateTo = dataDto.DateTo;
                            data.NoOfDays = dataDto.NoOfDays;
                            data.CustomerId = dataDto.CustomerId;

                            if (!string.IsNullOrEmpty(dataDto.Photo) &&
                                !dataDto.Photo.Contains("UploadedFiles"))
                            {
                                Guid id = Guid.NewGuid();
                                var imgData = dataDto.Photo.Substring(dataDto.Photo.IndexOf(",") + 1);
                                byte[] bytes = Convert.FromBase64String(imgData);

                                using (MemoryStream ms = new MemoryStream(bytes))
                                {
                                    Image image = Image.FromStream(ms);
                                    Bitmap b = new Bitmap(image);
                                    string filePath = System.Web.HttpContext.Current.Server.MapPath("~") + "UploadedFiles\\" + id + ".jpg";
                                    b.Save(filePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                                    data.Photo = "UploadedFiles\\" + id + ".jpg";
                                }
                            }

                            context.SaveChanges();
                            return true;
                        }
                        return false;
                    }
                    else
                    {
                        Journey obj = new Journey();

                        obj.Title = dataDto.Title;
                        obj.Description = dataDto.Description;
                        obj.DateFrom = dataDto.DateFrom;
                        obj.DateTo = dataDto.DateTo;
                        obj.NoOfDays = dataDto.NoOfDays;
                        obj.CustomerId = dataDto.CustomerId;
                        obj.IsActive = true;


                        if (!string.IsNullOrEmpty(dataDto.Photo) )
                        {
                            Guid id = Guid.NewGuid();
                            var imgData = dataDto.Photo.Substring(dataDto.Photo.IndexOf(",") + 1);
                            byte[] bytes = Convert.FromBase64String(imgData);

                            using (MemoryStream ms = new MemoryStream(bytes))
                            {
                                Image image = Image.FromStream(ms);
                                Bitmap b = new Bitmap(image);
                                string filePath = System.Web.HttpContext.Current.Server.MapPath("~") + "UploadedFiles\\" + id + ".jpg";
                                b.Save(filePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                                obj.Photo = "UploadedFiles\\" + id + ".jpg";
                            }
                        }

                        context.Journeys.Add(obj);
                        context.SaveChanges();
                        return true;
                    }
                }
            }
            return false;
        }

        [HttpGet]
        [Route("DeleteJourney/{id}")]
        public bool DeleteJourney(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Journeys.FirstOrDefault(x => x.Id == id);
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
        [Route("GetJourneyById/{id}")]
        public JourneyDto GetJourneyById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Journeys
                    .Where(x => x.IsActive && x.Id == id)
                    .Select(x => new JourneyDto
                    {
                        Id = x.Id,
                        Title = x.Title,
                        Description = x.Description,
                        DateFrom = x.DateFrom,
                        DateTo = x.DateTo,
                        NoOfDays = x.NoOfDays,
                        Photo = x.Photo,
                        CustomerId = x.CustomerId,
                        IsActive = x.IsActive,

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name
                        }
                    })
                    .FirstOrDefault();
            }
        }

        [HttpGet]
        [Route("JourneyList")]
        public List<JourneyDto> JourneyList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Journeys
                    .Where(x => x.IsActive)
                    .Select(x => new JourneyDto
                    {
                        Id = x.Id,
                        Title = x.Title,
                        DateFrom = x.DateFrom,
                        DateTo = x.DateTo,
                        NoOfDays = x.NoOfDays,
                        Photo = x.Photo,
                        CustomerId = x.CustomerId,
                        IsActive = x.IsActive,

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name
                        }
                    })
                    .ToList();
            }
        }

        [HttpGet]
        [Route("JourneyListByCustomer/{id}")]
        public List<JourneyDto> JourneyListByCustomer(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Journeys
                    .Where(x => x.IsActive && x.CustomerId == id)
                    .Select(x => new JourneyDto
                    {
                        Id = x.Id,
                        Title = x.Title,
                        DateFrom = x.DateFrom,
                        DateTo = x.DateTo,
                        NoOfDays = x.NoOfDays,
                        Photo = x.Photo,
                        CustomerId = x.CustomerId,
                        IsActive = x.IsActive,

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name
                        }
                    })
                    .ToList();
            }
        }

        [HttpGet]
        [Route("JourneyListByDestination/{id}")]
        public List<JourneyDto> JourneyListByDestination(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Journeys
                    .Where(x => x.IsActive && context.JourneyDestinations.Any(y=>y.DestinationId == id && y.JourneyId == x.Id))
                    .Select(x => new JourneyDto
                    {
                        Id = x.Id,
                        Title = x.Title,
                        DateFrom = x.DateFrom,
                        DateTo = x.DateTo,
                        NoOfDays = x.NoOfDays,
                        Photo = x.Photo,
                        CustomerId = x.CustomerId,
                        IsActive = x.IsActive,

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name
                        }
                    })
                    .ToList();
            }
        }
    }
}
