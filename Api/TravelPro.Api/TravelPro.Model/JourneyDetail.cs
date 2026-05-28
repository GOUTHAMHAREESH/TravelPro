using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class JourneyDetail
    {
        public long Id { get; set; }
        public int Day { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }

        public long JourneyId { get; set; }
        public long DestinationId { get; set; }
        public virtual Journey Journey { get; set; }
        public virtual Destination Destination { get; set; }
        public bool IsActive { get; set; }
    }

}
