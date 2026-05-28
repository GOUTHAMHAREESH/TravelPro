using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class JourneyDirectoryDto
    {
        public long Id { get; set; }
        public long DestinationId { get; set; }
        public long JourneyDetailId { get; set; }
        public long JourneyId { get; set; }

        public virtual JourneyDto Journey { get; set; }
        public virtual JourneyDetailDto JourneyDetail { get; set; }
        public virtual DestinationDto Destination { get; set; }
        public bool IsActive { get; set; }

        public string ContactType { get; set; }
        public string ContactNo { get; set; }
        public string ContactPerson { get; set; }
        public string Cost { get; set; }
        public string Photo { get; set; }
        public string Description { get; set; }
    }
}