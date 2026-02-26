using System.ComponentModel.DataAnnotations;

namespace HomeWorkoutWebApp25.DTO {
    /// <summary>
    /// DTO pro cvik – přenos dat mezi API a klientem.
    /// </summary>
    public class ExerciseDto {
        public int Id { get; set; }
        /// <summary>Název cviku.</summary>
        public string ExerciseName { get; set; }
        /// <summary>Popis / instrukce cviku.</summary>
        public string ExerciseDescription { get; set; }

        /// <summary>Obtížnost (1–5).</summary>
        [Range(1, 5, ErrorMessage = "Obtížnost musí být mezi 1 a 5.")]
        public int Difficulty { get; set; }

        /// <summary>FK na tělesnou partii.</summary>
        public int BodyPartId { get; set; }
    }
}