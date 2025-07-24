namespace HomeWorkoutWebApp25.Models {
    public class WorkoutPlan {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime Date { get; set; }

        public List<WorkoutExercise> Exercises { get; set; }
    }
}