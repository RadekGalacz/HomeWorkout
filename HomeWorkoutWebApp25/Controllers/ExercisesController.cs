using HomeWorkoutWebApp25.DTO;
using HomeWorkoutWebApp25.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HomeWorkoutWebApp25.Controllers {
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ExercisesController : ControllerBase {
        private readonly IExerciseService _exerciseService;
        private readonly List<string> _protectedExercisesNames;

        public ExercisesController(IExerciseService exerciseService, IConfiguration configuration) {
            _exerciseService = exerciseService;
            _protectedExercisesNames = configuration.GetSection("ProtectedExercises").Get<List<string>>() ?? new List<string>();
        }

        // Vrátí seznam všech cviků
        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var exercises = await _exerciseService.GetAllAsync();
            return Ok(exercises);
        }

        // Vrátí jeden cvik podle ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) {
            var exercise = await _exerciseService.GetByIdAsync(id);
            if (exercise == null)
                return NotFound();
            return Ok(exercise);
        }

        // Vytvoří nový cvik
        [HttpPost]
        public async Task<IActionResult> Post(ExerciseDto dto) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _exerciseService.CreateAsync(dto);
            return Ok();
        }

        // Smaže cvik podle ID (pokud není chráněný)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            var exercise = await _exerciseService.GetByIdAsync(id);
            if (exercise == null)
                return NotFound();

            if (_protectedExercisesNames.Contains(exercise.ExerciseName))
                return BadRequest($"Cvik '{exercise.ExerciseName}' je chráněný a nelze jej smazat.");

            var success = await _exerciseService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }

        // Aktualizuje cvik podle ID (pokud není chráněný)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ExerciseDto dto) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exercise = await _exerciseService.GetByIdAsync(id);
            if (exercise == null)
                return NotFound();

            if (_protectedExercisesNames.Contains(exercise.ExerciseName))
                return BadRequest($"Cvik '{exercise.ExerciseName}' je chráněný a nelze jej upravit.");

            var success = await _exerciseService.UpdateAsync(id, dto);
            return success ? Ok() : NotFound();
        }
    }
}
