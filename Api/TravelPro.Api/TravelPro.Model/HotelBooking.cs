using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class HotelBooking
    {
        public long Id { get; set; }

        public int Adults { get; set; }
        public int Kids { get; set; }
        public int TotalDays { get; set; }
        public float Total { get; set; }
        public DateTime Date { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public long HotelId { get; set; }
        public virtual Hotel Hotel { get; set; }
        public long HotelRoomId { get; set; }
        public virtual HotelRoom HotelRoom { get; set; }
        public long CustomerId { get; set; }
        public virtual Customer Customer { get; set; }

        [StringLength(500)]
        public string Review { get; set; }
        public int Rating { get; set; }
        public bool IsActive { get; set; }
    }
}
