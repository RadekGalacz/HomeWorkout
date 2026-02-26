using HomeWorkoutWebApp25.DTO;

namespace HomeWorkoutWebApp25.Services {
    /// <summary>
    /// Rozhraní pro správu cviků přiřazených k tréninkovým plánům.
    /// </summary>
    public interface IWorkoutExerciseService {
        /// <summary>Vrátí všechny záznamy cviků v trénincích.</summary>
        Task<IEnumerable<WorkoutExerciseDto>> GetAllAsync();
        /// <summary>Vrátí záznam cviku podle ID.</summary>
        Task<WorkoutExerciseDto?> GetByIdAsync(int id);
        /// <summary>Vytvoří nový záznam cviku v tréninku.</summary>
        Task CreateAsync(WorkoutExerciseDto dto);
        /// <summary>Aktualizuje záznam cviku podle ID.</summary>
        Task<bool> UpdateAsync(int id, WorkoutExerciseDto dto);
        /// <summary>Smaže záznam cviku podle ID.</summary>
        Task<bool> DeleteAsync(int id);
    }
}
