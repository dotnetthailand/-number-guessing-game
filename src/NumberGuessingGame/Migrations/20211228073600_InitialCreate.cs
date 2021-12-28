using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NumberGuessingGame.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "game",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    rule = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    finished_utc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_game", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    first_name = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    last_name = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    name = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    profile_picture_url = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    facebook_app_scoped_user_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "player",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false),
                    game_id = table.Column<int>(type: "int", nullable: false),
                    guessed_number = table.Column<int>(type: "int", nullable: false),
                    played_at_utc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_player", x => new { x.user_id, x.game_id });
                    table.ForeignKey(
                        name: "fk_player_games_game_id",
                        column: x => x.game_id,
                        principalTable: "game",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_player_users_user_id",
                        column: x => x.user_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_player_game_id",
                table: "player",
                column: "game_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "player");

            migrationBuilder.DropTable(
                name: "game");

            migrationBuilder.DropTable(
                name: "user");
        }
    }
}
