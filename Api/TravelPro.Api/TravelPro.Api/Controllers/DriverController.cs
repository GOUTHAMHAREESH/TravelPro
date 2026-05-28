using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using TravelPro.Api.Dtos;
using TravelPro.Model;

namespace TravelPro.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DriverController : ApiController
    {
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

        [HttpPost]
        [Route("AddDriver")]
        public IHttpActionResult AddDriver(DriverDto dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var emailTrimmed = (dataDto.EmailId ?? "").Trim().ToLowerInvariant();
                if (string.IsNullOrEmpty(emailTrimmed)) return BadRequest("Email is required");

                if (dataDto.Id > 0)
                {
                    var data = context.Drivers.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    // On edit: check duplicate email (excluding current record) - materialize to avoid EF translation issues
                    var driverEmails = context.Drivers.Where(x => x.Id != dataDto.Id && x.IsActive && x.EmailId != null).Select(x => x.EmailId).ToList();
                    var userNames = context.Users.Where(u => u.DriverId != dataDto.Id && u.UserName != null).Select(u => u.UserName).ToList();
                    var duplicateEmail = driverEmails.Any(e => (e ?? "").Trim().ToLowerInvariant() == emailTrimmed) ||
                                        userNames.Any(u => (u ?? "").Trim().ToLowerInvariant() == emailTrimmed);
                    if (duplicateEmail) return BadRequest("A driver with this email already exists.");

                    data.Name = dataDto.Name;
                    data.MobileNo = dataDto.MobileNo;
                    data.EmailId = dataDto.EmailId;
                    data.Location = dataDto.Location;
                    data.Address = dataDto.Address;
                    data.LicenseNo = dataDto.LicenseNo;
                    data.AdharNo = dataDto.AdharNo;
                    data.LicenseIssueDate = dataDto.LicenseIssueDate;
                    data.LicenseExpiryDate = dataDto.LicenseExpiryDate;
                    data.CountryId = dataDto.CountryId;
                    data.DestinationId = dataDto.DestinationId;
                    data.AgencyId = dataDto.AgencyId;

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
                    if (!string.IsNullOrEmpty(dataDto.LicenseDocument) && !dataDto.LicenseDocument.Contains("UploadedFiles"))
                    {
                        data.LicenseDocument = SaveDocument(dataDto.LicenseDocument, ".pdf");
                    }

                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    // Duplicate check by email - materialize to avoid EF translation of Trim/ToLowerInvariant
                    var driverEmails = context.Drivers.Where(x => x.IsActive && x.EmailId != null).Select(x => x.EmailId).ToList();
                    var userNames = context.Users.Where(u => u.UserName != null).Select(u => u.UserName).ToList();
                    var duplicateEmail = driverEmails.Any(e => (e ?? "").Trim().ToLowerInvariant() == emailTrimmed) ||
                                        userNames.Any(u => (u ?? "").Trim().ToLowerInvariant() == emailTrimmed);
                    if (duplicateEmail) return BadRequest("A driver with this email already exists.");

                    if (!dataDto.AdminCreated && string.IsNullOrEmpty(dataDto.LicenseDocument))
                        return BadRequest("License document is required for driver registration.");

                        Driver data = new Driver();

                        data.Name = dataDto.Name;
                        data.MobileNo = dataDto.MobileNo;
                        data.EmailId = dataDto.EmailId;
                        data.Location = dataDto.Location;
                        data.Address = dataDto.Address;
                        data.LicenseNo = dataDto.LicenseNo;
                        data.AdharNo = dataDto.AdharNo;
                        data.LicenseIssueDate = dataDto.LicenseIssueDate;
                        data.LicenseExpiryDate = dataDto.LicenseExpiryDate;
                        data.CountryId = dataDto.CountryId;
                        data.DestinationId = dataDto.DestinationId;
                        data.IsActive = true;
                        data.AgencyId = dataDto.AgencyId;

                        if (!string.IsNullOrEmpty(dataDto.LicenseDocument))
                        {
                            data.LicenseDocument = SaveDocument(dataDto.LicenseDocument, ".pdf");
                        }

                        if (!string.IsNullOrEmpty(dataDto.Photo) &&
                            data.Photo != dataDto.Photo)
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
               
                        context.Drivers.Add(data);
                        context.SaveChanges();


                        User user = new User();
                        user.UserName = data.EmailId;
                        var passwordSalt = AuthenticationBL.CreatePasswordSalt(Encoding.ASCII.GetBytes(dataDto.Password));
                        user.PasswordSalt = Convert.ToBase64String(passwordSalt);
                        var password = AuthenticationBL.CreateSaltedPassword(passwordSalt, Encoding.ASCII.GetBytes(dataDto.Password));
                        user.Password = Convert.ToBase64String(password);
                        user.DriverId = data.Id;
                        user.Role = "Driver";

                    user.IsVerified = dataDto.AdminCreated; // Web registration: false; Admin-created: true
                    context.Users.Add(user);
                    context.SaveChanges();

                    return Ok(true);
                }
            }
        }

        [HttpGet]
        [Route("DeleteDriver/{id}")]
        public bool DeleteDriver(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Drivers.FirstOrDefault(x => x.Id == id);
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
        [Route("DriverList")]
        public List<DriverDto> DriverList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Drivers
                     .Where(x => x.IsActive)
                     .Select(x => new DriverDto
                     {
                         Id = x.Id,
                         Name = x.Name,
                         MobileNo = x.MobileNo,
                         EmailId = x.EmailId,
                         Location = x.Location,
                         Address = x.Address,
                         Photo = x.Photo,
                         LicenseNo = x.LicenseNo,
                         AdharNo = x.AdharNo,
                         LicenseIssueDate = x.LicenseIssueDate,
                         LicenseExpiryDate = x.LicenseExpiryDate,
                         LicenseDocument = x.LicenseDocument,
                         AvgRating = x.AvgRating,
                         CountryId = x.CountryId,
                         DestinationId = x.DestinationId,
                         IsActive = x.IsActive,
                         Country = new CountryDto
                         {
                             Id = x.Country.Id,
                             Name = x.Country.Name
                         },
                         Destination = new DestinationDto
                         {
                             Id = x.Destination.Id,
                             Name = x.Destination.Name
                         },
                         AgencyId = x.AgencyId,
                         Agency = x.AgencyId != null ? new AgencyDto
                         {
                             Id = x.Agency.Id,
                             Name = x.Agency.Name
                         } : null
                     }).ToList();
            }
        }

        [HttpGet]
        [Route("DriverById/{id}")]
        public DriverDto DriverById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Drivers
                     .Where(x => x.IsActive && x.Id == id)
                     .Select(x => new DriverDto
                     {
                         Id = x.Id,
                         Name = x.Name,
                         MobileNo = x.MobileNo,
                         EmailId = x.EmailId,
                         Location = x.Location,
                         Address = x.Address,
                         Photo = x.Photo,
                         LicenseNo = x.LicenseNo,
                         AdharNo = x.AdharNo,
                         LicenseIssueDate = x.LicenseIssueDate,
                         LicenseExpiryDate = x.LicenseExpiryDate,
                         LicenseDocument = x.LicenseDocument,
                         AvgRating = x.AvgRating,
                         CountryId = x.CountryId,
                         DestinationId = x.DestinationId,
                         IsActive = x.IsActive,
                         Country = new CountryDto
                         {
                             Id = x.Country.Id,
                             Name = x.Country.Name
                         },
                         Destination = new DestinationDto
                         {
                             Id = x.Destination.Id,
                             Name = x.Destination.Name
                         }
                     }).ToList().FirstOrDefault();
            }
        }

    }
}
