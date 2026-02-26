namespace HomeWorkoutWebApp25.Models {
    /// <summary>
    /// Tréninkový plán – den s přiřazenými cviky.
    /// </summary>
    public class WorkoutPlan {
        public int Id { get; set; }
        /// <summary>Název plánu.</summary>
        public string Name { get; set; }
        /// <summary>Volitelný popis plánu.</summary>
        public string? Description { get; set; }
        /// <summary>Datum tréninku.</summary>
        public DateTime Date { get; set; }
        /// <summary>Cviky zařazené do tohoto plánu.</summary>
        public List<WorkoutExercise> Exercises { get; set; }
    }
}