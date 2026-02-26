using HomeWorkoutWebApp25.DTO;

namespace HomeWorkoutWebApp25.Services {
    /// <summary>
    /// Rozhraní pro správu tělesných partií.
    /// </summary>
    public interface IBodyPartsService {
        /// <summary>Vrátí všechny partie včetně přiřazených cviků.</summary>
        Task<IEnumerable<BodyPartDto>> GetAllAsync();
        /// <summary>Vrátí partii podle ID.</summary>
        Task<BodyPartDto> GetByIdAsync(int id);
        /// <summary>Vytvoří novou partii.</summary>
        Task CreateAsync(BodyPartDto dto);
        /// <summary>Aktualizuje partii podle ID.</summary>
        Task<bool> UpdateAsync(int id, BodyPartDto dto);
        /// <summary>Smaže partii podle ID.</summary>
        Task<bool> DeleteAsync(int id);
    }
}
