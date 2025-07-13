using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeWorkoutWebApp25.Migrations
{
    /// <inheritdoc />
    public partial class AddExerciseNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_BodyPartId",
                table: "Exercises",
                column: "BodyPartId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartId",
                table: "Exercises",
                column: "BodyPartId",
                principalTable: "BodyParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartId",
                table: "Exercises");

            migrationBuilder.DropIndex(
                name: "IX_Exercises_BodyPartId",
                table: "Exercises");

            migrationBuilder.AddColumn<int>(
                name: "BodyPartsId",
                table: "Exercises",
                type: "int",
                nullable: true);

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
    }
}
