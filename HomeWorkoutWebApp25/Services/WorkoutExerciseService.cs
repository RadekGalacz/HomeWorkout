using HomeWorkoutWebApp25.DTO;
using HomeWorkoutWebApp25.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeWorkoutWebApp25.Services {
    public class WorkoutExerciseService : IWorkoutExerciseService {
        private readonly ApplicationDbContext _dbContext;

        public WorkoutExerciseService(ApplicationDbContext dbContext) {
            _dbContext = dbContext;
        }

        // Získá všechny WorkoutExercise záznamy
        public async Task<IEnumerable<WorkoutExerciseDto>> GetAllAsync() {
            var allExercises = await _dbContext.WorkoutExercises.OrderBy(ex => ex.Id).ToListAsync();
            return allExercises.Select(ModelToDto);
        }

        // Vytvoří nový WorkoutExercise záznam
        public async Task CreateAsync(WorkoutExerciseDto newExercise) {
            var exercise = DtoToModel(newExercise);
            _dbContext.WorkoutExercises.Add(exercise);
            await _dbContext.SaveChangesAsync();
        }

        // Smaže WorkoutExercise záznam podle ID
        public async Task<bool> DeleteAsync(int id) {
            var exercise = await _dbContext.WorkoutExercises.FindAsync(id);
            if (exercise == null)
                return false;

            _dbContext.WorkoutExercises.Remove(exercise);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Aktualizuje WorkoutExercise záznam podle ID
        public async Task<bool> UpdateAsync(int id, WorkoutExerciseDto dto) {
            var exercise = await _dbContext.WorkoutExercises.FindAsync(id);
            if (exercise == null)
                return false;

            exercise.Sets = dto.Sets;
            exercise.Reps = dto.Reps;
            exercise.Checked = dto.Checked ?? false;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Vrátí WorkoutExercise podle ID
        public async Task<WorkoutExerciseDto?> GetByIdAsync(int id) {
            var ex = await _dbContext.WorkoutExercises.FindAsync(id);
            return ex == null ? null : ModelToDto(ex);
        }

        // Konvertuje model na DTO
        private WorkoutExerciseDto ModelToDto(WorkoutExercise ex) {
            return new WorkoutExerciseDto {
                Id = ex.Id,
                Sets = ex.Sets,
                Reps = ex.Reps,
                WorkoutPlanId = ex.WorkoutPlanId,
                ExerciseId = ex.ExerciseId,
                Checked = ex.Checked
            };
        }

        // Konvertuje DTO na model
        private WorkoutExercise DtoToModel(WorkoutExerciseDto dto) {
            return new WorkoutExercise {
                Id = dto.Id,
                Sets = dto.Sets,
                Reps = dto.Reps,
                WorkoutPlanId = dto.WorkoutPlanId,
                ExerciseId = dto.ExerciseId,
                Checked = dto.Checked ?? false
            };
        }
    }
}
