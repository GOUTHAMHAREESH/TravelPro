using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class Destination
    {
        public long Id { get; set; }
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(500)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Photo { get; set; }
        public bool IsActive { get; set; }

        public long CountryId { get; set; }
        public virtual Country Country { get; set; }
    }
}
