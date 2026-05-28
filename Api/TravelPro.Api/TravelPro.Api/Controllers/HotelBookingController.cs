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
    public class HotelBookingController : ApiController
    {
        [HttpPost]
        [Route("AddHotelBooking")]
        public bool AddHotelBooking(HotelBookingDto dataDto)
        {
            if (dataDto != null)
            {
                using (TravelProDB context = new TravelProDB())
                {
                    if (dataDto.Id > 0)
                    {
                        var data = context.HotelBookings.FirstOrDefault(x => x.Id == dataDto.Id);
                        if (data != null)
                        {
                            data.Adults = dataDto.Adults;
                            data.Kids = dataDto.Kids;
                            data.TotalDays = dataDto.TotalDays;
                            data.Total = dataDto.Total;
                            data.Date = dataDto.Date;
                            data.FromDate = dataDto.FromDate;
                            data.ToDate = dataDto.ToDate;

                            data.HotelId = dataDto.HotelId;
                            data.HotelRoomId = dataDto.HotelRoomId;
                            data.CustomerId = dataDto.CustomerId;


                            context.Entry(data).State = EntityState.Modified;
                            context.SaveChanges();
                            return true;
                        }
                        return false;
                    }
                    else
                    {
                        HotelBooking data = new HotelBooking();

                        data.Adults = dataDto.Adults;
                        data.Kids = dataDto.Kids;
                        data.TotalDays = dataDto.TotalDays;
                        data.Total = dataDto.Total;
                        data.Date = dataDto.Date;
                        data.FromDate = dataDto.FromDate;
                        data.ToDate = dataDto.ToDate;

                        data.HotelId = dataDto.HotelId;
                        data.HotelRoomId = dataDto.HotelRoomId;
                        data.CustomerId = dataDto.CustomerId;


                        data.IsActive = true;

                        context.HotelBookings.Add(data);
                        context.SaveChanges();

                        // If journey link requested, add JourneyHotel
                        if (dataDto.JourneyId.HasValue && dataDto.JourneyId.Value > 0 &&
                            dataDto.JourneyDetailId.HasValue && dataDto.JourneyDetailId.Value > 0)
                        {
                            var hotel = context.Hotels.FirstOrDefault(x => x.Id == data.HotelId);
                            var destId = hotel != null ? hotel.DestinationId : context.Destinations.FirstOrDefault()?.Id ?? 0;
                            if (destId > 0)
                            {
                                var jh = new JourneyHotel
                                {
                                    HotelId = data.HotelId,
                                    DestinationId = destId,
                                    JourneyDetailId = dataDto.JourneyDetailId.Value,
                                    JourneyId = dataDto.JourneyId.Value,
                                    IsActive = true
                                };
                                context.JourneyHotels.Add(jh);
                                context.SaveChanges();
                            }
                        }
                        return true;
                    }
                }
            }
            return false;
        }

        [HttpPost]
        [Route("AddHotelBookingReview")]
        public bool AddHotelBookingReview(HotelBookingDto dataDto)
        {
            if (dataDto != null)
            {
                using (TravelProDB context = new TravelProDB())
                {
                    var data = context.HotelBookings.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data != null)
                    {
                        data.Review = dataDto.Review;
                        data.Rating = dataDto.Rating;

                        context.Entry(data).State = EntityState.Modified;
                        context.SaveChanges();

                        var hotel = context.Hotels.FirstOrDefault(x=>x.Id == data.HotelId);

                        var totalrating = context.HotelBookings.Where(x => x.HotelId == data.HotelId).Sum(x => x.Rating);
                        var totalCount = context.HotelBookings.Where(x => x.HotelId == data.HotelId && x.Rating > 0).Count();

                        hotel.AvgRating = totalrating / totalCount;
                        context.Entry(hotel).State = EntityState.Modified;
                        context.SaveChanges();

                        return true;
                    }
                    return false;
                }
            }
            return false;
        }

        [HttpGet]
        [Route("DeleteHotelBooking/{id}")]
        public bool DeleteHotelBooking(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.HotelBookings.FirstOrDefault(x => x.Id == id);
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
        [Route("HotelBookingList")]
        public List<HotelBookingDto> HotelBookingList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.HotelBookings
                    .Where(x => x.IsActive )
                    .Select(x => new HotelBookingDto
                    {
                        Id = x.Id,
                        Adults = x.Adults,
                        Kids = x.Kids,
                        TotalDays = x.TotalDays,
                        Total = x.Total,
                        Date = x.Date,
                        FromDate = x.FromDate,
                        ToDate = x.ToDate,

                        HotelId = x.HotelId,
                        HotelRoomId = x.HotelRoomId,
                        CustomerId = x.CustomerId,

                        Review = x.Review,
                        Rating = x.Rating,
                        IsActive = x.IsActive,

                        Hotel = new HotelDto
                        {
                            Id = x.Hotel.Id,
                            Name = x.Hotel.Name
                        },

                        HotelRoom = new HotelRoomDto
                        {
                            Id = x.HotelRoom.Id,
                            Title = x.HotelRoom.Title,
                            Cost = x.HotelRoom.Cost
                        },

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name,
                            MobileNo = x.Customer.MobileNo
                        }
                    }).ToList();
            }
        }

        [HttpGet]
        [Route("HotelBookingListByCustomer/{id}")]
        public List<HotelBookingDto> HotelBookingListByCustomer(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.HotelBookings
                    .Where(x => x.IsActive && x.CustomerId == id)
                    .Select(x => new HotelBookingDto
                    {
                        Id = x.Id,
                        Adults = x.Adults,
                        Kids = x.Kids,
                        TotalDays = x.TotalDays,
                        Total = x.Total,
                        Date = x.Date,
                        FromDate = x.FromDate,
                        ToDate = x.ToDate,

                        HotelId = x.HotelId,
                        HotelRoomId = x.HotelRoomId,
                        CustomerId = x.CustomerId,

                        Review = x.Review,
                        Rating = x.Rating,
                        IsActive = x.IsActive,

                        Hotel = new HotelDto
                        {
                            Id = x.Hotel.Id,
                            Name = x.Hotel.Name
                        },

                        HotelRoom = new HotelRoomDto
                        {
                            Id = x.HotelRoom.Id,
                            Title = x.HotelRoom.Title,
                            Cost = x.HotelRoom.Cost
                        },

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name,
                            MobileNo = x.Customer.MobileNo
                        }
                    }).ToList();
            }
        }

        [HttpGet]
        [Route("HotelBookingListByHotel/{id}")]
        public List<HotelBookingDto> HotelBookingListByHotel(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.HotelBookings
                    .Where(x => x.IsActive && x.HotelId == id)
                    .Select(x => new HotelBookingDto
                    {
                        Id = x.Id,
                        Adults = x.Adults,
                        Kids = x.Kids,
                        TotalDays = x.TotalDays,
                        Total = x.Total,
                        Date = x.Date,
                        FromDate = x.FromDate,
                        ToDate = x.ToDate,

                        HotelId = x.HotelId,
                        HotelRoomId = x.HotelRoomId,
                        CustomerId = x.CustomerId,

                        Review = x.Review,
                        Rating = x.Rating,
                        IsActive = x.IsActive,

                        Hotel = new HotelDto
                        {
                            Id = x.Hotel.Id,
                            Name = x.Hotel.Name
                        },

                        HotelRoom = new HotelRoomDto
                        {
                            Id = x.HotelRoom.Id,
                            Title = x.HotelRoom.Title,
                            Cost = x.HotelRoom.Cost
                        },

                        Customer = new CustomerDto
                        {
                            Id = x.Customer.Id,
                            Name = x.Customer.Name,
                            MobileNo = x.Customer.MobileNo
                        }
                    }).ToList();
            }
        }

    }
}
