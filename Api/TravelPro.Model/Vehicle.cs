using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class Vehicle
    {
        public long Id { get; set; }

        [StringLength(100)]
        public string Model { get; set; }
        public int Year { get; set; }
        [StringLength(100)]
        public string FuelType { get; set; }
        [StringLength(100)]
        public string Transmission { get; set; }
        [StringLength(100)]
        public string Color { get; set; }
        public int NoOfSeat { get; set; }
        public decimal Rate { get; set; }

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

        public int Luggage { get; set; }
        public bool Sensors { get; set; }
        public bool Bluetooth { get; set; }
        public bool Camera { get; set; }
        public bool LCD { get; set; }
        public bool Safety { get; set; }
        public bool MusicSystem { get; set; }
        public bool Wifi { get; set; }
        public bool AC { get; set; }
        public bool GPS { get; set; }

        public decimal Milage { get; set; }

        public DateTime? PollutionExpiry { get; set; }
        [StringLength(100)]
        public string PollutionDocNo { get; set; }
        [StringLength(100)]
        public string InsuranceDocNo { get; set; }
        public DateTime? InsuranceExpiry { get; set; }

        [StringLength(100)]
        public string RegistrationNo { get; set; }
        public DateTime? RegistrationExpiryDate { get; set; }

        public long BrandId { get; set; }
        public long VehicleTypeId { get; set; }
        public long DriverId { get; set; }

        public long? AgencyId { get; set; }
        public virtual Agency Agency { get; set; }
        
        public virtual Brand Brand { get; set; }
        public virtual VehicleType VehicleType { get; set; }
        public virtual Driver Driver { get; set; }

        public bool IsActive { get; set; }
    }

}
