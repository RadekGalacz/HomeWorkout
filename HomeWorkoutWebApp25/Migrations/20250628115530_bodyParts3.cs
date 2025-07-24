using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeWorkoutWebApp25.Migrations
{
    /// <inheritdoc />
    public partial class bodyParts3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartsId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "IdExercise",
                table: "BodyParts");

            migrationBuilder.AlterColumn<int>(
                name: "BodyPartsId",
                table: "Exercises",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BodyPartId",
                table: "Exercises",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartsId",
                table: "Exercises",
                column: "BodyPartsId",
                principalTable: "BodyParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartsId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "BodyPartId",
                table: "Exercises");

            migrationBuilder.AlterColumn<int>(
                name: "BodyPartsId",
                table: "Exercises",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "IdExercise",
                table: "BodyParts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_BodyParts_BodyPartsId",
                table: "Exercises",
                column: "BodyPartsId",
                principalTable: "BodyParts",
                principalColumn: "Id");
        }
    }
}
