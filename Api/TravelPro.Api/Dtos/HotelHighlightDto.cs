using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class HotelHighlightDto
    {
        public long Id { get; set; }

        public long HotelId { get; set; }
        public virtual HotelDto Hotel { get; set; }
        public string Description { get; set; }

        public string Type { get; set; } // Highlight Faciliy Inclusion Exclusion
        public bool IsActive { get; set; }
    }
}