using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeWorkoutWebApp25.Migrations
{
    /// <inheritdoc />
    public partial class bodyParts2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BodyPartsId",
                table: "Exercises",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdExercise",
                table: "BodyParts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_BodyPartsId",
                table: "Exercises",
                column: "BodyPartsId");

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

            migrationBuilder.DropIndex(
                name: "IX_Exercises_BodyPartsId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "BodyPartsId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "IdExercise",
                table: "BodyParts");
        }
    }
}
