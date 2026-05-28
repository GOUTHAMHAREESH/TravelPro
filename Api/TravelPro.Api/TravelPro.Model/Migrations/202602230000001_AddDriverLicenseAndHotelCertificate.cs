namespace TravelPro.Model.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AddDriverLicenseAndHotelCertificate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Drivers", "LicenseDocument", c => c.String(maxLength: 200));
            AddColumn("dbo.Hotels", "RegistrationCertificate", c => c.String(maxLength: 200));
        }

        public override void Down()
        {
            DropColumn("dbo.Hotels", "RegistrationCertificate");
            DropColumn("dbo.Drivers", "LicenseDocument");
        }
    }
}
