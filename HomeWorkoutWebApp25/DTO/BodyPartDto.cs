namespace HomeWorkoutWebApp25.DTO {
    public class BodyPartDto {
        public int Id { get; set; }
        public string BodyPartName { get; set; }
        public List<ExerciseDto>? Exercises { get; set; }
    }
}