using System;

namespace TravelPro.Api.Dtos
{
    public class PendingUserDto
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public long? CustomerId { get; set; }
        public long? DriverId { get; set; }
        public long? HotelId { get; set; }
        public string CustomerName { get; set; }
        public string DriverName { get; set; }
        public string HotelName { get; set; }
        public string DocumentPath { get; set; }
        public string DocumentLabel { get; set; }

        public long? AgencyId { get; set; }
        public string AgencyName { get; set; }
    }
}
