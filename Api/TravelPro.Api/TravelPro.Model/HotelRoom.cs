using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class HotelRoom
    {
        public long Id { get; set; }

        public long HotelId { get; set; }
        public virtual Hotel Hotel { get; set; }
        [StringLength(100)]
        public string Title { get; set; }
        [StringLength(500)]
        public string Description { get; set; }
        public float Cost { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }

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
        public bool IsActive { get; set; }
    }
}
