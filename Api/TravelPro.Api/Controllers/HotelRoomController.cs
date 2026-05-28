using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices.ComTypes;
using System.Web.Http;
using System.Web.Http.Cors;
using TravelPro.Api.Dtos;
using TravelPro.Model;

namespace TravelPro.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HotelRoomController : ApiController
    {

        public string SaveImage(string img)
        {
            Guid id = Guid.NewGuid();
            var imgData = img.Substring(img.IndexOf(",") + 1);
            byte[] bytes = Convert.FromBase64String(imgData);

            using (MemoryStream ms = new MemoryStream(bytes))
            {
                Image image = Image.FromStream(ms);
                Bitmap b = new Bitmap(image);
                string filePath = System.Web.HttpContext.Current.Server.MapPath("~")
                    + "UploadedFiles\\" + id + ".jpg";

                b.Save(filePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                return  "UploadedFiles\\" + id + ".jpg";
            }

            
        }

        [HttpPost]
        [Route("AddHotelRoom")]
        public bool AddHotelRoom(HotelRoomDto dataDto)
        {
            if (dataDto != null)
            {
                using (TravelProDB context = new TravelProDB())
                {
                    if (dataDto.Id > 0)
                    {
                        var data = context.HotelRooms.FirstOrDefault(x => x.Id == dataDto.Id);
                        if (data != null)
                        {
                            data.Title = dataDto.Title;
                            data.Description = dataDto.Description;
                            data.Cost = dataDto.Cost;
                            data.Adults = dataDto.Adults;
                            data.Kids = dataDto.Kids;
                            data.HotelId = dataDto.HotelId;

                            if (!string.IsNullOrEmpty(dataDto.Image1) && !dataDto.Image1.Contains("UploadedFiles"))
                            {
                                data.Image1 = SaveImage(dataDto.Image1);
                            }
                            if (!string.IsNullOrEmpty(dataDto.Image2) && !dataDto.Image2.Contains("UploadedFiles"))
                            {
                                data.Image2 = SaveImage(dataDto.Image2);
                            }
                            if (!string.IsNullOrEmpty(dataDto.Image3) && !dataDto.Image3.Contains("UploadedFiles"))
                            {
                                data.Image3 = SaveImage(dataDto.Image3);
                            }
                            if (!string.IsNullOrEmpty(dataDto.Image4) && !dataDto.Image1.Contains("UploadedFiles"))
                            {
                                data.Image4 = SaveImage(dataDto.Image4);
                            }
                            if (!string.IsNullOrEmpty(dataDto.Image5) && !dataDto.Image1.Contains("UploadedFiles"))
                            {
                                data.Image5 = SaveImage(dataDto.Image5);
                            }

                            context.SaveChanges();
                            return true;
                        }
                        return false;
                    }
                    else
                    {
                        HotelRoom obj = new HotelRoom();
                        obj.Title = dataDto.Title;
                        obj.Description = dataDto.Description;
                        obj.Cost = dataDto.Cost;
                        obj.Adults = dataDto.Adults;
                        obj.Kids = dataDto.Kids;
                        obj.HotelId = dataDto.HotelId;
                        obj.IsActive = true;

                        if (!string.IsNullOrEmpty(dataDto.Image1) )
                        {
                            obj.Image1 = SaveImage(dataDto.Image1);
                        }
                        if (!string.IsNullOrEmpty(dataDto.Image2))
                        {
                            obj.Image2 = SaveImage(dataDto.Image2);
                        }
                        if (!string.IsNullOrEmpty(dataDto.Image3))
                        {
                            obj.Image3 = SaveImage(dataDto.Image3);
                        }
                        if (!string.IsNullOrEmpty(dataDto.Image4))
                        {
                            obj.Image4 = SaveImage(dataDto.Image4);
                        }
                        if (!string.IsNullOrEmpty(dataDto.Image5))
                        {
                            obj.Image5 = SaveImage(dataDto.Image5);
                        }

                        context.HotelRooms.Add(obj);
                        context.SaveChanges();
                        return true;
                    }
                }
            }
            return false;
        }

        [HttpGet]
        [Route("DeleteHotelRoom/{id}")]
        public bool DeleteHotelRoom(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.HotelRooms.FirstOrDefault(x => x.Id == id);
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
        [Route("GetHotelRoomById/{id}")]
        public HotelRoomDto GetHotelRoomById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.HotelRooms
                    .Where(x => x.IsActive && x.Id == id)
                    .Select(x => new HotelRoomDto
                    {
                        Id = x.Id,
                        HotelId = x.HotelId,
                        Title = x.Title,
                        Description = x.Description,
                        Cost = x.Cost,
                        Adults = x.Adults,
                        Kids = x.Kids,
                        Image1 = x.Image1,
                        Image2 = x.Image2,
                        Image3 = x.Image3,
                        Image4 = x.Image4,
                        Image5 = x.Image5,
                        IsActive = x.IsActive,
                        Hotel = new HotelDto
                        {
                            Id = x.Hotel.Id,
                            Name = x.Hotel.Name
                        }
                    }).FirstOrDefault();
            }
        }


        [HttpGet]
        [Route("HotelRoomList/{hotelId}")]
        public List<HotelRoomDto> HotelRoomList(long hotelId)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.HotelRooms
                     .Where(x => x.IsActive && x.HotelId == hotelId)
                    .Select(x => new HotelRoomDto
                    {
                        Id = x.Id,
                        HotelId = x.HotelId,
                        Title = x.Title,
                        Cost = x.Cost,
                        Adults = x.Adults,
                        Kids = x.Kids,
                        Image1 = x.Image1,
                        Image2 = x.Image2,
                        Image3 = x.Image3,
                        Image4 = x.Image4,
                        Image5 = x.Image5,
                        IsActive = x.IsActive,

                        Hotel = new HotelDto
                        {
                            Id = x.Hotel.Id,
                            Name = x.Hotel.Name
                        }
                    }).ToList();
            }
        }



    }
}
