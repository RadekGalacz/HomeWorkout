namespace HomeWorkoutWebApp25.Models {
    public class WorkoutExercise {
        public int Id { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public WorkoutPlan WorkoutPlan { get; set; }
        public int WorkoutPlanId { get; set; }
        public Exercises Exercise { get; set; }
        public int ExerciseId { get; set; }
        public bool Checked { get; set; }
    }
}