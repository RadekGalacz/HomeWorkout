using HomeWorkoutWebApp25.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HomeWorkoutWebApp25 {
    /// <summary>
    /// Databázový kontext aplikace – spravuje entity a Identity tabulky.
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<AppUser> {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        /// <summary>Tabulka cviků.</summary>
        public DbSet<Exercises> Exercises { get; set; }
        /// <summary>Tabulka tělesných partií.</summary>
        public DbSet<BodyParts> BodyParts { get; set; }
        /// <summary>Tabulka tréninkových plánů.</summary>
        public DbSet<WorkoutPlan> WorkoutPlans { get; set; }
        /// <summary>Tabulka cviků přiřazených k plánům.</summary>
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
    }
}
