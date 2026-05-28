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
    public class HotelController : ApiController
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
                return "UploadedFiles\\" + id + ".jpg";
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


        [HttpPost]
        [Route("AddHotel")]
        public IHttpActionResult AddHotel(HotelDto dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var nameTrimmed = (dataDto.Name ?? "").Trim();
                var emailTrimmed = (dataDto.Email ?? "").Trim().ToLowerInvariant();
                if (string.IsNullOrEmpty(nameTrimmed)) return BadRequest("Hotel name is required");
                if (string.IsNullOrEmpty(emailTrimmed)) return BadRequest("Hotel email is required");

                if (dataDto.Id > 0)
                {
                    var data = context.Hotels.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    // On edit: check duplicate name+email (excluding current record) - materialize to avoid EF translation issues
                    var hotels = context.Hotels.Where(x => x.Id != dataDto.Id && x.IsActive && x.Name != null && x.Email != null)
                        .Select(x => new { x.Name, x.Email }).ToList();
                    var duplicateHotel = hotels.Any(x => (x.Name ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase) && (x.Email ?? "").Trim().ToLowerInvariant() == emailTrimmed);
                    if (duplicateHotel) return BadRequest("A hotel with this name and email already exists.");

                    data.Name = dataDto.Name;
                            data.Email = dataDto.Email;
                            data.MobileNo = dataDto.MobileNo;
                            data.DestinationId = dataDto.DestinationId;
                            data.CostPerDay = dataDto.CostPerDay;
                            data.Location = dataDto.Location;
                            data.Address = dataDto.Address;
                            data.HotelTypeId = dataDto.HotelTypeId;
                            data.StarRating = dataDto.StarRating;

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
                    if (!string.IsNullOrEmpty(dataDto.RegistrationCertificate) && !dataDto.RegistrationCertificate.Contains("UploadedFiles"))
                    {
                        data.RegistrationCertificate = SaveDocument(dataDto.RegistrationCertificate, ".pdf");
                    }

                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    if (!dataDto.AdminCreated && string.IsNullOrEmpty(dataDto.RegistrationCertificate))
                        return BadRequest("Registration certificate is required for hotel registration.");

                    // Duplicate check by name and email - materialize to avoid EF translation issues
                    var hotels = context.Hotels.Where(x => x.IsActive && x.Name != null && x.Email != null)
                        .Select(x => new { x.Name, x.Email }).ToList();
                    var duplicateHotel = hotels.Any(x => (x.Name ?? "").Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase) && (x.Email ?? "").Trim().ToLowerInvariant() == emailTrimmed);
                    if (duplicateHotel) return BadRequest("A hotel with this name and email already exists.");

                        Hotel data = new Hotel();

                        data.Name = dataDto.Name;
                        data.Email = dataDto.Email;
                        data.MobileNo = dataDto.MobileNo;
                        data.DestinationId = dataDto.DestinationId;
                        data.CostPerDay = dataDto.CostPerDay;
                        data.Location = dataDto.Location;
                        data.Address = dataDto.Address;
                        data.HotelTypeId = dataDto.HotelTypeId;
                        data.StarRating = dataDto.StarRating;
                        data.IsActive = true;

                        if (!string.IsNullOrEmpty(dataDto.RegistrationCertificate))
                        {
                            data.RegistrationCertificate = SaveDocument(dataDto.RegistrationCertificate, ".pdf");
                        }

                        if (!string.IsNullOrEmpty(dataDto.Image1))
                        {
                            data.Image1 = SaveImage(dataDto.Image1);
                        }
                        if (!string.IsNullOrEmpty(dataDto.Image2))
                        {
                            data.Image2 = SaveImage(dataDto.Image2);
                        }
                        if (!string.IsNullOrEmpty(dataDto.Image3))
                        {
                            data.Image3 = SaveImage(dataDto.Image3);
                        }
                        if (!string.IsNullOrEmpty(dataDto.Image4))
                        {
                            data.Image4 = SaveImage(dataDto.Image4);
                        }
                        if (!string.IsNullOrEmpty(dataDto.Image5))
                        {
                            data.Image5 = SaveImage(dataDto.Image5);
                        }

                        context.Hotels.Add(data);
                        context.SaveChanges();

                        User user = new User();
                        user.UserName = data.Email;
                        var passwordSalt = AuthenticationBL.CreatePasswordSalt(Encoding.ASCII.GetBytes(dataDto.Password));
                        user.PasswordSalt = Convert.ToBase64String(passwordSalt);
                        var password = AuthenticationBL.CreateSaltedPassword(passwordSalt, Encoding.ASCII.GetBytes(dataDto.Password));
                        user.Password = Convert.ToBase64String(password);
                        user.HotelId = data.Id;
                        user.Role = "Hotel";

                    user.IsVerified = dataDto.AdminCreated; // Web registration: false; Admin-created: true
                    context.Users.Add(user);
                    context.SaveChanges();

                    return Ok(true);
                }
            }
        }

        [HttpGet]
        [Route("DeleteHotel/{id}")]
        public bool DeleteHotel(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Hotels.FirstOrDefault(x => x.Id == id);
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
        [Route("HotelSearch")]
        public List<HotelDto> HotelSearch(long? destinationId = null, long? hotelTypeId = null, string searchText = null, int? starRating = null, decimal? minCost = null, decimal? maxCost = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var query = context.Hotels.Where(x => x.IsActive);

                if (destinationId.HasValue && destinationId.Value > 0)
                    query = query.Where(x => x.DestinationId == destinationId.Value);
                if (hotelTypeId.HasValue && hotelTypeId.Value > 0)
                    query = query.Where(x => x.HotelTypeId == hotelTypeId.Value);
                if (starRating.HasValue && starRating.Value > 0)
                    query = query.Where(x => x.StarRating >= starRating.Value);
                if (minCost.HasValue)
                    query = query.Where(x => x.CostPerDay >= minCost.Value);
                if (maxCost.HasValue)
                    query = query.Where(x => x.CostPerDay <= maxCost.Value);

                var hotels = query
                    .Select(x => new HotelDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Email = x.Email,
                        MobileNo = x.MobileNo,
                        DestinationId = x.DestinationId,
                        CostPerDay = x.CostPerDay,
                        Image1 = x.Image1,
                        Image2 = x.Image2,
                        Image3 = x.Image3,
                        Image4 = x.Image4,
                        Image5 = x.Image5,
                        Location = x.Location,
                        Address = x.Address,
                        HotelTypeId = x.HotelTypeId,
                        StarRating = x.StarRating,
                        AvgRating = x.AvgRating,
                        IsActive = x.IsActive,
                        Destination = new DestinationDto { Id = x.Destination.Id, Name = x.Destination.Name },
                        HotelType = new HotelTypeDto { Id = x.HotelType.Id, Name = x.HotelType.Name }
                    })
                    .ToList();

                // Search text filter (in-memory to avoid EF translation)
                if (!string.IsNullOrWhiteSpace(searchText))
                {
                    var txt = searchText.Trim();
                    hotels = hotels.Where(h =>
                        (h.Name != null && h.Name.IndexOf(txt, StringComparison.OrdinalIgnoreCase) >= 0) ||
                        (h.Location != null && h.Location.IndexOf(txt, StringComparison.OrdinalIgnoreCase) >= 0) ||
                        (h.Address != null && h.Address.IndexOf(txt, StringComparison.OrdinalIgnoreCase) >= 0)).ToList();
                }

                // Date filter: when fromDate and toDate provided, filter hotels with at least one room available (no overlapping booking)
                if (fromDate.HasValue && toDate.HasValue && fromDate.Value <= toDate.Value)
                {
                    var searchFrom = fromDate.Value.Date;
                    var searchTo = toDate.Value.Date;
                    var bookedRoomIds = context.HotelBookings
                        .Where(b => b.IsActive && b.FromDate <= searchTo && b.ToDate >= searchFrom)
                        .Select(b => b.HotelRoomId)
                        .ToList();
                    var hotelIdsWithRooms = context.HotelRooms
                        .Where(r => r.IsActive && !bookedRoomIds.Contains(r.Id))
                        .Select(r => r.HotelId)
                        .Distinct()
                        .ToList();
                    hotels = hotels.Where(h => hotelIdsWithRooms.Contains((long)h.Id)).ToList();
                }

                return hotels;
            }
        }

        [HttpGet]
        [Route("HotelList")]
        public List<HotelDto> HotelList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Hotels
                    .Where(x => x.IsActive)
                    .Select(x => new HotelDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Email = x.Email,
                        MobileNo = x.MobileNo,
                        DestinationId = x.DestinationId,
                        CostPerDay = x.CostPerDay,

                        Image1 = x.Image1,
                        Image2 = x.Image2,
                        Image3 = x.Image3,
                        Image4 = x.Image4,
                        Image5 = x.Image5,

                        Location = x.Location,
                        Address = x.Address,
                        HotelTypeId = x.HotelTypeId,

                        StarRating = x.StarRating,
                        AvgRating = x.AvgRating,
                        IsActive = x.IsActive,

                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        },

                        HotelType = new HotelTypeDto
                        {
                            Id = x.HotelType.Id,
                            Name = x.HotelType.Name
                        }
                    })
                    .ToList();
            }
        }

        [HttpGet]
        [Route("HotelById")]
        public HotelDto HotelById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Hotels
                    .Where(x => x.IsActive && x.Id == id)
                    .Select(x => new HotelDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Email = x.Email,
                        MobileNo = x.MobileNo,
                        DestinationId = x.DestinationId,
                        CostPerDay = x.CostPerDay,

                        Image1 = x.Image1,
                        Image2 = x.Image2,
                        Image3 = x.Image3,
                        Image4 = x.Image4,
                        Image5 = x.Image5,

                        Location = x.Location,
                        Address = x.Address,
                        HotelTypeId = x.HotelTypeId,

                        StarRating = x.StarRating,
                        AvgRating = x.AvgRating,
                        IsActive = x.IsActive,

                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        },

                        HotelType = new HotelTypeDto
                        {
                            Id = x.HotelType.Id,
                            Name = x.HotelType.Name
                        }
                    })
                    .ToList().FirstOrDefault();
            }
        }

    }
}
