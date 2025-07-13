using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeWorkoutWebApp25.Migrations
{
    /// <inheritdoc />
    public partial class bodyParts4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartsId",
                table: "Exercises");

            migrationBuilder.AlterColumn<int>(
                name: "BodyPartsId",
                table: "Exercises",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartsId",
                table: "Exercises",
                column: "BodyPartsId",
                principalTable: "BodyParts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartsId",
                table: "Exercises");

            migrationBuilder.AlterColumn<int>(
                name: "BodyPartsId",
                table: "Exercises",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartsId",
                table: "Exercises",
                column: "BodyPartsId",
                principalTable: "BodyParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
