namespace HomeWorkoutWebApp25.DTO {
    /// <summary>
    /// DTO pro tréninkový plán – přenos dat mezi API a klientem.
    /// </summary>
    public class WorkoutPlanDto {
        public int Id { get; set; }
        /// <summary>Název plánu.</summary>
        public string Name { get; set; }
        /// <summary>Volitelný popis plánu.</summary>
        public string? Description { get; set; }
        /// <summary>Datum tréninku.</summary>
        public DateTime Date { get; set; }
        /// <summary>Cviky zařazené do plánu.</summary>
        public List<WorkoutExerciseDto>? Exercises { get; set; }
    }
}