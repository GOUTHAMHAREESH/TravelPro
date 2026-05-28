using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class Customer
    {
        public long Id { get; set; }
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(100)]
        public string MobileNo { get; set; }
        [StringLength(100)]
        public string EmailId { get; set; }

        [StringLength(100)]
        public string Location { get; set; }
        [StringLength(100)]
        public string Address { get; set; }

        public long CountryId { get; set; }
        public virtual Country Country { get; set; }
        public bool IsActive { get; set; }
    }
}
