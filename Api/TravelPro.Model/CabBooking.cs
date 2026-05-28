using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class CabBooking
    {
        public long Id { get; set; }
  
        public DateTime Date { get; set; }
        public bool IsActive { get; set; }
        [StringLength(100)]
        public string Time { get; set; }
        public float TotalKmS { get; set; }
        public float TotalAmount { get; set; }
        public int Rating { get; set; }
        [StringLength(500)]
        public string Review { get; set; }
        [StringLength(100)]
        public string Status { get; set; }
        [StringLength(100)]
        public string LocationFrom { get; set; }
        [StringLength(100)]
        public string LocationTo { get; set; }

        public long CustomerId { get; set; }
        public long VehicleId { get; set; }
        public long DriverId { get; set; }
        public long DestinationId { get; set; }

        public virtual Customer Customer { get; set; }
        public virtual Vehicle Vehicle { get; set; }
        public virtual Driver Driver { get; set; }
        public virtual Destination Destination { get; set; }

    }
}
