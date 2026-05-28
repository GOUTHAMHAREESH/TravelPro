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
    public class HotelTypeController : ApiController
    {
        [HttpPost]
        [Route("AddHotelType")]
        public IHttpActionResult AddHotelType(HotelType dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var nameTrimmed = (dataDto.Name ?? "").Trim();
                if (string.IsNullOrEmpty(nameTrimmed)) return BadRequest("Name is required");

                if (dataDto.Id > 0)
                {
                    var data = context.HotelTypes.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    var names = context.HotelTypes.Where(x => x.Id != dataDto.Id && x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A hotel type with this name already exists.");

                    data.Name = dataDto.Name;
                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    var names = context.HotelTypes.Where(x => x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A hotel type with this name already exists.");

                    HotelType hotel = new HotelType();
                    hotel.Name = dataDto.Name;
                    hotel.IsActive = true;
                    context.HotelTypes.Add(hotel);
                    context.SaveChanges();
                    return Ok(true);
                }
            }
        }

        [HttpGet]
        [Route("DeleteHotelType/{id}")]
        public bool DeleteHotelType(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.HotelTypes.FirstOrDefault(x => x.Id == id);
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
        [Route("HotelTypeList")]
        public List<HotelTypeDto> HotelTypeList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                return  context.HotelTypes.Where(x => x.IsActive == true)
                    .Select(x => new HotelTypeDto
                    {
                        Id = x.Id,
                        IsActive = x.IsActive,
                        Name = x.Name,

                    }).ToList();
            }
        }

    }
}
