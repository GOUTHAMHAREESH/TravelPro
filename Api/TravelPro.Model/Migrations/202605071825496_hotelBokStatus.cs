namespace TravelPro.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class hotelBokStatus : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.HotelBookings", "Status", c => c.String(maxLength: 100));
        }
        
        public override void Down()
        {
            DropColumn("dbo.HotelBookings", "Status");
        }
    }
}
