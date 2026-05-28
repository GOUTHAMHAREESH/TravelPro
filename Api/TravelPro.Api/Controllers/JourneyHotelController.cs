using System;
using System.Collections.Generic;
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
    public class JourneyHotelController : ApiController
    {
        [HttpPost]
        [Route("AddJourneyHotel")]
        public bool AddJourneyHotel(JourneyHotelDto dataDto)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (dataDto.Id > 0)
                {
                    var data = context.JourneyHotels.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data != null)
                    {
                        data.HotelId = dataDto.HotelId;
                        data.DestinationId = dataDto.DestinationId;
                        data.JourneyDetailId = dataDto.JourneyDetailId;
                        data.JourneyId = dataDto.JourneyId;
                        context.SaveChanges();
                        return true;
                    }
                    return false;
                }
                else
                {
                    JourneyHotel data = new JourneyHotel();

                    data.HotelId = dataDto.HotelId;
                    data.DestinationId = dataDto.DestinationId;
                    data.JourneyDetailId = dataDto.JourneyDetailId;
                    data.JourneyId = dataDto.JourneyId;
                    data.IsActive = true;

                    context.JourneyHotels.Add(data);
                    context.SaveChanges();
                    return true;
                }
            }
        }

        [HttpGet]
        [Route("DeleteJourneyHotel/{id}")]
        public bool DeleteJourneyHotel(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.JourneyHotels.FirstOrDefault(x => x.Id == id);
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
        [Route("JourneyHotelListByHotel/{hotelId}")]
        public List<JourneyHotelDto> JourneyHotelListByHotel(long hotelId)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.JourneyHotels
                    .Where(x => x.IsActive && x.HotelId == hotelId)
                    .Select(x => new JourneyHotelDto
                    {
                        Id = x.Id,
                        JourneyId = x.JourneyId,
                        JourneyDetailId = x.JourneyDetailId,
                        DestinationId = x.DestinationId,
                        HotelId = x.HotelId,
                        IsActive = x.IsActive,
                        JourneyDetail = new JourneyDetailDto
                        {
                            Id = x.JourneyDetail.Id,
                            Day = x.JourneyDetail.Day,
                            Title = x.JourneyDetail.Title,
                            JourneyId = x.JourneyDetail.JourneyId
                        },
                        Journey = new JourneyDto
                        {
                            Id = x.Journey.Id,
                            Title = x.Journey.Title,
                            CustomerId = x.Journey.CustomerId,
                            Customer = new CustomerDto
                            {
                                Id = x.Journey.Customer.Id,
                                Name = x.Journey.Customer.Name
                            }
                        },
                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        },
                        Hotel = new HotelDto
                        {
                            Id = x.Hotel.Id,
                            Name = x.Hotel.Name
                        }
                    }).ToList();
            }
        }

        [HttpGet]
        [Route("JourneyHotelList/{id}")]
        public List<JourneyHotelDto> JourneyHotelList(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.JourneyHotels
                    .Where(x => x.IsActive && x.JourneyDetailId == id)
                    .Select(x => new JourneyHotelDto
                    {
                        Id = x.Id,
                        JourneyId = x.JourneyId,
                        JourneyDetailId = x.JourneyDetailId,
                        DestinationId = x.DestinationId,
                        HotelId = x.HotelId,
                        IsActive = x.IsActive,
                        JourneyDetail = new JourneyDetailDto
                        {
                            Id = x.JourneyDetail.Id,
                            Title = x.JourneyDetail.Title
                        },
                        Journey = new JourneyDto
                        {
                            Id = x.Journey.Id,
                            Title = x.Journey.Title
                        },
                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        },
                         Hotel = new HotelDto
                         {
                             Id = x.Hotel.Id,
                             Name = x.Hotel.Name
                         }
                    }).ToList();
            }
        }

    }
}
