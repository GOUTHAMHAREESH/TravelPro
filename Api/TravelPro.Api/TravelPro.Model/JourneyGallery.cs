using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class JourneyGallery
    {
        public long Id { get; set; }
        public long JourneyDetailId { get; set; }
        public long JourneyId { get; set; }

        public virtual Journey Journey { get; set; }
        public virtual JourneyDetail JourneyDetail { get; set; }
        public bool IsActive { get; set; }

        [StringLength(200)]
        public string Photo { get; set; }
    }
}
