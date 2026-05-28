using System.ComponentModel.DataAnnotations;

namespace TravelPro.Model
{
    public class Agency
    {
        public long Id { get; set; }

        [StringLength(150)]
        public string Name { get; set; }

        [StringLength(100)]
        public string EmailId { get; set; }

        [StringLength(100)]
        public string MobileNo { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        public long CountryId { get; set; }
        public virtual Country Country { get; set; }

        [StringLength(200)]
        public string RegistrationDocument { get; set; }

        public bool IsActive { get; set; }
    }
}

