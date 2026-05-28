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
    public class CountryController : ApiController
    {
        [HttpPost]
        [Route("AddCountry")]
        public IHttpActionResult AddCountry(CountryDto dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var nameTrimmed = (dataDto.Name ?? "").Trim();
                if (string.IsNullOrEmpty(nameTrimmed)) return BadRequest("Name is required");

                if (dataDto.Id > 0)
                {
                    var data = context.Countries.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    var names = context.Countries.Where(x => x.Id != dataDto.Id && x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A country with this name already exists.");

                    data.Name = dataDto.Name;
                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    var names = context.Countries.Where(x => x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A country with this name already exists.");

                    Country Country = new Country();
                    Country.Name = dataDto.Name;
                    Country.IsActive = true;

                    context.Countries.Add(Country);
                    context.SaveChanges();
                    return Ok(true);
                }
            }
        }

        [HttpGet]
        [Route("DeleteCountry/{id}")]
        public bool DeleteCountry(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (id != 0)
                {
                    var Delete = context.Countries.FirstOrDefault(x => x.Id == id);
                    if (Delete != null)
                    {
                        Delete.IsActive = false;
                        context.Entry(Delete).Property(x => x.IsActive).IsModified = true;

                    }
                    context.SaveChanges();
                    return true;
                }
            }
            return false;
        }



        [HttpGet]
        [Route("GetCountryById/{id}")]
        public CountryDto GetCountryById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var dataSourceResult = context.Countries.Where(x => x.IsActive == true && x.Id == id)
                    .Select(x => new CountryDto
                    {
                        Id = x.Id,
                        IsActive = x.IsActive,
                        Name = x.Name,
                    }).ToList().FirstOrDefault();

                return dataSourceResult;
            }



        }

        [HttpGet]
        [Route("CountryList")]
        public List<CountryDto> CountryList()
        {
            List<CountryDto> DtoList;
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Countries.Where(x => x.IsActive == true)
                    .Select(x => new CountryDto
                    {
                        Id = x.Id,
                        IsActive = x.IsActive,
                        Name = x.Name,

                    }).ToList();

                DtoList = data;
            }
            return DtoList;
        }
    }
}
