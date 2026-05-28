using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class JourneyCab
    {
        public long Id { get; set; }
        public long VehicleId { get; set; }
        public long DestinationId { get; set; }
        public long JourneyDetailId { get; set; }
        public long JourneyId { get; set; }

        public virtual Journey Journey { get; set; }
        public virtual JourneyDetail JourneyDetail { get; set; }
        public virtual Vehicle Vehicle { get; set; }
        public virtual Destination Destination { get; set; }
        public bool IsActive { get; set; }
    }
}
