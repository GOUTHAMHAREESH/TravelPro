using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class User
    {
        public long Id { get; set; }
        [StringLength(150)]
        public string UserName { get; set; }
        [StringLength(200)]
        public string Password { get; set; }
        [StringLength(300)]
        public string PasswordSalt { get; set; }
        [StringLength(100)]
        public string Role { get; set; }
        public bool IsBlocked { get; set; }
        public bool IsVerified { get; set; }

        public long? CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public long? DriverId { get; set; }
        public virtual Driver Driver { get; set; }
        public long? HotelId { get; set; }
        public virtual Hotel Hotel { get; set; }

        public long? AgencyId { get; set; }
        public virtual Agency Agency { get; set; }
    }
}
