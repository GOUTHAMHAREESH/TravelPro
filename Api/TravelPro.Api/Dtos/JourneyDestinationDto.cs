using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class JourneyDestinationDto
    {
        public long Id { get; set; }
        public long JourneyId { get; set; }
        public long DestinationId { get; set; }
        public bool IsActive { get; set; }

        public virtual JourneyDto Journey { get; set; }
        public virtual DestinationDto Destination { get; set; }
    }
}