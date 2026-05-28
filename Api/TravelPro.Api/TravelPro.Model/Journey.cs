using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class Journey
    {
        public long Id { get; set; }

        [StringLength(200)]
        public string Photo { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int NoOfDays { get; set; }
        [StringLength(200)]
        public string Title { get; set; }
        [StringLength(1000)]
        public string Description { get; set; }

        public long CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public bool IsActive { get; set; }
    }
}
