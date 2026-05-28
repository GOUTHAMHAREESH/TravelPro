using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class Hotel
    {
        public long Id { get; set; }
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(100)]
        public string MobileNo { get; set; }
        public long DestinationId { get; set; }
        public decimal CostPerDay { get; set; }

        [StringLength(200)]
        public string Image1 { get; set; }
        [StringLength(200)]
        public string Image2 { get; set; }
        [StringLength(200)]
        public string Image3 { get; set; }
        [StringLength(200)]
        public string Image4 { get; set; }
        [StringLength(200)]
        public string Image5 { get; set; }

        [StringLength(200)]
        public string Location { get; set; }
        [StringLength(200)]
        public string Address { get; set; }
        public long HotelTypeId { get; set; }

        public int StarRating { get; set; }
        public decimal AvgRating { get; set; }

        public virtual Destination Destination { get; set; }
        public virtual HotelType HotelType { get; set; }
        public bool IsActive { get; set; }
        [StringLength(200)]
        public string RegistrationCertificate { get; set; }
    }
}
