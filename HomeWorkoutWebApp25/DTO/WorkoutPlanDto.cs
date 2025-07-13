namespace HomeWorkoutWebApp25.DTO {
    public class WorkoutPlanDto {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public List<WorkoutExerciseDto>? Exercises { get; set; }
    }
}