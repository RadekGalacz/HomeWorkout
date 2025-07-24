using HomeWorkoutWebApp25.DTO;
using HomeWorkoutWebApp25.Migrations;
using HomeWorkoutWebApp25.Models;
using HomeWorkoutWebApp25.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeWorkoutWebApp25.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class BodyPartsController : ControllerBase {
        private readonly BodyPartsService _bodyPartsService;
        private readonly IConfiguration _configuration;
        private readonly List<string> _protectedBodyPartsNames;

        // Konstruktor controlleru, načítá službu a chráněné názvy partií z konfigurace
        public BodyPartsController(BodyPartsService bodyPartsService, IConfiguration configuration) {
            _configuration = configuration;
            _bodyPartsService = bodyPartsService;

            // Načtení seznamu chráněných partií z appsettings.json
            _protectedBodyPartsNames = configuration.GetSection("ProtectedBodyParts").Get<List<string>>() ?? new List<string>();
        }

        // Vrací všechny partie těla
        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var bodyParts = await _bodyPartsService.GetAllAsync();
            return Ok(bodyParts);
        }

        // Vrací konkrétní partii podle ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) {
            var bodyPart = await _bodyPartsService.GetByIdAsync(id);
            if (bodyPart == null)
                return NotFound();
            return Ok(bodyPart);
        }

        // Vytváří novou partii těla
        [HttpPost]
        public async Task<IActionResult> Post(BodyPartDto dto) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _bodyPartsService.CreateAsync(dto);
            return Ok();
        }

        // Smazání partie podle ID (pokud není chráněná)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            var bodyPart = await _bodyPartsService.GetByIdAsync(id);
            if (bodyPart == null)
                return NotFound();

            // Kontrola, zda se jedná o chráněnou partii
            if (_protectedBodyPartsNames.Contains(bodyPart.BodyPartName))
                return BadRequest($"Partie '{bodyPart.BodyPartName}' je chráněná a nelze ji smazat.");

            var success = await _bodyPartsService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }

        // Aktualizuje existující partii podle ID (pokud není chráněná)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, BodyPartDto dto) {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var bodyPart = await _bodyPartsService.GetByIdAsync(id);
            if (bodyPart == null)
                return NotFound();

            // Kontrola, zda se jedná o chráněnou partii
            if (_protectedBodyPartsNames.Contains(bodyPart.BodyPartName))
                return BadRequest($"Partie '{bodyPart.BodyPartName}' je chráněná a nelze ji upravit.");

            var success = await _bodyPartsService.UpdateAsync(id, dto);
            return success ? Ok() : NotFound();
        }
    }
}
