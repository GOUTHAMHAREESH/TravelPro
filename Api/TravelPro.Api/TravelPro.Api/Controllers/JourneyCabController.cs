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
    public class JourneyCabController : ApiController
    {
        [HttpPost]
        [Route("AddJourneyCab")]
        public bool AddJourneyCab(JourneyCabDto dataDto)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (dataDto.Id > 0)
                {
                    var data = context.JourneyCabs.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data != null)
                    {
                        data.VehicleId = dataDto.VehicleId;
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
                    JourneyCab data = new JourneyCab();

                    data.VehicleId = dataDto.VehicleId;
                    data.DestinationId = dataDto.DestinationId;
                    data.JourneyDetailId = dataDto.JourneyDetailId;
                    data.JourneyId = dataDto.JourneyId;
                    data.IsActive = true;

                    context.JourneyCabs.Add(data);
                    context.SaveChanges();
                    return true;
                }
            }
        }

        [HttpGet]
        [Route("DeleteJourneyCab/{id}")]
        public bool DeleteJourneyCab(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.JourneyCabs.FirstOrDefault(x => x.Id == id);
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
        [Route("JourneyCabList/{id}")]
        public List<JourneyCabDto> JourneyCabList(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.JourneyCabs
                    .Where(x => x.IsActive && x.JourneyDetailId == id)
                    .Select(x => new JourneyCabDto
                    {
                        Id = x.Id,
                        VehicleId = x.VehicleId,
                        DestinationId = x.DestinationId,
                        JourneyDetailId = x.JourneyDetailId,
                        JourneyId = x.JourneyId,
                        IsActive = x.IsActive,

                        Journey = new JourneyDto
                        {
                            Id = x.Journey.Id,
                            Title = x.Journey.Title
                        },

                        JourneyDetail = new JourneyDetailDto
                        {
                            Id = x.JourneyDetail.Id,
                            Day = x.JourneyDetail.Day,
                            Title = x.JourneyDetail.Title
                        },

                        Vehicle = new VehicleDto
                        {
                            Id = x.Vehicle.Id,
                            Model = x.Vehicle.Model,
                            Rate = x.Vehicle.Rate
                        },

                        Destination = new DestinationDto
                        {
                            Id = x.Destination.Id,
                            Name = x.Destination.Name
                        }
                    })
                    .ToList();
            }
        }



    }
}
