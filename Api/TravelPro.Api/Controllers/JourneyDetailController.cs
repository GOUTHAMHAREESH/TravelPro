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
    public class JourneyDetailController : ApiController
    {
        [HttpPost]
        [Route("AddJourneyDetail")]
        public bool AddJourneyDetail(JourneyDetailDto dataDto)
        {
            using (TravelProDB context = new TravelProDB())
            {
                if (dataDto.Id > 0)
                {
                    var data = context.JourneyDetails.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data != null)
                    {
                        data.Day = dataDto.Day;
                        data.Title = dataDto.Title;
                        data.Description = dataDto.Description;
                        data.Date = dataDto.Date;
                        data.Time = dataDto.Time;
                        data.JourneyId = dataDto.JourneyId;
                        data.DestinationId = dataDto.DestinationId;
                        context.SaveChanges();
                        return true;
                    }
                    return false;
                }
                else
                {
                    JourneyDetail data = new JourneyDetail();

                    data.Day = dataDto.Day;
                    data.Title = dataDto.Title;
                    data.Description = dataDto.Description;
                    data.Date = dataDto.Date;
                    data.Time = dataDto.Time;
                    data.JourneyId = dataDto.JourneyId;
                    data.DestinationId = dataDto.DestinationId;
                    data.IsActive = true;

                    context.JourneyDetails.Add(data);
                    context.SaveChanges();
                    return true;
                }
            }
        }

        [HttpGet]
        [Route("DeleteJourneyDetail/{id}")]
        public bool DeleteJourneyDetail(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.JourneyDetails.FirstOrDefault(x => x.Id == id);
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
        [Route("JourneyDetailList/{id}")]
        public List<JourneyDetailDto> JourneyDetailList(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.JourneyDetails
                    .Where(x => x.IsActive && x.JourneyId == id)
                    .Select(x => new JourneyDetailDto
                    {
                        Id = x.Id,
                        Day = x.Day,
                        Title = x.Title,
                        Description = x.Description,
                        Date = x.Date,
                        Time = x.Time,
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
