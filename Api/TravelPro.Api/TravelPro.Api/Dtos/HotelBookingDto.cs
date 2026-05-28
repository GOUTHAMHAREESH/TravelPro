using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class HotelBookingDto
    {
        public long Id { get; set; }

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int TotalDays { get; set; }
        public float Total { get; set; }
        public DateTime Date { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public long HotelId { get; set; }
        public virtual HotelDto Hotel { get; set; }
        public long HotelRoomId { get; set; }
        public virtual HotelRoomDto HotelRoom { get; set; }
        public long CustomerId { get; set; }
        public virtual CustomerDto Customer { get; set; }

        public string Review { get; set; }
        public int Rating { get; set; }
        public bool IsActive { get; set; }

        // Optional: link to journey when booking from a journey
        public long? JourneyId { get; set; }
        public long? JourneyDetailId { get; set; }
    }
}