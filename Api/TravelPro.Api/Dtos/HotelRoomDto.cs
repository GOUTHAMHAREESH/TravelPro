using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TravelPro.Api.Dtos
{
    public class HotelRoomDto
    {
        public long Id { get; set; }

        public long HotelId { get; set; }
        public virtual HotelDto Hotel { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public float Cost { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }

        public string Image1 { get; set; }
        public string Image2 { get; set; }
        public string Image3 { get; set; }
        public string Image4 { get; set; }
        public string Image5 { get; set; }
        public bool IsActive { get; set; }
    }
}