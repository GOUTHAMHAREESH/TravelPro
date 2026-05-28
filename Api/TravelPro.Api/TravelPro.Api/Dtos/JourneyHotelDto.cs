using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class JourneyHotelDto
    {
        public long Id { get; set; }
        public long HotelId { get; set; }
        public long DestinationId { get; set; }
        public long JourneyDetailId { get; set; }
        public long JourneyId { get; set; }

        public virtual JourneyDto Journey { get; set; }
        public virtual JourneyDetailDto JourneyDetail { get; set; }
        public virtual HotelDto Hotel { get; set; }
        public virtual DestinationDto Destination { get; set; }
        public bool IsActive { get; set; }
    }
}