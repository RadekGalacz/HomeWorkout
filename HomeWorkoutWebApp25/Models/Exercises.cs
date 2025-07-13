namespace HomeWorkoutWebApp25.Models {
    public class Exercises {
        public int Id { get; set; }
        public string ExerciseName { get; set; }
        public string ExerciseDescription { get; set; }
        public int Difficulty { get; set; }
        public int BodyPartId { get; set; }
        public BodyParts BodyPart { get; set; }

    }
}