using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class CustomerDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string MobileNo { get; set; }
        public string EmailId { get; set; }
        public string Location { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }

        public long CountryId { get; set; }
        public virtual CountryDto Country { get; set; }
        public bool IsActive { get; set; }
    }
}