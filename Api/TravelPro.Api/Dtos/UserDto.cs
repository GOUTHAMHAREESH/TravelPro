using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class UserDto
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string PasswordSalt { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public bool IsBlocked { get; set; }

        public long? CustomerId { get; set; }
        public virtual CustomerDto Customer { get; set; }
        public long? DriverId { get; set; }
        public virtual DriverDto Driver { get; set; }
        public long? HotelId { get; set; }
        public virtual HotelDto Hotel { get; set; }

        public long? AgencyId { get; set; }
        public virtual AgencyDto Agency { get; set; }
    }
}