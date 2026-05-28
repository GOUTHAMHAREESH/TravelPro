using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class HotelHighlight
    {
        public long Id { get; set; }

        public long HotelId { get; set; }
        public virtual Hotel Hotel { get; set; }
        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(100)]
        public string Type { get; set; } // Highlight Faciliy Inclusion Exclusion
        public bool IsActive { get; set; }
    }
}
