using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using TravelPro.Api.Dtos;
using TravelPro.Model;

namespace TravelPro.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/UserVerification")]
    public class UserVerificationController : ApiController
    {
        [HttpGet]
        [Route("PendingUsers")]
        public List<PendingUserDto> PendingUsers()
        {
            using (TravelProDB context = new TravelProDB())
            {
                var list = context.Users
                    .Where(u => !u.IsVerified && (u.Role == "Customer" || u.Role == "Driver" || u.Role == "Hotel" || u.Role == "Agency"))
                    .Select(u => new PendingUserDto
                    {
                        Id = u.Id,
                        UserName = u.UserName,
                        Role = u.Role,
                        CustomerId = u.CustomerId,
                        DriverId = u.DriverId,
                        HotelId = u.HotelId,
                        CustomerName = u.CustomerId != null ? u.Customer.Name : null,
                        DriverName = u.DriverId != null ? u.Driver.Name : null,
                        HotelName = u.HotelId != null ? u.Hotel.Name : null,
                        AgencyId = u.AgencyId,
                        AgencyName = u.AgencyId != null ? u.Agency.Name : null
                    })
                    .ToList();

                foreach (var u in list)
                {
                    if (u.Role == "Driver" && u.DriverId.HasValue)
                    {
                        var d = context.Drivers.Where(x => x.Id == u.DriverId.Value).Select(x => new { x.LicenseDocument }).FirstOrDefault();
                        if (d != null)
                        {
                            u.DocumentPath = d.LicenseDocument;
                            u.DocumentLabel = "License";
                        }
                    }
                    else if (u.Role == "Hotel" && u.HotelId.HasValue)
                    {
                        var h = context.Hotels.Where(x => x.Id == u.HotelId.Value).Select(x => new { x.RegistrationCertificate }).FirstOrDefault();
                        if (h != null)
                        {
                            u.DocumentPath = h.RegistrationCertificate;
                            u.DocumentLabel = "Registration Certificate";
                        }
                    }
                    else if (u.Role == "Agency" && u.AgencyId.HasValue)
                    {
                        var a = context.Agencies.Where(x => x.Id == u.AgencyId.Value).Select(x => new { x.RegistrationDocument }).FirstOrDefault();
                        if (a != null)
                        {
                            u.DocumentPath = a.RegistrationDocument;
                            u.DocumentLabel = "Agency Registration";
                        }
                    }
                }
                return list;
            }
        }

        [HttpGet]
        [Route("ApproveUser/{id}")]
        public IHttpActionResult ApproveUser(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var user = context.Users.FirstOrDefault(u => u.Id == id);
                if (user == null) return NotFound();

                user.IsVerified = true;
                context.Entry(user).State = EntityState.Modified;
                context.SaveChanges();
                return Ok(true);
            }
        }
    }
}
