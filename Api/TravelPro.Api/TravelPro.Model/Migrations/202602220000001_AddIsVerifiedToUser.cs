namespace TravelPro.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddIsVerifiedToUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "IsVerified", c => c.Boolean(nullable: false, defaultValue: true));
        }

        public override void Down()
        {
            DropColumn("dbo.Users", "IsVerified");
        }
    }
}
