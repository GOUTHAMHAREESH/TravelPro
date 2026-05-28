using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class JourneyDetailDto
    {
        public long Id { get; set; }
        public int Day { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }

        public long JourneyId { get; set; }
        public virtual JourneyDto Journey { get; set; }
        public long DestinationId { get; set; }
        public virtual DestinationDto Destination { get; set; }
        public bool IsActive { get; set; }
    }
}