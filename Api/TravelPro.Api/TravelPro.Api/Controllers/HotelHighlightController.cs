using System;
using System.Collections.Generic;
using System.Data.Entity;
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
    public class HotelHighlightController : ApiController
    {
        [HttpPost]
        [Route("AddHotelHighlight")]
        public bool AddHotelHighlight(HotelHighlightDto dataDto)
        {
            if (dataDto != null)
            {
                using (TravelProDB context = new TravelProDB())
                {
                    if (dataDto.Id > 0)
                    {
                        var data = context.HotelHighlights.FirstOrDefault(x => x.Id == dataDto.Id);
                        if (data != null)
                        {
                            data.HotelId = dataDto.HotelId;
                            data.Description = dataDto.Description;
                            data.Type = dataDto.Type;

                            context.Entry(data).State = EntityState.Modified;
                            context.SaveChanges();
                            return true;
                        }
                        return false;
                    }
                    else
                    {
                        HotelHighlight obj = new HotelHighlight();
                        obj.HotelId = dataDto.HotelId;
                        obj.Description = dataDto.Description;
                        obj.Type = dataDto.Type;
                        obj.IsActive = true;

                        context.HotelHighlights.Add(obj);
                        context.SaveChanges();
                        return true;
                    }
                }
            }
            return false;
        }

        [HttpGet]
        [Route("DeleteHotelHighlight/{id}")]
        public bool DeleteHotelHighlight(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (id != 0)
                {
                    var data = context.HotelHighlights.FirstOrDefault(x => x.Id == id);
                    if (data != null)
                    {
                        data.IsActive = false;
                        context.Entry(data).Property(x => x.IsActive).IsModified = true;
                    }

                    context.SaveChanges();
                    return true;
                }
            }
            return false;
        }


        [HttpGet]
        [Route("GetHotelHighlightById/{id}")]
        public HotelHighlightDto GetHotelHighlightById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.HotelHighlights
                    .Where(x => x.IsActive && x.Id == id)
                    .Select(x => new HotelHighlightDto
                    {
                        Id = x.Id,
                        HotelId = x.HotelId,
                        Description = x.Description,
                        Type = x.Type,
                        IsActive = x.IsActive,
                        Hotel = new HotelDto
                        {
                            Id = x.Hotel.Id,
                            Name = x.Hotel.Name
                        }
                    })
                    .FirstOrDefault();

                return data;
            }
        }


        [HttpGet]
        [Route("HotelHighlightList/{id}")]
        public List<HotelHighlightDto> HotelHighlightList(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.HotelHighlights
                    .Where(x => x.IsActive && x.HotelId == id)
                    .Select(x => new HotelHighlightDto
                    {
                        Id = x.Id,
                        HotelId = x.HotelId,
                        Description = x.Description,
                        Type = x.Type,
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
