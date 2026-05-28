using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class JourneyGalleryDto
    {
        public long Id { get; set; }
        public long JourneyDetailId { get; set; }
        public long JourneyId { get; set; }

        public virtual JourneyDto Journey { get; set; }
        public virtual JourneyDetailDto JourneyDetail { get; set; }
        public bool IsActive { get; set; }

        public string Photo { get; set; }
    }
}