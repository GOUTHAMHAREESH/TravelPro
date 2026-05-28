using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class HotelDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public long DestinationId { get; set; }
        public decimal CostPerDay { get; set; }

        public string Image1 { get; set; }
        public string Image2 { get; set; }
        public string Image3 { get; set; }
        public string Image4 { get; set; }
        public string Image5 { get; set; }

        public string Location { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }

        public int StarRating { get; set; }
        public decimal AvgRating { get; set; }

        public virtual DestinationDto Destination { get; set; }

        public long HotelTypeId { get; set; }
        public virtual HotelTypeDto HotelType { get; set; }
        public bool IsActive { get; set; }
        public bool AdminCreated { get; set; }
        public string RegistrationCertificate { get; set; } // When true, user is auto-verified (admin panel)

    }
}