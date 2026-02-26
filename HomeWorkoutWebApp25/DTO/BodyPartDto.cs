namespace HomeWorkoutWebApp25.DTO {
    /// <summary>
    /// DTO pro tělesnou partii – přenos dat mezi API a klientem.
    /// </summary>
    public class BodyPartDto {
        public int Id { get; set; }
        /// <summary>Název partie.</summary>
        public string BodyPartName { get; set; }
        /// <summary>Cviky spadající pod partii.</summary>
        public List<ExerciseDto>? Exercises { get; set; }
    }
}