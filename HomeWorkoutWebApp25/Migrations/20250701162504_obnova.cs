using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeWorkoutWebApp25.Migrations
{
    /// <inheritdoc />
    public partial class obnova : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "WorkoutExercises");

            migrationBuilder.AddColumn<int>(
                name: "ExerciseId",
                table: "WorkoutExercises",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExerciseId",
                table: "WorkoutExercises");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "WorkoutExercises",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
