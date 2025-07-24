using HomeWorkoutWebApp25.Models;

namespace HomeWorkoutWebApp25.DTO {
    public class WorkoutExerciseDto {
        public int Id { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public int WorkoutPlanId { get; set; }
        public int ExerciseId { get; set; }

        public bool? Checked { get; set; }
    }
}