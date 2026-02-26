using HomeWorkoutWebApp25.DTO;
using HomeWorkoutWebApp25.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeWorkoutWebApp25.Services {
    public class ExerciseService : IExerciseService {
        private readonly ApplicationDbContext _dbContext;

        public ExerciseService(ApplicationDbContext dbContext) {
            _dbContext = dbContext;
        }

        // Získá všechny cviky seřazené podle BodyPartId sestupně
        public async Task<IEnumerable<ExerciseDto>> GetAllAsync() {
            var allExercises = await _dbContext.Exercises
                .OrderByDescending(exer => exer.BodyPartId)
                .ToListAsync();

            return allExercises.Select(ModelToDto);
        }

        // Vytvoří nový cvik
        public async Task CreateAsync(ExerciseDto newExercise) {
            var exercise = DtoToModel(newExercise);
            _dbContext.Exercises.Add(exercise);
            await _dbContext.SaveChangesAsync();
        }

        // Smaže cvik podle ID
        public async Task<bool> DeleteAsync(int id) {
            var exercise = await _dbContext.Exercises.FindAsync(id);
            if (exercise == null)
                return false;

            _dbContext.Exercises.Remove(exercise);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Aktualizuje cvik podle ID
        public async Task<bool> UpdateAsync(int id, ExerciseDto dto) {
            var exercise = await _dbContext.Exercises.FindAsync(id);
            if (exercise == null)
                return false;

            exercise.ExerciseName = dto.ExerciseName;
            exercise.ExerciseDescription = dto.ExerciseDescription;
            exercise.Difficulty = dto.Difficulty;
            exercise.BodyPartId = dto.BodyPartId;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Vrátí cvik podle ID
        public async Task<ExerciseDto> GetByIdAsync(int id) {
            var exerciseToEdit = await _dbContext.Exercises.FindAsync(id);
            if (exerciseToEdit == null) {
                return null;
            }
            return ModelToDto(exerciseToEdit);
        }

        // Konvertuje model na DTO
        private ExerciseDto ModelToDto(Exercises exercise) {
            return new ExerciseDto {
                Id = exercise.Id,
                ExerciseName = exercise.ExerciseName,
                ExerciseDescription = exercise.ExerciseDescription,
                Difficulty = exercise.Difficulty,
                BodyPartId = exercise.BodyPartId
            };
        }

        // Konvertuje DTO na model
        private Exercises DtoToModel(ExerciseDto newExercise) {
            return new Exercises {
                Id = newExercise.Id,
                ExerciseName = newExercise.ExerciseName,
                ExerciseDescription = newExercise.ExerciseDescription,
                Difficulty = newExercise.Difficulty,
                BodyPartId = newExercise.BodyPartId
            };
        }
    }
}
