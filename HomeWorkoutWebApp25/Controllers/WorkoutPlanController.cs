using HomeWorkoutWebApp25.DTO;
using HomeWorkoutWebApp25.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeWorkoutWebApp25.Controllers {
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class WorkoutPlanController : ControllerBase {
        private readonly WorkoutPlanService _workoutPlanService;

        public WorkoutPlanController(WorkoutPlanService workoutPlanService) {
            _workoutPlanService = workoutPlanService;
        }

        // Vrátí všechny tréninkové plány
        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var workoutPlans = await _workoutPlanService.GetAllAsync();
            return Ok(workoutPlans);
        }

        // Vrátí jeden plán podle ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) {
            var workoutPlan = await _workoutPlanService.GetByIdAsync(id);
            if (workoutPlan == null)
                return NotFound();
            return Ok(workoutPlan);
        }

        // Vytvoří nový tréninkový plán
        [HttpPost]
        public async Task<IActionResult> Post(WorkoutPlanDto dto) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _workoutPlanService.CreateAsync(dto);
            return Ok();
        }

        // Smaže plán podle ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            var success = await _workoutPlanService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }

        // Aktualizuje plán podle ID
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, WorkoutPlanDto dto) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _workoutPlanService.UpdateAsync(id, dto);
            return success ? Ok() : NotFound();
        }
    }
}
