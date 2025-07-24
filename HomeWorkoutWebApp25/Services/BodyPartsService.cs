using HomeWorkoutWebApp25.DTO;
using HomeWorkoutWebApp25.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeWorkoutWebApp25.Services {
    public class BodyPartsService {
        private readonly ApplicationDbContext _dbContext;

        public BodyPartsService(ApplicationDbContext dbContext) {
            _dbContext = dbContext;
        }

        // Získá všechny tělesné partie (včetně jejich cviků), seřazené podle jména
        public async Task<IEnumerable<BodyPartDto>> GetAllAsync() {
            var allBodyParts = await _dbContext.BodyParts
                .Include(bp => bp.Exercises)
                .OrderBy(bp => bp.BodyPartName)
                .ToListAsync();

            return allBodyParts.Select(ModelToDto);
        }

        // Vytvoří novou tělesnou partii
        public async Task CreateAsync(BodyPartDto newBodyPart) {
            var bodyPart = DtoToModel(newBodyPart);
            _dbContext.BodyParts.Add(bodyPart);
            await _dbContext.SaveChangesAsync();
        }

        // Smaže tělesnou partii podle ID
        public async Task<bool> DeleteAsync(int id) {
            var bodyPart = await _dbContext.BodyParts.FindAsync(id);
            if (bodyPart == null)
                return false;

            _dbContext.BodyParts.Remove(bodyPart);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Aktualizuje tělesnou partii podle ID
        public async Task<bool> UpdateAsync(int id, BodyPartDto dto) {
            var bodyPart = await _dbContext.BodyParts.FindAsync(id);
            if (bodyPart == null)
                return false;

            bodyPart.BodyPartName = dto.BodyPartName;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Vrátí tělesnou partii podle ID
        internal async Task<BodyPartDto> GetByIdAsync(int id) {
            var bodyPartToEdit = await _dbContext.BodyParts.FindAsync(id);
            if (bodyPartToEdit == null) {
                return null;
            }
            return ModelToDto(bodyPartToEdit);
        }

        // Konvertuje model na DTO
        private BodyPartDto ModelToDto(BodyParts bodyPart) {
            return new BodyPartDto {
                Id = bodyPart.Id,
                BodyPartName = bodyPart.BodyPartName,
                Exercises = bodyPart.Exercises?.Select(e => new ExerciseDto {
                    Id = e.Id,
                    ExerciseName = e.ExerciseName,
                    ExerciseDescription = e.ExerciseDescription,
                    Difficulty = e.Difficulty,
                    BodyPartId = e.BodyPartId
                }).ToList() ?? new List<ExerciseDto>()
            };
        }

        // Konvertuje DTO na model
        private BodyParts DtoToModel(BodyPartDto newBodyPart) {
            return new BodyParts {
                Id = newBodyPart.Id,
                BodyPartName = newBodyPart.BodyPartName,
            };
        }
    }
}
