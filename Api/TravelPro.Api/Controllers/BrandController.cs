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
    public class BrandController : ApiController
    {
        [HttpPost]
        [Route("AddBrand")]
        public IHttpActionResult AddBrand(Brand dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var nameTrimmed = (dataDto.Name ?? "").Trim();
                if (string.IsNullOrEmpty(nameTrimmed)) return BadRequest("Name is required");

                if (dataDto.Id > 0)
                {
                    var data = context.Brands.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    var names = context.Brands.Where(x => x.Id != dataDto.Id && x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A brand with this name already exists.");

                    data.Name = dataDto.Name;

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

                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    var names = context.Brands.Where(x => x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A brand with this name already exists.");

                    Brand brand = new Brand();
                    brand.Name = dataDto.Name;
                    brand.IsActive = true;

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
                            brand.Photo = "UploadedFiles\\" + id + ".jpg";
                        }

                    context.Brands.Add(brand);
                    context.SaveChanges();
                    return Ok(true);
                }
            }
        }

        [HttpGet]
        [Route("DeleteBrand/{id}")]
        public bool DeleteBrand(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Brands.FirstOrDefault(x => x.Id == id);
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
        [Route("BrandList")]
        public List<BrandDto> BrandList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Brands.Where(x => x.IsActive == true)
                   .Select(x => new BrandDto
                   {
                       Id = x.Id,
                       IsActive = x.IsActive,
                       Name = x.Name,
                       Photo = x.Photo,
                   }).ToList();

                return data;
            }
        }

    }
}
