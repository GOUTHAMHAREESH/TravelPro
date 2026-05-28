namespace TravelPro.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agency2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Agencies",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(maxLength: 150),
                        EmailId = c.String(maxLength: 100),
                        MobileNo = c.String(maxLength: 100),
                        Location = c.String(maxLength: 100),
                        Address = c.String(maxLength: 200),
                        CountryId = c.Long(nullable: false),
                        RegistrationDocument = c.String(maxLength: 200),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Countries", t => t.CountryId, cascadeDelete: true)
                .Index(t => t.CountryId);
            
            AddColumn("dbo.Drivers", "AgencyId", c => c.Long());
            AddColumn("dbo.Vehicles", "AgencyId", c => c.Long());
            AddColumn("dbo.Users", "AgencyId", c => c.Long());
            CreateIndex("dbo.Drivers", "AgencyId");
            CreateIndex("dbo.Vehicles", "AgencyId");
            CreateIndex("dbo.Users", "AgencyId");
            AddForeignKey("dbo.Drivers", "AgencyId", "dbo.Agencies", "Id");
            AddForeignKey("dbo.Vehicles", "AgencyId", "dbo.Agencies", "Id");
            AddForeignKey("dbo.Users", "AgencyId", "dbo.Agencies", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "AgencyId", "dbo.Agencies");
            DropForeignKey("dbo.Vehicles", "AgencyId", "dbo.Agencies");
            DropForeignKey("dbo.Drivers", "AgencyId", "dbo.Agencies");
            DropForeignKey("dbo.Agencies", "CountryId", "dbo.Countries");
            DropIndex("dbo.Users", new[] { "AgencyId" });
            DropIndex("dbo.Vehicles", new[] { "AgencyId" });
            DropIndex("dbo.Drivers", new[] { "AgencyId" });
            DropIndex("dbo.Agencies", new[] { "CountryId" });
            DropColumn("dbo.Users", "AgencyId");
            DropColumn("dbo.Vehicles", "AgencyId");
            DropColumn("dbo.Drivers", "AgencyId");
            DropTable("dbo.Agencies");
        }
    }
}
