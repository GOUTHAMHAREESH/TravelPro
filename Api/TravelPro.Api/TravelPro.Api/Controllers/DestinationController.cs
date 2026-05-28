using System;
using System.Collections.Generic;
using System.Data.Entity;
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
    public class DestinationController : ApiController
    {
        [HttpPost]
        [Route("AddDestination")]
        public IHttpActionResult AddDestination(DestinationDto dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var nameTrimmed = (dataDto.Name ?? "").Trim();
                if (string.IsNullOrEmpty(nameTrimmed)) return BadRequest("Name is required");

                if (dataDto.Id > 0)
                {
                    var data = context.Destinations.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    var names = context.Destinations.Where(x => x.Id != dataDto.Id && x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A destination with this name already exists.");

                    data.Name = dataDto.Name;
                            data.Description = dataDto.Description;
                            data.CountryId = dataDto.CountryId;

                            if (dataDto.Photo != null && dataDto.Photo != "" && data.Photo != dataDto.Photo && !dataDto.Photo.Contains("UploadedFiles"))
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
                                data.Photo = string.Concat("UploadedFiles\\" + id + ".jpg");
                            }

                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                        Destination destination = new Destination();

                        destination.Name = dataDto.Name;
                        destination.Description = dataDto.Description;
                        destination.CountryId = dataDto.CountryId;
                        destination.IsActive = true;

                        if (dataDto.Photo != null && dataDto.Photo != "" )
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
                            destination.Photo = string.Concat("UploadedFiles\\" + id + ".jpg");
                        }

                    var names = context.Destinations.Where(x => x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A destination with this name already exists.");

                    context.Destinations.Add(destination);
                    context.SaveChanges();
                    return Ok(true);
                }
            }
        }


        [HttpGet]
        [Route("DeleteDestination/{id}")]
        public bool DeleteDestination(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (id != 0)
                {
                    var delete = context.Destinations.FirstOrDefault(x => x.Id == id);
                    if (delete != null)
                    {
                        delete.IsActive = false;
                        context.Entry(delete).Property(x => x.IsActive).IsModified = true;
                    }

                    context.SaveChanges();
                    return true;
                }
            }
            return false;
        }

        [HttpGet]
        [Route("GetDestinationById/{id}")]
        public DestinationDto GetDestinationById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var dataSourceResult = context.Destinations
                    .Where(x => x.IsActive == true && x.Id == id)
                    .Select(x => new DestinationDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                        Photo = x.Photo,
                        IsActive = x.IsActive,
                        CountryId = x.CountryId
                    })
                    .FirstOrDefault();

                return dataSourceResult;
            }
        }

        [HttpGet]
        [Route("DestinationList")]
        public List<DestinationDto> DestinationList()
        {
            List<DestinationDto> DtoList;

            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Destinations
                    .Where(x => x.IsActive == true)
                    .Select(x => new DestinationDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                        Photo = x.Photo,
                        IsActive = x.IsActive,
                        CountryId = x.CountryId,
                        Country = new CountryDto
                        {
                            Id = x.Country.Id,
                            Name = x.Country.Name,
                        }
                    }).ToList();

                DtoList = data;
            }

            return DtoList;
        }


    }
}
