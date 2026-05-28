using System;
using System.Data.Entity;
using System.Linq;

namespace TravelPro.Model
{
    public class TravelProDB : DbContext
    {
      
        public TravelProDB()
            : base("name=TravelProDB")
        {
        }

      
         public virtual DbSet<Country> Countries { get; set; }
         public virtual DbSet<Destination> Destinations { get; set; }
         public virtual DbSet<Customer> Customers { get; set; }
         public virtual DbSet<Journey> Journeys { get; set; }
         public virtual DbSet<JourneyDestination> JourneyDestinations { get; set; }
         public virtual DbSet<JourneyDetail> JourneyDetails { get; set; }
         public virtual DbSet<JourneyCab> JourneyCabs { get; set; }
         public virtual DbSet<JourneyHotel> JourneyHotels { get; set; }
         public virtual DbSet<JourneyDirectory> JourneyDirectories  { get; set; }
         public virtual DbSet<VehicleType> VehicleTypes { get; set; }
         public virtual DbSet<Vehicle> Vehicles { get; set; }
         public virtual DbSet<Brand> Brands { get; set; }
         public virtual DbSet<Driver> Drivers { get; set; }
         public virtual DbSet<CabBooking> CabBookings { get; set; }
         public virtual DbSet<HotelType> HotelTypes { get; set; }
         public virtual DbSet<Hotel> Hotels { get; set; }
         public virtual DbSet<HotelHighlight> HotelHighlights { get; set; }
         public virtual DbSet<HotelRoom> HotelRooms { get; set; }
         public virtual DbSet<HotelBooking> HotelBookings { get; set; }
         public virtual DbSet<User> Users { get; set; }
         public virtual DbSet<UserSession> UserSessions { get; set; }
         public virtual DbSet<JourneyGallery> JourneyGalleries { get; set; }
         public virtual DbSet<Agency> Agencies { get; set; }

    }

}