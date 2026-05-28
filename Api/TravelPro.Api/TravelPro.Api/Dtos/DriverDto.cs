using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class DriverDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string MobileNo { get; set; }
        public string EmailId { get; set; }
        public string Photo { get; set; }

        public string Location { get; set; }
        public string Address { get; set; }
        public string LicenseNo { get; set; }
        public string AdharNo { get; set; }
        public string Password { get; set; }
        public DateTime LicenseIssueDate { get; set; }
        public DateTime LicenseExpiryDate { get; set; }
        public string LicenseDocument { get; set; }

        public long CountryId { get; set; }
        public virtual CountryDto Country { get; set; }
        public long DestinationId { get; set; }
        public virtual DestinationDto Destination { get; set; }
        public bool IsActive { get; set; }
        public int AvgRating { get; set; }
        public bool AdminCreated { get; set; } // When true, user is auto-verified (admin panel)

        public long? AgencyId { get; set; }
        public AgencyDto Agency { get; set; }

    }
}