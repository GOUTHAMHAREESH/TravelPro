using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
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
    public class VehicleController : ApiController
    {
        [HttpPost]
        [Route("AddVehicle")]
        public IHttpActionResult AddVehicle(VehicleDto dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var regNoTrimmed = (dataDto.RegistrationNo ?? "").Trim();
                if (string.IsNullOrEmpty(regNoTrimmed)) return BadRequest("Registration number is required");

                if (dataDto.Id > 0)
                {
                    var data = context.Vehicles.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    var regNos = context.Vehicles.Where(x => x.Id != dataDto.Id && x.IsActive && x.RegistrationNo != null).Select(x => x.RegistrationNo).ToList();
                    var duplicate = regNos.Any(r => (r ?? "").Trim().Equals(regNoTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A vehicle with this registration number already exists.");

                    data.Model = dataDto.Model;
                            data.Year = dataDto.Year;
                            data.FuelType = dataDto.FuelType;
                            data.Transmission = dataDto.Transmission;
                            data.Color = dataDto.Color;
                            data.NoOfSeat = dataDto.NoOfSeat;
                            data.Rate = dataDto.Rate;

                            data.Luggage = dataDto.Luggage;
                            data.Sensors = dataDto.Sensors;
                            data.Bluetooth = dataDto.Bluetooth;
                            data.Camera = dataDto.Camera;
                            data.LCD = dataDto.LCD;
                            data.Safety = dataDto.Safety;
                            data.MusicSystem = dataDto.MusicSystem;
                            data.Wifi = dataDto.Wifi;
                            data.AC = dataDto.AC;
                            data.GPS = dataDto.GPS;

                            data.Milage = dataDto.Milage;
                            data.PollutionExpiry = dataDto.PollutionExpiry;
                            data.PollutionDocNo = dataDto.PollutionDocNo;
                            data.InsuranceDocNo = dataDto.InsuranceDocNo;
                            data.InsuranceExpiry = dataDto.InsuranceExpiry;
                            data.RegistrationNo = dataDto.RegistrationNo;
                            data.RegistrationExpiryDate = dataDto.RegistrationExpiryDate;

                            data.BrandId = dataDto.BrandId;
                            data.VehicleTypeId = dataDto.VehicleTypeId;
                            data.DriverId = dataDto.DriverId;
                            data.AgencyId = dataDto.AgencyId;

                            // IMAGE SAVE (Only Image1 shown — repeat same logic for Image2–5 if needed)

                            if (!string.IsNullOrEmpty(dataDto.Image1) &&
                                !dataDto.Image1.Contains("UploadedFiles"))
                            {
                                Guid id = Guid.NewGuid();
                                var imgData = dataDto.Image1.Substring(dataDto.Image1.IndexOf(",") + 1);
                                byte[] bytes = Convert.FromBase64String(imgData);

                                using (MemoryStream ms = new MemoryStream(bytes))
                                {
                                    Image image = Image.FromStream(ms);
                                    Bitmap b = new Bitmap(image);
                                    string filePath = System.Web.HttpContext.Current.Server.MapPath("~")
                                        + "UploadedFiles\\" + id + ".jpg";

                                    b.Save(filePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                                    data.Image1 = "UploadedFiles\\" + id + ".jpg";
                                }
                            }

                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    var regNos = context.Vehicles.Where(x => x.IsActive && x.RegistrationNo != null).Select(x => x.RegistrationNo).ToList();
                    var duplicate = regNos.Any(r => (r ?? "").Trim().Equals(regNoTrimmed, StringComparison.OrdinalIgnoreCase));
                    if (duplicate) return BadRequest("A vehicle with this registration number already exists.");

                    Vehicle data = new Vehicle();

                    data.Model = dataDto.Model;
                        data.Year = dataDto.Year;
                        data.FuelType = dataDto.FuelType;
                        data.Transmission = dataDto.Transmission;
                        data.Color = dataDto.Color;
                        data.NoOfSeat = dataDto.NoOfSeat;
                        data.Rate = dataDto.Rate;

                        data.Luggage = dataDto.Luggage;
                        data.Sensors = dataDto.Sensors;
                        data.Bluetooth = dataDto.Bluetooth;
                        data.Camera = dataDto.Camera;
                        data.LCD = dataDto.LCD;
                        data.Safety = dataDto.Safety;
                        data.MusicSystem = dataDto.MusicSystem;
                        data.Wifi = dataDto.Wifi;
                        data.AC = dataDto.AC;
                        data.GPS = dataDto.GPS;

                        data.Milage = dataDto.Milage;
                        data.PollutionExpiry = dataDto.PollutionExpiry;
                        data.PollutionDocNo = dataDto.PollutionDocNo;
                        data.InsuranceDocNo = dataDto.InsuranceDocNo;
                        data.InsuranceExpiry = dataDto.InsuranceExpiry;
                        data.RegistrationNo = dataDto.RegistrationNo;
                        data.RegistrationExpiryDate = dataDto.RegistrationExpiryDate;

                        data.BrandId = dataDto.BrandId;
                        data.VehicleTypeId = dataDto.VehicleTypeId;
                        data.DriverId = dataDto.DriverId;
                        data.AgencyId = dataDto.AgencyId;
                        data.IsActive = true;


                        if (!string.IsNullOrEmpty(dataDto.Image1))
                        {
                            Guid id = Guid.NewGuid();
                            var imgData = dataDto.Image1.Substring(dataDto.Image1.IndexOf(",") + 1);
                            byte[] bytes = Convert.FromBase64String(imgData);

                            using (MemoryStream ms = new MemoryStream(bytes))
                            {
                                Image image = Image.FromStream(ms);
                                Bitmap b = new Bitmap(image);
                                string filePath = System.Web.HttpContext.Current.Server.MapPath("~")
                                    + "UploadedFiles\\" + id + ".jpg";

                                b.Save(filePath, System.Drawing.Imaging.ImageFormat.Jpeg);
                                data.Image1 = "UploadedFiles\\" + id + ".jpg";
                            }
                        }

                    context.Vehicles.Add(data);
                    context.SaveChanges();
                    return Ok(true);
                }
            }
        }

        [HttpGet]
        [Route("DeleteVehicle/{id}")]
        public bool DeleteVehicle(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Vehicles.FirstOrDefault(x => x.Id == id);
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
        [Route("VehicleList")]
        public List<VehicleDto> VehicleList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Vehicles
                    .Where(x => x.IsActive)
                    .Select(x => new VehicleDto
                    {
                        Id = x.Id,
                        Model = x.Model,
                        Year = x.Year,
                        FuelType = x.FuelType,
                        Transmission = x.Transmission,
                        Color = x.Color,
                        NoOfSeat = x.NoOfSeat,
                        Rate = x.Rate,

                        Image1 = x.Image1,
                        Image2 = x.Image2,
                        Image3 = x.Image3,
                        Image4 = x.Image4,
                        Image5 = x.Image5,

                        Luggage = x.Luggage,
                        Sensors = x.Sensors,
                        Bluetooth = x.Bluetooth,
                        Camera = x.Camera,
                        LCD = x.LCD,
                        Safety = x.Safety,
                        MusicSystem = x.MusicSystem,
                        Wifi = x.Wifi,
                        AC = x.AC,
                        GPS = x.GPS,

                        Milage = x.Milage,
                        PollutionExpiry = x.PollutionExpiry,
                        PollutionDocNo = x.PollutionDocNo,
                        InsuranceDocNo = x.InsuranceDocNo,
                        InsuranceExpiry = x.InsuranceExpiry,
                        RegistrationNo = x.RegistrationNo,
                        RegistrationExpiryDate = x.RegistrationExpiryDate,

                        DriverId = x.DriverId,
                        BrandId = x.BrandId,
                        VehicleTypeId = x.VehicleTypeId,
                        IsActive = x.IsActive,

                        Brand = new BrandDto
                        {
                            Id = x.Brand.Id,
                            Name = x.Brand.Name
                        },

                        VehicleType = new VehicleTypeDto
                        {
                            Id = x.VehicleType.Id,
                            Name = x.VehicleType.Name
                        },

                        Driver = new DriverDto
                        {
                            Id = x.Driver.Id,
                            Name = x.Driver.Name,
                            MobileNo = x.Driver.MobileNo
                        },
                        AgencyId = x.AgencyId,
                        Agency = x.AgencyId != null ? new AgencyDto
                        {
                            Id = x.Agency.Id,
                            Name = x.Agency.Name
                        } : null
                    })
                    .ToList();
            }
        }


        [HttpGet]
        [Route("VehicleListByDriverId/{id}")]
        public List<VehicleDto> VehicleListByDriverId(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Vehicles
                    .Where(x => x.IsActive && x.DriverId == id)
                    .Select(x => new VehicleDto
                    {
                        Id = x.Id,
                        Model = x.Model,
                        Year = x.Year,
                        FuelType = x.FuelType,
                        Transmission = x.Transmission,
                        Color = x.Color,
                        NoOfSeat = x.NoOfSeat,
                        Rate = x.Rate,

                        Image1 = x.Image1,
                        Image2 = x.Image2,
                        Image3 = x.Image3,
                        Image4 = x.Image4,
                        Image5 = x.Image5,

                        Luggage = x.Luggage,
                        Sensors = x.Sensors,
                        Bluetooth = x.Bluetooth,
                        Camera = x.Camera,
                        LCD = x.LCD,
                        Safety = x.Safety,
                        MusicSystem = x.MusicSystem,
                        Wifi = x.Wifi,
                        AC = x.AC,
                        GPS = x.GPS,

                        Milage = x.Milage,
                        PollutionExpiry = x.PollutionExpiry,
                        PollutionDocNo = x.PollutionDocNo,
                        InsuranceDocNo = x.InsuranceDocNo,
                        InsuranceExpiry = x.InsuranceExpiry,
                        RegistrationNo = x.RegistrationNo,
                        RegistrationExpiryDate = x.RegistrationExpiryDate,

                        DriverId = x.DriverId,
                        BrandId = x.BrandId,
                        VehicleTypeId = x.VehicleTypeId,
                        IsActive = x.IsActive,

                        Brand = new BrandDto
                        {
                            Id = x.Brand.Id,
                            Name = x.Brand.Name
                        },

                        VehicleType = new VehicleTypeDto
                        {
                            Id = x.VehicleType.Id,
                            Name = x.VehicleType.Name
                        },

                        Driver = new DriverDto
                        {
                            Id = x.Driver.Id,
                            Name = x.Driver.Name,
                            MobileNo = x.Driver.MobileNo
                        },
                        AgencyId = x.AgencyId,
                        Agency = x.AgencyId != null ? new AgencyDto
                        {
                            Id = x.Agency.Id,
                            Name = x.Agency.Name
                        } : null
                    })
                    .ToList();
            }
        }


    }
}
