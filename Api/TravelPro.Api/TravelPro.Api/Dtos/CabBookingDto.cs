using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TravelPro.Model;

namespace TravelPro.Api.Dtos
{
    public class CabBookingDto
    {
        public long Id { get; set; }

        public DateTime Date { get; set; }
        public bool IsActive { get; set; }
        public string Time { get; set; }
        public float TotalKmS { get; set; }
        public float TotalAmount { get; set; }
        public int Rating { get; set; }
        public string Review { get; set; }
        public string Status { get; set; }
        public string LocationFrom { get; set; }
        public string LocationTo { get; set; }

        public long CustomerId { get; set; }
        public long VehicleId { get; set; }
        public long DriverId { get; set; }
        public long DestinationId { get; set; }

        public virtual CustomerDto Customer { get; set; }
        public virtual VehicleDto Vehicle { get; set; }
        public virtual DriverDto Driver { get; set; }
        public virtual DestinationDto Destination { get; set; }

        // Optional: link to journey when booking from a journey
        public long? JourneyId { get; set; }
        public long? JourneyDetailId { get; set; }
    }
}