using HomeWorkoutWebApp25.DTO;
using HomeWorkoutWebApp25.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeWorkoutWebApp25.Services {
    public class WorkoutPlanService : IWorkoutPlanService {
        private readonly ApplicationDbContext _dbContext;

        public WorkoutPlanService(ApplicationDbContext dbContext) {
            _dbContext = dbContext;
        }

        // Získá všechny tréninkové plány seřazené podle data
        public async Task<IEnumerable<WorkoutPlanDto>> GetAllAsync() {
            var allPlans = await _dbContext.WorkoutPlans
                                           .OrderBy(plan => plan.Date)
                                           .ToListAsync();

            return allPlans.Select(ModelToDto);
        }

        // Vytvoří nový tréninkový plán
        public async Task CreateAsync(WorkoutPlanDto newPlan) {
            var plan = DtoToModel(newPlan);
            _dbContext.WorkoutPlans.Add(plan);
            await _dbContext.SaveChangesAsync();
        }

        // Smaže plán podle ID
        public async Task<bool> DeleteAsync(int id) {
            var plan = await _dbContext.WorkoutPlans.FindAsync(id);
            if (plan == null)
                return false;

            _dbContext.WorkoutPlans.Remove(plan);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Aktualizuje plán podle ID
        public async Task<bool> UpdateAsync(int id, WorkoutPlanDto dto) {
            var plan = await _dbContext.WorkoutPlans.FindAsync(id);
            if (plan == null)
                return false;

            plan.Name = dto.Name;
            plan.Description = dto.Description;
            plan.Date = dto.Date;

            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Vrátí plán podle ID
        public async Task<WorkoutPlanDto?> GetByIdAsync(int id) {
            var plan = await _dbContext.WorkoutPlans.FindAsync(id);
            return plan == null ? null : ModelToDto(plan);
        }

        // Konvertuje model na DTO
        private WorkoutPlanDto ModelToDto(WorkoutPlan plan) {
            return new WorkoutPlanDto {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                Date = plan.Date,
            };
        }

        // Konvertuje DTO na model
        private WorkoutPlan DtoToModel(WorkoutPlanDto dto) {
            return new WorkoutPlan {
                Id = dto.Id,
                Name = dto.Name,
                Description = dto.Description,
                Date = dto.Date,
            };
        }
    }
}
