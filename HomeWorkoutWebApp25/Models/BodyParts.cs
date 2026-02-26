namespace HomeWorkoutWebApp25.Models {
    /// <summary>
    /// Tělesná partie (např. „Vršek těla") s přiřazenými cviky.
    /// </summary>
    public class BodyParts {
        public int Id { get; set; }
        /// <summary>Název partie.</summary>
        public string BodyPartName { get; set; }
        /// <summary>Cviky spadající pod tuto partii.</summary>
        public List<Exercises>? Exercises { get; set; }
    }
}
