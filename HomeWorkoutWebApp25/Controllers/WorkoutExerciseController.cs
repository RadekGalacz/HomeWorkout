using HomeWorkoutWebApp25.DTO;
using HomeWorkoutWebApp25.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeWorkoutWebApp25.Controllers {
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class WorkoutExerciseController : ControllerBase {
        private readonly IWorkoutExerciseService _workoutExerciseService;

        public WorkoutExerciseController(IWorkoutExerciseService workoutExerciseService) {
            _workoutExerciseService = workoutExerciseService;
        }

        // Vrátí všechny cviky přiřazené ke konkrétním tréninkům
        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var allExercises = await _workoutExerciseService.GetAllAsync();
            return Ok(allExercises);
        }

        // Vrátí cvik podle ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) {
            var workoutExercise = await _workoutExerciseService.GetByIdAsync(id);
            if (workoutExercise == null)
                return NotFound();
            return Ok(workoutExercise);
        }

        // Vytvoří nový záznam cviku v tréninku
        [HttpPost]
        public async Task<IActionResult> Post(WorkoutExerciseDto dto) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _workoutExerciseService.CreateAsync(dto);
            return Ok();
        }

        // Smaže záznam cviku z tréninku podle ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            var success = await _workoutExerciseService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }

        // Aktualizuje záznam cviku v tréninku
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, WorkoutExerciseDto dto) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _workoutExerciseService.UpdateAsync(id, dto);
            return success ? Ok() : NotFound();
        }
    }
}
