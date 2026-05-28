using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class Driver
    {
        public long Id { get; set; }
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(100)]
        public string MobileNo { get; set; }
        [StringLength(100)]
        public string EmailId { get; set; }
        [StringLength(200)]
        public string Photo { get; set; }

        [StringLength(100)]
        public string Location { get; set; }
        [StringLength(200)]
        public string Address { get; set; }
        [StringLength(100)]
        public string LicenseNo { get; set; }
        [StringLength(100)]
        public string AdharNo { get; set; }
        public DateTime LicenseIssueDate { get; set; }
        public DateTime LicenseExpiryDate { get; set; }
        [StringLength(200)]
        public string LicenseDocument { get; set; }

        public long DestinationId { get; set; }
        public virtual Destination Destination { get; set; }
        public long CountryId { get; set; }
        public virtual Country Country { get; set; }
        public bool IsActive { get; set; }
        public int AvgRating { get; set; }

        public long? AgencyId { get; set; }
        public virtual Agency Agency { get; set; }
    }
}
