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
    public class CabBookingController : ApiController
    {
        [HttpPost]
        [Route("AddCabBooking")]
        public IHttpActionResult AddCabBooking(CabBookingDto dataDto)
        {
            if (dataDto != null)
            {
                var today = DateTime.Today;
                if (dataDto.Id <= 0 && dataDto.Date.Date < today)
                {
                    return BadRequest("Past dates are not allowed. Please select current or future date.");
                }

                using (TravelProDB context = new TravelProDB())
                {
                    var bookingDate = dataDto.Date.Date;
                    var hasDateConflict = context.CabBookings.Any(x =>
                        x.IsActive &&
                        x.VehicleId == dataDto.VehicleId &&
                        DbFunctions.TruncateTime(x.Date) == bookingDate &&
                        x.Id != dataDto.Id &&
                        x.Status != "Rejected" &&
                        x.Status != "Cancelled");

                    if (hasDateConflict)
                    {
                        return BadRequest("This cab is already booked on the selected date. Please choose another cab or date.");
                    }

                    if (dataDto.Id > 0)
                    {
                        var data = context.CabBookings.FirstOrDefault(x => x.Id == dataDto.Id);
                        if (data != null)
                        {
                            data.Date = dataDto.Date;
                            data.Time = dataDto.Time;
                            data.TotalKmS = dataDto.TotalKmS;
                            data.TotalAmount = dataDto.TotalAmount;
                            data.Rating = dataDto.Rating;
                            data.Review = dataDto.Review;
                            data.Status = dataDto.Status;
                            data.LocationFrom = dataDto.LocationFrom;
                            data.LocationTo = dataDto.LocationTo;

                            data.CustomerId = dataDto.CustomerId;
                            data.VehicleId = dataDto.VehicleId;
                            data.DriverId = dataDto.DriverId;
                            data.DestinationId = dataDto.DestinationId;

                            context.Entry(data).State = EntityState.Modified;
                            context.SaveChanges();
                            return Ok(true);
                        }
                        return Ok(false);
                    }
                    else
                    {
                        CabBooking obj = new CabBooking();

                        obj.Date = dataDto.Date;
                        obj.Time = dataDto.Time;
                        obj.TotalKmS = dataDto.TotalKmS;
                        obj.TotalAmount = dataDto.TotalAmount;
                        obj.Rating = dataDto.Rating;
                        obj.Review = dataDto.Review;
                        obj.Status = dataDto.Status;
                        obj.LocationFrom = dataDto.LocationFrom;
                        obj.LocationTo = dataDto.LocationTo;

                        obj.CustomerId = dataDto.CustomerId;
                        obj.VehicleId = dataDto.VehicleId;
                        obj.DriverId = dataDto.DriverId;
                        obj.DestinationId = dataDto.DestinationId;

                        obj.IsActive = true;

                        context.CabBookings.Add(obj);
                        context.SaveChanges();

                        // If journey link requested, add JourneyCab
                        if (dataDto.JourneyId.HasValue && dataDto.JourneyId.Value > 0 &&
                            dataDto.JourneyDetailId.HasValue && dataDto.JourneyDetailId.Value > 0)
                        {
                            var journeyDetail = context.JourneyDetails.FirstOrDefault(x => x.Id == dataDto.JourneyDetailId.Value);
                            var destId = journeyDetail != null ? journeyDetail.DestinationId
                                : (dataDto.DestinationId > 0 ? dataDto.DestinationId : (context.Destinations.FirstOrDefault()?.Id ?? 0));
                            if (destId > 0)
                            {
                                var jc = new JourneyCab
                                {
                                    VehicleId = obj.VehicleId,
                                    DestinationId = destId,
                                    JourneyDetailId = dataDto.JourneyDetailId.Value,
                                    JourneyId = dataDto.JourneyId.Value,
                                    IsActive = true
                                };
                                context.JourneyCabs.Add(jc);
                                context.SaveChanges();
                            }
                        }
                        return Ok(true);
                    }
                }
            }
            return BadRequest("Invalid booking request.");
        }

        [HttpPost]
        [Route("AddCabBookingReview")]
        public bool AddCabBookingReview(HotelBookingDto dataDto)
        {
            if (dataDto != null)
            {
                using (TravelProDB context = new TravelProDB())
                {
                    var data = context.CabBookings.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data != null)
                    {
                        data.Review = dataDto.Review;
                        data.Rating = dataDto.Rating;

                        context.Entry(data).State = EntityState.Modified;
                        context.SaveChanges();

                        var driver = context.Drivers.FirstOrDefault(x => x.Id == data.DriverId);

                        var totalrating = context.CabBookings.Where(x => x.DriverId == data.DriverId).Sum(x => x.Rating);
                        var totalCount = context.CabBookings.Where(x => x.DriverId == data.DriverId && x.Rating > 0).Count();

                        driver.AvgRating = totalrating / totalCount;
                        context.Entry(driver).State = EntityState.Modified;
                        context.SaveChanges();

                        return true;
                    }
                    return false;
                }
            }
            return false;
        }

        [HttpGet]
        [Route("DeleteCabBooking/{id}")]
        public bool DeleteCabBooking(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (id != 0)
                {
                    var data = context.CabBookings.FirstOrDefault(x => x.Id == id);
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
        [Route("GetCabBookingById/{id}")]
        public CabBookingDto GetCabBookingById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.CabBookings
                    .Where(x => x.IsActive && x.Id == id)
                    .Select(x => new CabBookingDto
                    {
                        Id = x.Id,
                        Date = x.Date,
                        Time = x.Time,
                        TotalKmS = x.TotalKmS,
                        TotalAmount = x.TotalAmount,
                        Rating = x.Rating,
                        Review = x.Review,
                        Status = x.Status,
                        LocationFrom = x.LocationFrom,
                        LocationTo = x.LocationTo,
                        CustomerId = x.CustomerId,
                        VehicleId = x.VehicleId,
                        DriverId = x.DriverId,
                        Driver = new DriverDto
                        {
                            Id = x.Driver.Id,
                            Name = x.Driver.Name,
                            MobileNo = x.Driver.MobileNo,
                            EmailId = x.Driver.EmailId,
                            Location = x.Driver.Location
                        },

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name,
                            MobileNo = x.Customer.MobileNo,
                            EmailId = x.Customer.EmailId
                        },

                        Vehicle = new VehicleDto
                        {
                            Id = x.Vehicle.Id,
                            Model = x.Vehicle.Model,
                            AgencyId = x.Vehicle.AgencyId,
                            Agency = x.Vehicle.AgencyId != null ? new AgencyDto
                            {
                                Id = x.Vehicle.Agency.Id,
                                Name = x.Vehicle.Agency.Name,
                                EmailId = x.Vehicle.Agency.EmailId,
                                MobileNo = x.Vehicle.Agency.MobileNo,
                                Location = x.Vehicle.Agency.Location,
                                Address = x.Vehicle.Agency.Address
                            } : null
                        },

                        DestinationId = x.DestinationId,
                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        }
                    })
                    .FirstOrDefault();

                return data;
            }
        }

        [HttpGet]
        [Route("CabBookingList")]
        public List<CabBookingDto> CabBookingList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.CabBookings
                    .Where(x => x.IsActive)
                    .Select(x => new CabBookingDto
                    {
                        Id = x.Id,
                        Date = x.Date,
                        Time = x.Time,
                        TotalKmS = x.TotalKmS,
                        TotalAmount = x.TotalAmount,
                        Rating = x.Rating,
                        Review = x.Review,
                        Status = x.Status,
                        LocationFrom = x.LocationFrom,
                        LocationTo = x.LocationTo,
                        CustomerId = x.CustomerId,
                        VehicleId = x.VehicleId,
                        DriverId = x.DriverId,
                        Driver = new DriverDto
                        {
                            Id = x.Driver.Id,
                            Name = x.Driver.Name,
                            MobileNo = x.Driver.MobileNo,
                            EmailId = x.Driver.EmailId,
                            Location = x.Driver.Location
                        },

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name,
                            MobileNo = x.Customer.MobileNo,
                            EmailId = x.Customer.EmailId
                        },

                        Vehicle = new VehicleDto
                        {
                            Id = x.Vehicle.Id,
                            Model = x.Vehicle.Model,
                            AgencyId = x.Vehicle.AgencyId,
                            Agency = x.Vehicle.AgencyId != null ? new AgencyDto
                            {
                                Id = x.Vehicle.Agency.Id,
                                Name = x.Vehicle.Agency.Name,
                                EmailId = x.Vehicle.Agency.EmailId,
                                MobileNo = x.Vehicle.Agency.MobileNo,
                                Location = x.Vehicle.Agency.Location,
                                Address = x.Vehicle.Agency.Address
                            } : null
                        },

                        DestinationId = x.DestinationId,
                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        }
                    }).ToList();
            }
        }

        [HttpGet]
        [Route("CabBookingByCustomerId/{id}")]
        public List<CabBookingDto> CabBookingByCustomerId(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.CabBookings
                    .Where(x => x.IsActive && x.CustomerId == id)
                    .Select(x => new CabBookingDto
                    {
                        Id = x.Id,
                        Date = x.Date,
                        Time = x.Time,
                        TotalKmS = x.TotalKmS,
                        TotalAmount = x.TotalAmount,
                        Rating = x.Rating,
                        Review = x.Review,
                        Status = x.Status,
                        LocationFrom = x.LocationFrom,
                        LocationTo = x.LocationTo,
                        CustomerId = x.CustomerId,
                        VehicleId = x.VehicleId,
                        DriverId = x.DriverId,
                        Driver = new DriverDto
                        {
                            Id = x.Driver.Id,
                            Name = x.Driver.Name,
                            MobileNo = x.Driver.MobileNo,
                            EmailId = x.Driver.EmailId,
                            Location = x.Driver.Location
                        },

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name,
                            MobileNo = x.Customer.MobileNo,
                            EmailId = x.Customer.EmailId
                        },

                        Vehicle = new VehicleDto
                        {
                            Id = x.Vehicle.Id,
                            Model = x.Vehicle.Model,
                            AgencyId = x.Vehicle.AgencyId,
                            Agency = x.Vehicle.AgencyId != null ? new AgencyDto
                            {
                                Id = x.Vehicle.Agency.Id,
                                Name = x.Vehicle.Agency.Name,
                                EmailId = x.Vehicle.Agency.EmailId,
                                MobileNo = x.Vehicle.Agency.MobileNo,
                                Location = x.Vehicle.Agency.Location,
                                Address = x.Vehicle.Agency.Address
                            } : null
                        },

                        DestinationId = x.DestinationId,
                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        }
                    }).ToList();
            }
        }

        [HttpGet]
        [Route("CabBookingByDriverId/{id}")]
        public List<CabBookingDto> CabBookingByDriverId(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.CabBookings
                    .Where(x => x.IsActive && x.DriverId == id)
                    .Select(x => new CabBookingDto
                    {
                        Id = x.Id,
                        Date = x.Date,
                        Time = x.Time,
                        TotalKmS = x.TotalKmS,
                        TotalAmount = x.TotalAmount,
                        Rating = x.Rating,
                        Review = x.Review,
                        Status = x.Status,
                        LocationFrom = x.LocationFrom,
                        LocationTo = x.LocationTo,
                        CustomerId = x.CustomerId,
                        VehicleId = x.VehicleId,
                        DriverId = x.DriverId,
                        Driver = new DriverDto
                        {
                            Id = x.Driver.Id,
                            Name = x.Driver.Name,
                            MobileNo = x.Driver.MobileNo,
                            EmailId = x.Driver.EmailId,
                            Location = x.Driver.Location
                        },

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name,
                            MobileNo = x.Customer.MobileNo,
                            EmailId = x.Customer.EmailId
                        },

                        Vehicle = new VehicleDto
                        {
                            Id = x.Vehicle.Id,
                            Model = x.Vehicle.Model,
                            AgencyId = x.Vehicle.AgencyId,
                            Agency = x.Vehicle.AgencyId != null ? new AgencyDto
                            {
                                Id = x.Vehicle.Agency.Id,
                                Name = x.Vehicle.Agency.Name,
                                EmailId = x.Vehicle.Agency.EmailId,
                                MobileNo = x.Vehicle.Agency.MobileNo,
                                Location = x.Vehicle.Agency.Location,
                                Address = x.Vehicle.Agency.Address
                            } : null
                        },

                        DestinationId = x.DestinationId,
                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        }
                    }).ToList();
            }
        }

    }
}
