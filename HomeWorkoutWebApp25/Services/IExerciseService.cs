using HomeWorkoutWebApp25.DTO;

namespace HomeWorkoutWebApp25.Services {
    /// <summary>
    /// Rozhraní pro správu cviků.
    /// </summary>
    public interface IExerciseService {
        /// <summary>Vrátí všechny cviky.</summary>
        Task<IEnumerable<ExerciseDto>> GetAllAsync();
        /// <summary>Vrátí cvik podle ID.</summary>
        Task<ExerciseDto> GetByIdAsync(int id);
        /// <summary>Vytvoří nový cvik.</summary>
        Task CreateAsync(ExerciseDto dto);
        /// <summary>Aktualizuje cvik podle ID.</summary>
        Task<bool> UpdateAsync(int id, ExerciseDto dto);
        /// <summary>Smaže cvik podle ID.</summary>
        Task<bool> DeleteAsync(int id);
    }
}
