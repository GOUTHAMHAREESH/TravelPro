namespace TravelPro.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialTables : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Brands",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        IsActive = c.Boolean(nullable: false),
                        Photo = c.String(maxLength: 200),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CabBookings",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        Time = c.String(maxLength: 100),
                        TotalKmS = c.Single(nullable: false),
                        TotalAmount = c.Single(nullable: false),
                        Rating = c.Int(nullable: false),
                        Review = c.String(maxLength: 500),
                        Status = c.String(maxLength: 100),
                        LocationFrom = c.String(maxLength: 100),
                        LocationTo = c.String(maxLength: 100),
                        CustomerId = c.Long(nullable: false),
                        VehicleId = c.Long(nullable: false),
                        DriverId = c.Long(nullable: false),
                        DestinationId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Customers", t => t.CustomerId, cascadeDelete: false)
                .ForeignKey("dbo.Destinations", t => t.DestinationId, cascadeDelete: false)
                .ForeignKey("dbo.Drivers", t => t.DriverId, cascadeDelete: false)
                .ForeignKey("dbo.Vehicles", t => t.VehicleId, cascadeDelete: false)
                .Index(t => t.CustomerId)
                .Index(t => t.VehicleId)
                .Index(t => t.DriverId)
                .Index(t => t.DestinationId);
            
            CreateTable(
                "dbo.Customers",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        MobileNo = c.String(maxLength: 100),
                        EmailId = c.String(maxLength: 100),
                        Location = c.String(maxLength: 100),
                        Address = c.String(maxLength: 100),
                        CountryId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Countries", t => t.CountryId, cascadeDelete: false)
                .Index(t => t.CountryId);
            
            CreateTable(
                "dbo.Countries",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Destinations",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        Description = c.String(maxLength: 500),
                        Photo = c.String(maxLength: 200),
                        IsActive = c.Boolean(nullable: false),
                        CountryId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Countries", t => t.CountryId, cascadeDelete: false)
                .Index(t => t.CountryId);
            
            CreateTable(
                "dbo.Drivers",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        MobileNo = c.String(maxLength: 100),
                        EmailId = c.String(maxLength: 100),
                        Photo = c.String(maxLength: 200),
                        Location = c.String(maxLength: 100),
                        Address = c.String(maxLength: 200),
                        LicenseNo = c.String(maxLength: 100),
                        AdharNo = c.String(maxLength: 100),
                        LicenseIssueDate = c.DateTime(nullable: false),
                        LicenseExpiryDate = c.DateTime(nullable: false),
                        DestinationId = c.Long(nullable: false),
                        CountryId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        AvgRating = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Countries", t => t.CountryId, cascadeDelete: false)
                .ForeignKey("dbo.Destinations", t => t.DestinationId, cascadeDelete: false)
                .Index(t => t.DestinationId)
                .Index(t => t.CountryId);
            
            CreateTable(
                "dbo.Vehicles",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Model = c.String(maxLength: 100),
                        Year = c.Int(nullable: false),
                        FuelType = c.String(maxLength: 100),
                        Transmission = c.String(maxLength: 100),
                        Color = c.String(maxLength: 100),
                        NoOfSeat = c.Int(nullable: false),
                        Rate = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Image1 = c.String(maxLength: 200),
                        Image2 = c.String(maxLength: 200),
                        Image3 = c.String(maxLength: 200),
                        Image4 = c.String(maxLength: 200),
                        Image5 = c.String(maxLength: 200),
                        Luggage = c.Int(nullable: false),
                        Sensors = c.Boolean(nullable: false),
                        Bluetooth = c.Boolean(nullable: false),
                        Camera = c.Boolean(nullable: false),
                        LCD = c.Boolean(nullable: false),
                        Safety = c.Boolean(nullable: false),
                        MusicSystem = c.Boolean(nullable: false),
                        Wifi = c.Boolean(nullable: false),
                        AC = c.Boolean(nullable: false),
                        GPS = c.Boolean(nullable: false),
                        Milage = c.Decimal(nullable: false, precision: 18, scale: 2),
                        PollutionExpiry = c.DateTime(),
                        PollutionDocNo = c.String(maxLength: 100),
                        InsuranceDocNo = c.String(maxLength: 100),
                        InsuranceExpiry = c.DateTime(),
                        RegistrationNo = c.String(maxLength: 100),
                        RegistrationExpiryDate = c.DateTime(),
                        BrandId = c.Long(nullable: false),
                        VehicleTypeId = c.Long(nullable: false),
                        DriverId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Brands", t => t.BrandId, cascadeDelete: false)
                .ForeignKey("dbo.Drivers", t => t.DriverId, cascadeDelete: false)
                .ForeignKey("dbo.VehicleTypes", t => t.VehicleTypeId, cascadeDelete: false)
                .Index(t => t.BrandId)
                .Index(t => t.VehicleTypeId)
                .Index(t => t.DriverId);
            
            CreateTable(
                "dbo.VehicleTypes",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.HotelBookings",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Adults = c.Int(nullable: false),
                        Kids = c.Int(nullable: false),
                        TotalDays = c.Int(nullable: false),
                        Total = c.Single(nullable: false),
                        Date = c.DateTime(nullable: false),
                        FromDate = c.DateTime(nullable: false),
                        ToDate = c.DateTime(nullable: false),
                        HotelId = c.Long(nullable: false),
                        HotelRoomId = c.Long(nullable: false),
                        CustomerId = c.Long(nullable: false),
                        Review = c.String(maxLength: 500),
                        Rating = c.Int(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Customers", t => t.CustomerId, cascadeDelete: false)
                .ForeignKey("dbo.Hotels", t => t.HotelId, cascadeDelete: false)
                .ForeignKey("dbo.HotelRooms", t => t.HotelRoomId, cascadeDelete: false)
                .Index(t => t.HotelId)
                .Index(t => t.HotelRoomId)
                .Index(t => t.CustomerId);
            
            CreateTable(
                "dbo.Hotels",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        Email = c.String(maxLength: 100),
                        MobileNo = c.String(maxLength: 100),
                        DestinationId = c.Long(nullable: false),
                        CostPerDay = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Image1 = c.String(maxLength: 200),
                        Image2 = c.String(maxLength: 200),
                        Image3 = c.String(maxLength: 200),
                        Image4 = c.String(maxLength: 200),
                        Image5 = c.String(maxLength: 200),
                        Location = c.String(maxLength: 200),
                        Address = c.String(maxLength: 200),
                        HotelTypeId = c.Long(nullable: false),
                        StarRating = c.Int(nullable: false),
                        AvgRating = c.Decimal(nullable: false, precision: 18, scale: 2),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Destinations", t => t.DestinationId, cascadeDelete: false)
                .ForeignKey("dbo.HotelTypes", t => t.HotelTypeId, cascadeDelete: false)
                .Index(t => t.DestinationId)
                .Index(t => t.HotelTypeId);
            
            CreateTable(
                "dbo.HotelTypes",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 100),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.HotelRooms",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        HotelId = c.Long(nullable: false),
                        Title = c.String(maxLength: 100),
                        Description = c.String(maxLength: 500),
                        Cost = c.Single(nullable: false),
                        Adults = c.Int(nullable: false),
                        Kids = c.Int(nullable: false),
                        Image1 = c.String(maxLength: 200),
                        Image2 = c.String(maxLength: 200),
                        Image3 = c.String(maxLength: 200),
                        Image4 = c.String(maxLength: 200),
                        Image5 = c.String(maxLength: 200),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Hotels", t => t.HotelId, cascadeDelete: false)
                .Index(t => t.HotelId);
            
            CreateTable(
                "dbo.HotelHighlights",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        HotelId = c.Long(nullable: false),
                        Description = c.String(maxLength: 500),
                        Type = c.String(maxLength: 100),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Hotels", t => t.HotelId, cascadeDelete: false)
                .Index(t => t.HotelId);
            
            CreateTable(
                "dbo.JourneyCabs",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        VehicleId = c.Long(nullable: false),
                        DestinationId = c.Long(nullable: false),
                        JourneyDetailId = c.Long(nullable: false),
                        JourneyId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Destinations", t => t.DestinationId, cascadeDelete: false)
                .ForeignKey("dbo.Journeys", t => t.JourneyId, cascadeDelete: false)
                .ForeignKey("dbo.JourneyDetails", t => t.JourneyDetailId, cascadeDelete: false)
                .ForeignKey("dbo.Vehicles", t => t.VehicleId, cascadeDelete: false)
                .Index(t => t.VehicleId)
                .Index(t => t.DestinationId)
                .Index(t => t.JourneyDetailId)
                .Index(t => t.JourneyId);
            
            CreateTable(
                "dbo.Journeys",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Photo = c.String(maxLength: 200),
                        DateFrom = c.DateTime(nullable: false),
                        DateTo = c.DateTime(nullable: false),
                        NoOfDays = c.Int(nullable: false),
                        Title = c.String(maxLength: 200),
                        Description = c.String(maxLength: 1000),
                        CustomerId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Customers", t => t.CustomerId, cascadeDelete: false)
                .Index(t => t.CustomerId);
            
            CreateTable(
                "dbo.JourneyDetails",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Day = c.Int(nullable: false),
                        Title = c.String(),
                        Description = c.String(),
                        Date = c.DateTime(nullable: false),
                        Time = c.String(),
                        JourneyId = c.Long(nullable: false),
                        DestinationId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Destinations", t => t.DestinationId, cascadeDelete: false)
                .ForeignKey("dbo.Journeys", t => t.JourneyId, cascadeDelete: false)
                .Index(t => t.JourneyId)
                .Index(t => t.DestinationId);
            
            CreateTable(
                "dbo.JourneyDestinations",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        JourneyId = c.Long(nullable: false),
                        DestinationId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Destinations", t => t.DestinationId, cascadeDelete: false)
                .ForeignKey("dbo.Journeys", t => t.JourneyId, cascadeDelete: false)
                .Index(t => t.JourneyId)
                .Index(t => t.DestinationId);
            
            CreateTable(
                "dbo.JourneyDirectories",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        DestinationId = c.Long(nullable: false),
                        JourneyDetailId = c.Long(nullable: false),
                        JourneyId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        ContactType = c.String(maxLength: 100),
                        ContactNo = c.String(maxLength: 100),
                        ContactPerson = c.String(maxLength: 100),
                        Cost = c.String(maxLength: 100),
                        Photo = c.String(maxLength: 200),
                        Description = c.String(maxLength: 1000),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Destinations", t => t.DestinationId, cascadeDelete: false)
                .ForeignKey("dbo.Journeys", t => t.JourneyId, cascadeDelete: false)
                .ForeignKey("dbo.JourneyDetails", t => t.JourneyDetailId, cascadeDelete: false)
                .Index(t => t.DestinationId)
                .Index(t => t.JourneyDetailId)
                .Index(t => t.JourneyId);
            
            CreateTable(
                "dbo.JourneyGalleries",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        JourneyDetailId = c.Long(nullable: false),
                        JourneyId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        Photo = c.String(maxLength: 200),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Journeys", t => t.JourneyId, cascadeDelete: false)
                .ForeignKey("dbo.JourneyDetails", t => t.JourneyDetailId, cascadeDelete: false)
                .Index(t => t.JourneyDetailId)
                .Index(t => t.JourneyId);
            
            CreateTable(
                "dbo.JourneyHotels",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        HotelId = c.Long(nullable: false),
                        DestinationId = c.Long(nullable: false),
                        JourneyDetailId = c.Long(nullable: false),
                        JourneyId = c.Long(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Destinations", t => t.DestinationId, cascadeDelete: false)
                .ForeignKey("dbo.Hotels", t => t.HotelId, cascadeDelete: false)
                .ForeignKey("dbo.Journeys", t => t.JourneyId, cascadeDelete: false)
                .ForeignKey("dbo.JourneyDetails", t => t.JourneyDetailId, cascadeDelete: false)
                .Index(t => t.HotelId)
                .Index(t => t.DestinationId)
                .Index(t => t.JourneyDetailId)
                .Index(t => t.JourneyId);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        UserName = c.String(maxLength: 150),
                        Password = c.String(maxLength: 200),
                        PasswordSalt = c.String(maxLength: 300),
                        Role = c.String(maxLength: 100),
                        IsBlocked = c.Boolean(nullable: false),
                        CustomerId = c.Long(),
                        DriverId = c.Long(),
                        HotelId = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Customers", t => t.CustomerId)
                .ForeignKey("dbo.Drivers", t => t.DriverId)
                .ForeignKey("dbo.Hotels", t => t.HotelId)
                .Index(t => t.CustomerId)
                .Index(t => t.DriverId)
                .Index(t => t.HotelId);
            
            CreateTable(
                "dbo.UserSessions",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Token = c.String(maxLength: 256),
                        SessionTimeStamp = c.DateTime(nullable: false),
                        ExpiresInMinutes = c.Long(nullable: false),
                        UserId = c.Long(nullable: false),
                        FinancialYearId = c.Long(),
                        UserSessionStatus = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: false)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserSessions", "UserId", "dbo.Users");
            DropForeignKey("dbo.Users", "HotelId", "dbo.Hotels");
            DropForeignKey("dbo.Users", "DriverId", "dbo.Drivers");
            DropForeignKey("dbo.Users", "CustomerId", "dbo.Customers");
            DropForeignKey("dbo.JourneyHotels", "JourneyDetailId", "dbo.JourneyDetails");
            DropForeignKey("dbo.JourneyHotels", "JourneyId", "dbo.Journeys");
            DropForeignKey("dbo.JourneyHotels", "HotelId", "dbo.Hotels");
            DropForeignKey("dbo.JourneyHotels", "DestinationId", "dbo.Destinations");
            DropForeignKey("dbo.JourneyGalleries", "JourneyDetailId", "dbo.JourneyDetails");
            DropForeignKey("dbo.JourneyGalleries", "JourneyId", "dbo.Journeys");
            DropForeignKey("dbo.JourneyDirectories", "JourneyDetailId", "dbo.JourneyDetails");
            DropForeignKey("dbo.JourneyDirectories", "JourneyId", "dbo.Journeys");
            DropForeignKey("dbo.JourneyDirectories", "DestinationId", "dbo.Destinations");
            DropForeignKey("dbo.JourneyDestinations", "JourneyId", "dbo.Journeys");
            DropForeignKey("dbo.JourneyDestinations", "DestinationId", "dbo.Destinations");
            DropForeignKey("dbo.JourneyCabs", "VehicleId", "dbo.Vehicles");
            DropForeignKey("dbo.JourneyCabs", "JourneyDetailId", "dbo.JourneyDetails");
            DropForeignKey("dbo.JourneyDetails", "JourneyId", "dbo.Journeys");
            DropForeignKey("dbo.JourneyDetails", "DestinationId", "dbo.Destinations");
            DropForeignKey("dbo.JourneyCabs", "JourneyId", "dbo.Journeys");
            DropForeignKey("dbo.Journeys", "CustomerId", "dbo.Customers");
            DropForeignKey("dbo.JourneyCabs", "DestinationId", "dbo.Destinations");
            DropForeignKey("dbo.HotelHighlights", "HotelId", "dbo.Hotels");
            DropForeignKey("dbo.HotelBookings", "HotelRoomId", "dbo.HotelRooms");
            DropForeignKey("dbo.HotelRooms", "HotelId", "dbo.Hotels");
            DropForeignKey("dbo.HotelBookings", "HotelId", "dbo.Hotels");
            DropForeignKey("dbo.Hotels", "HotelTypeId", "dbo.HotelTypes");
            DropForeignKey("dbo.Hotels", "DestinationId", "dbo.Destinations");
            DropForeignKey("dbo.HotelBookings", "CustomerId", "dbo.Customers");
            DropForeignKey("dbo.CabBookings", "VehicleId", "dbo.Vehicles");
            DropForeignKey("dbo.Vehicles", "VehicleTypeId", "dbo.VehicleTypes");
            DropForeignKey("dbo.Vehicles", "DriverId", "dbo.Drivers");
            DropForeignKey("dbo.Vehicles", "BrandId", "dbo.Brands");
            DropForeignKey("dbo.CabBookings", "DriverId", "dbo.Drivers");
            DropForeignKey("dbo.Drivers", "DestinationId", "dbo.Destinations");
            DropForeignKey("dbo.Drivers", "CountryId", "dbo.Countries");
            DropForeignKey("dbo.CabBookings", "DestinationId", "dbo.Destinations");
            DropForeignKey("dbo.Destinations", "CountryId", "dbo.Countries");
            DropForeignKey("dbo.CabBookings", "CustomerId", "dbo.Customers");
            DropForeignKey("dbo.Customers", "CountryId", "dbo.Countries");
            DropIndex("dbo.UserSessions", new[] { "UserId" });
            DropIndex("dbo.Users", new[] { "HotelId" });
            DropIndex("dbo.Users", new[] { "DriverId" });
            DropIndex("dbo.Users", new[] { "CustomerId" });
            DropIndex("dbo.JourneyHotels", new[] { "JourneyId" });
            DropIndex("dbo.JourneyHotels", new[] { "JourneyDetailId" });
            DropIndex("dbo.JourneyHotels", new[] { "DestinationId" });
            DropIndex("dbo.JourneyHotels", new[] { "HotelId" });
            DropIndex("dbo.JourneyGalleries", new[] { "JourneyId" });
            DropIndex("dbo.JourneyGalleries", new[] { "JourneyDetailId" });
            DropIndex("dbo.JourneyDirectories", new[] { "JourneyId" });
            DropIndex("dbo.JourneyDirectories", new[] { "JourneyDetailId" });
            DropIndex("dbo.JourneyDirectories", new[] { "DestinationId" });
            DropIndex("dbo.JourneyDestinations", new[] { "DestinationId" });
            DropIndex("dbo.JourneyDestinations", new[] { "JourneyId" });
            DropIndex("dbo.JourneyDetails", new[] { "DestinationId" });
            DropIndex("dbo.JourneyDetails", new[] { "JourneyId" });
            DropIndex("dbo.Journeys", new[] { "CustomerId" });
            DropIndex("dbo.JourneyCabs", new[] { "JourneyId" });
            DropIndex("dbo.JourneyCabs", new[] { "JourneyDetailId" });
            DropIndex("dbo.JourneyCabs", new[] { "DestinationId" });
            DropIndex("dbo.JourneyCabs", new[] { "VehicleId" });
            DropIndex("dbo.HotelHighlights", new[] { "HotelId" });
            DropIndex("dbo.HotelRooms", new[] { "HotelId" });
            DropIndex("dbo.Hotels", new[] { "HotelTypeId" });
            DropIndex("dbo.Hotels", new[] { "DestinationId" });
            DropIndex("dbo.HotelBookings", new[] { "CustomerId" });
            DropIndex("dbo.HotelBookings", new[] { "HotelRoomId" });
            DropIndex("dbo.HotelBookings", new[] { "HotelId" });
            DropIndex("dbo.Vehicles", new[] { "DriverId" });
            DropIndex("dbo.Vehicles", new[] { "VehicleTypeId" });
            DropIndex("dbo.Vehicles", new[] { "BrandId" });
            DropIndex("dbo.Drivers", new[] { "CountryId" });
            DropIndex("dbo.Drivers", new[] { "DestinationId" });
            DropIndex("dbo.Destinations", new[] { "CountryId" });
            DropIndex("dbo.Customers", new[] { "CountryId" });
            DropIndex("dbo.CabBookings", new[] { "DestinationId" });
            DropIndex("dbo.CabBookings", new[] { "DriverId" });
            DropIndex("dbo.CabBookings", new[] { "VehicleId" });
            DropIndex("dbo.CabBookings", new[] { "CustomerId" });
            DropTable("dbo.UserSessions");
            DropTable("dbo.Users");
            DropTable("dbo.JourneyHotels");
            DropTable("dbo.JourneyGalleries");
            DropTable("dbo.JourneyDirectories");
            DropTable("dbo.JourneyDestinations");
            DropTable("dbo.JourneyDetails");
            DropTable("dbo.Journeys");
            DropTable("dbo.JourneyCabs");
            DropTable("dbo.HotelHighlights");
            DropTable("dbo.HotelRooms");
            DropTable("dbo.HotelTypes");
            DropTable("dbo.Hotels");
            DropTable("dbo.HotelBookings");
            DropTable("dbo.VehicleTypes");
            DropTable("dbo.Vehicles");
            DropTable("dbo.Drivers");
            DropTable("dbo.Destinations");
            DropTable("dbo.Countries");
            DropTable("dbo.Customers");
            DropTable("dbo.CabBookings");
            DropTable("dbo.Brands");
        }
    }
}
