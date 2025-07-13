using HomeWorkoutWebApp25.Models;
using System.ComponentModel.DataAnnotations;

namespace HomeWorkoutWebApp25.DTO {
    public class ExerciseDto {
        public int Id { get; set; }
        public string ExerciseName { get; set; }
        public string ExerciseDescription { get; set; }

        [Range(1, 5, ErrorMessage = "Obtížnost musí být mezi 1 a 5.")]
        public int Difficulty { get; set; }

        public int BodyPartId { get; set; }
    }
}