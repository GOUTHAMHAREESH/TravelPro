using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class JourneyDirectory
    {
        public long Id { get; set; } 
        public long DestinationId { get; set; }
        public long JourneyDetailId { get; set; }
        public long JourneyId { get; set; }

        public virtual Journey Journey { get; set; }
        public virtual JourneyDetail JourneyDetail { get; set; } 
        public virtual Destination Destination { get; set; }
        public bool IsActive { get; set; }

        [StringLength(100)]
        public string ContactType { get; set; }
        [StringLength(100)]
        public string ContactNo { get; set; }
        [StringLength(100)]
        public string ContactPerson { get; set; }
        [StringLength(100)]
        public string Cost { get; set; }
        [StringLength(200)]
        public string Photo { get; set; }
        [StringLength(1000)]
        public string Description { get; set; }
    }
}
