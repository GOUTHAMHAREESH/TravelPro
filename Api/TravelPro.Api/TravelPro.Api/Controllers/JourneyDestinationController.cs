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
    public class JourneyDestinationController : ApiController
    {
        [HttpPost]
        [Route("AddJourneyDestination")]
        public bool AddJourneyDestination(JourneyDestination dataDto)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (dataDto.Id > 0)
                {
                    var data = context.JourneyDestinations.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data != null)
                    {
                        data.JourneyId = dataDto.JourneyId;
                        data.DestinationId = dataDto.DestinationId;
                        context.SaveChanges();
                        return true;
                    }
                    return false;
                }
                else
                {
                    dataDto.IsActive = true;
                    context.JourneyDestinations.Add(dataDto);
                    context.SaveChanges();
                    return true;
                }
            }
        }

        [HttpGet]
        [Route("DeleteJourneyDestination/{id}")]
        public bool DeleteJourneyDestination(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.JourneyDestinations.FirstOrDefault(x => x.Id == id);
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
        [Route("JourneyDestinationList/{id}")]
        public List<JourneyDestinationDto> JourneyList(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.JourneyDestinations
                    .Where(x => x.IsActive && x.JourneyId == id)
                    .Select(x => new JourneyDestinationDto
                    {
                        Id = x.Id,
                        JourneyId = x.JourneyId,
                        DestinationId = x.DestinationId,
                        IsActive = x.IsActive,
                        Journey = new JourneyDto
                        {
                            Id = x.Journey.Id,
                            Title = x.Journey.Title
                        },
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
