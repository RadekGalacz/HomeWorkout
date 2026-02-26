using HomeWorkoutWebApp25.DTO;

namespace HomeWorkoutWebApp25.Services {
    /// <summary>
    /// Rozhraní pro správu tréninkových plánů.
    /// </summary>
    public interface IWorkoutPlanService {
        /// <summary>Vrátí všechny plány seřazené dle data.</summary>
        Task<IEnumerable<WorkoutPlanDto>> GetAllAsync();
        /// <summary>Vrátí plán podle ID.</summary>
        Task<WorkoutPlanDto?> GetByIdAsync(int id);
        /// <summary>Vytvoří nový tréninkový plán.</summary>
        Task CreateAsync(WorkoutPlanDto dto);
        /// <summary>Aktualizuje plán podle ID.</summary>
        Task<bool> UpdateAsync(int id, WorkoutPlanDto dto);
        /// <summary>Smaže plán podle ID.</summary>
        Task<bool> DeleteAsync(int id);
    }
}
