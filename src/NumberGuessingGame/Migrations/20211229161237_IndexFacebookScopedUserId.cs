using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NumberGuessingGame.Migrations
{
    public partial class IndexFacebookScopedUserId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_user_email",
                table: "user");

            migrationBuilder.CreateIndex(
                name: "ix_user_facebook_app_scoped_user_id",
                table: "user",
                column: "facebook_app_scoped_user_id",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_user_facebook_app_scoped_user_id",
                table: "user");

            migrationBuilder.CreateIndex(
                name: "ix_user_email",
                table: "user",
                column: "email",
                unique: true,
                filter: "[email] IS NOT NULL");
        }
    }
}
