using System;
using System.Data.Entity;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using TravelPro.Api.Dtos;
using TravelPro.Model;

namespace TravelPro.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AgencyController : ApiController
    {
        [HttpPost]
        [Route("AddAgency")]
        public IHttpActionResult AddAgency(AgencyDto dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (var context = new TravelProDB())
            {
                var emailTrimmed = (dataDto.EmailId ?? "").Trim().ToLowerInvariant();
                if (string.IsNullOrEmpty(emailTrimmed)) return BadRequest("Email is required");

                if (dataDto.Id > 0)
                {
                    var data = context.Agencies.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    var agencyEmails = context.Agencies
                        .Where(x => x.Id != dataDto.Id && x.IsActive && x.EmailId != null)
                        .Select(x => x.EmailId)
                        .ToList();
                    var userNames = context.Users
                        .Where(u => u.UserName != null && u.AgencyId != dataDto.Id)
                        .Select(u => u.UserName)
                        .ToList();

                    var duplicate = agencyEmails.Any(e => (e ?? "").Trim().ToLowerInvariant() == emailTrimmed) ||
                                    userNames.Any(u => (u ?? "").Trim().ToLowerInvariant() == emailTrimmed);
                    if (duplicate) return BadRequest("An agency with this email already exists.");

                    data.Name = dataDto.Name;
                    data.EmailId = dataDto.EmailId;
                    data.MobileNo = dataDto.MobileNo;
                    data.Location = dataDto.Location;
                    data.Address = dataDto.Address;
                    data.CountryId = dataDto.CountryId;

                   

                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    var agencyEmails = context.Agencies
                        .Where(x => x.IsActive && x.EmailId != null)
                        .Select(x => x.EmailId)
                        .ToList();
                    var userNames = context.Users
                        .Where(u => u.UserName != null)
                        .Select(u => u.UserName)
                        .ToList();

                    var duplicate = agencyEmails.Any(e => (e ?? "").Trim().ToLowerInvariant() == emailTrimmed) ||
                                    userNames.Any(u => (u ?? "").Trim().ToLowerInvariant() == emailTrimmed);
                    if (duplicate) return BadRequest("An agency with this email already exists.");

                    var agency = new Agency
                    {
                        Name = dataDto.Name,
                        EmailId = dataDto.EmailId,
                        MobileNo = dataDto.MobileNo,
                        Location = dataDto.Location,
                        Address = dataDto.Address,
                        CountryId = dataDto.CountryId,
                        IsActive = true
                    };

                    if (!string.IsNullOrEmpty(dataDto.RegistrationDocument))
                    {
                        agency.RegistrationDocument = SaveDocument(dataDto.RegistrationDocument, ".pdf");
                    }

                    context.Agencies.Add(agency);
                    context.SaveChanges();

                    // Create linked user (web registration; requires admin verification)
                    if (!string.IsNullOrWhiteSpace(dataDto.Password))
                    {
                        var user = new User();
                        user.UserName = agency.EmailId;
                        var passwordSalt = AuthenticationBL.CreatePasswordSalt(Encoding.ASCII.GetBytes(dataDto.Password));
                        user.PasswordSalt = Convert.ToBase64String(passwordSalt);
                        var password = AuthenticationBL.CreateSaltedPassword(passwordSalt, Encoding.ASCII.GetBytes(dataDto.Password));
                        user.Password = Convert.ToBase64String(password);
                        user.Role = "Agency";
                        user.AgencyId = agency.Id;
                        user.IsVerified = false;

                        context.Users.Add(user);
                        context.SaveChanges();
                    }

                    return Ok(true);
                }
            }
        }


        private static string SaveDocument(string dataUrl, string defaultExtension = ".pdf")
        {
            if (string.IsNullOrEmpty(dataUrl) || !dataUrl.Contains(",")) return null;
            var base64 = dataUrl.Substring(dataUrl.IndexOf(",") + 1);
            byte[] bytes = Convert.FromBase64String(base64);
            string ext = defaultExtension;
            if (dataUrl.StartsWith("data:application/pdf")) ext = ".pdf";
            else if (dataUrl.StartsWith("data:image/png")) ext = ".png";
            else if (dataUrl.StartsWith("data:image/jpeg") || dataUrl.StartsWith("data:image/jpg")) ext = ".jpg";
            else if (dataUrl.StartsWith("data:image/")) ext = ".jpg";
            var id = Guid.NewGuid();
            string fullPath = System.Web.HttpContext.Current.Server.MapPath("~") + "UploadedFiles\\" + id + ext;
            System.IO.File.WriteAllBytes(fullPath, bytes);
            return "UploadedFiles\\" + id + ext;
        }

        [HttpGet]
        [Route("DeleteAgency/{id}")]
        public bool DeleteAgency(long id)
        {
            using (var context = new TravelProDB())
            {
                var data = context.Agencies.FirstOrDefault(x => x.Id == id);
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
        [Route("AgencyList")]
        public System.Collections.Generic.List<AgencyDto> AgencyList()
        {
            using (var context = new TravelProDB())
            {
                return context.Agencies
                    .Where(x => x.IsActive)
                    .Select(x => new AgencyDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        EmailId = x.EmailId,
                        MobileNo = x.MobileNo,
                        Location = x.Location,
                        Address = x.Address,
                        CountryId = x.CountryId,
                        IsActive = x.IsActive,
                        Country = new CountryDto
                        {
                            Id = x.Country.Id,
                            Name = x.Country.Name
                        },
                        RegistrationDocument = x.RegistrationDocument
                    }).ToList();
            }
        }

        [HttpGet]
        [Route("AgencyById/{id}")]
        public AgencyDto AgencyById(long id)
        {
            using (var context = new TravelProDB())
            {
                return context.Agencies
                    .Where(x => x.IsActive && x.Id == id)
                    .Select(x => new AgencyDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        EmailId = x.EmailId,
                        MobileNo = x.MobileNo,
                        Location = x.Location,
                        Address = x.Address,
                        CountryId = x.CountryId,
                        IsActive = x.IsActive,
                        Country = new CountryDto
                        {
                            Id = x.Country.Id,
                            Name = x.Country.Name
                        },
                        RegistrationDocument = x.RegistrationDocument
                    }).FirstOrDefault();
            }
        }
    }
}

