namespace HomeWorkoutWebApp25.Models {
    /// <summary>
    /// Vazba cviku na tréninkový plán – počet sérií, opakování a stav splnění.
    /// </summary>
    public class WorkoutExercise {
        public int Id { get; set; }
        /// <summary>Počet sérií.</summary>
        public int Sets { get; set; }
        /// <summary>Počet opakování v sérii.</summary>
        public int Reps { get; set; }
        /// <summary>Navigační vlastnost na plán.</summary>
        public WorkoutPlan WorkoutPlan { get; set; }
        /// <summary>FK na tréninkový plán.</summary>
        public int WorkoutPlanId { get; set; }
        /// <summary>Navigační vlastnost na cvik.</summary>
        public Exercises Exercise { get; set; }
        /// <summary>FK na cvik.</summary>
        public int ExerciseId { get; set; }
        /// <summary>Zda byl cvik splněn.</summary>
        public bool Checked { get; set; }
    }
}