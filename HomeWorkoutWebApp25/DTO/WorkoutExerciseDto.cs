namespace HomeWorkoutWebApp25.DTO {
    /// <summary>
    /// DTO pro cvik v tréninkovém plánu – přenos dat mezi API a klientem.
    /// </summary>
    public class WorkoutExerciseDto {
        public int Id { get; set; }
        /// <summary>Počet sérií.</summary>
        public int Sets { get; set; }
        /// <summary>Počet opakování.</summary>
        public int Reps { get; set; }
        /// <summary>FK na tréninkový plán.</summary>
        public int WorkoutPlanId { get; set; }
        /// <summary>FK na cvik.</summary>
        public int ExerciseId { get; set; }
        /// <summary>Zda byl cvik splněn (nullable pro volitelný vstup).</summary>
        public bool? Checked { get; set; }
    }
}