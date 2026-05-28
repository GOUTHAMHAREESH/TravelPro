using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class JourneyDto
    {
        public long Id { get; set; }
        public string Photo { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int NoOfDays { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public long CustomerId { get; set; }
        public virtual CustomerDto Customer { get; set; }
        public bool IsActive { get; set; }
    }
}