namespace HomeWorkoutWebApp25.Models {
    /// <summary>
    /// Cvik – obsahuje název, popis, obtížnost a vazbu na partii.
    /// </summary>
    public class Exercises {
        public int Id { get; set; }
        /// <summary>Název cviku.</summary>
        public string ExerciseName { get; set; }
        /// <summary>Popis / instrukce cviku.</summary>
        public string ExerciseDescription { get; set; }
        /// <summary>Obtížnost (1–5).</summary>
        public int Difficulty { get; set; }
        /// <summary>FK na tělesnou partii.</summary>
        public int BodyPartId { get; set; }
        /// <summary>Navigační vlastnost na partii.</summary>
        public BodyParts BodyPart { get; set; }
    }
}