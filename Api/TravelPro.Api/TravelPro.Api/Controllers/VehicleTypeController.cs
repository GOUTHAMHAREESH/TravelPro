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
    public class VehicleTypeController : ApiController
    {
        [HttpPost]
        [Route("AddVehicleType")]
        public IHttpActionResult AddVehicleType(VehicleTypeDto dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var nameTrimmed = (dataDto.Name ?? "").Trim();
                if (string.IsNullOrEmpty(nameTrimmed)) return BadRequest("Name is required");

                if (dataDto.Id > 0)
                {
                    var data = context.VehicleTypes.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    var names = context.VehicleTypes.Where(x => x.Id != dataDto.Id && x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A vehicle type with this name already exists.");

                    data.Name = dataDto.Name;
                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    var names = context.VehicleTypes.Where(x => x.IsActive && x.Name != null).Select(x => x.Name).ToList();
                    var duplicate = names.Any(n => (n ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A vehicle type with this name already exists.");

                    VehicleType obj = new VehicleType();
                    obj.Name = dataDto.Name;
                    obj.IsActive = true;

                    context.VehicleTypes.Add(obj);
                    context.SaveChanges();
                    return Ok(true);
                }
            }
        }

        [HttpGet]
        [Route("GetVehicleTypeById/{id}")]
        public VehicleTypeDto GetVehicleTypeById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var dataSourceResult = context.VehicleTypes.Where(x => x.IsActive == true && x.Id == id)
                    .Select(x => new VehicleTypeDto
                    {
                        Id = x.Id,
                        IsActive = x.IsActive,
                        Name = x.Name,
                    }).ToList().FirstOrDefault();

                return dataSourceResult;
            }



        }

        [HttpGet]
        [Route("VehicleTypeList")]
        public List<VehicleTypeDto> VehicleTypeList()
        {
            List<VehicleTypeDto> DtoList;
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.VehicleTypes.Where(x => x.IsActive == true)
                    .Select(x => new VehicleTypeDto
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
