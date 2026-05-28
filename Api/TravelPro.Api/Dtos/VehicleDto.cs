using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TravelPro.Model;

namespace TravelPro.Api.Dtos
{
    public class VehicleDto
    {
        public long Id { get; set; }

        public string Model { get; set; }
        public int Year { get; set; }
        public string FuelType { get; set; }
        public string Transmission { get; set; }
        public string Color { get; set; }
        public int NoOfSeat { get; set; }
        public decimal Rate { get; set; }

        public string Image1 { get; set; }
        public string Image2 { get; set; }
        public string Image3 { get; set; }
        public string Image4 { get; set; }
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
        public string PollutionDocNo { get; set; }
        public string InsuranceDocNo { get; set; }
        public DateTime? InsuranceExpiry { get; set; }

        public string RegistrationNo { get; set; }
        public DateTime? RegistrationExpiryDate { get; set; }

        public long DriverId { get; set; }
        public long BrandId { get; set; }
        public long VehicleTypeId { get; set; }

        public virtual BrandDto Brand { get; set; }
        public virtual VehicleTypeDto VehicleType { get; set; }
        public virtual DriverDto Driver { get; set; }
        public bool IsActive { get; set; }

        public long? AgencyId { get; set; }
        public AgencyDto Agency { get; set; }
    }
}