using HomeWorkoutWebApp25.Models;
using HomeWorkoutWebApp25.ViewModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HomeWorkoutWebApp25.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase {
        private readonly UserManager<AppUser> userManager;
        private readonly List<string> _protectedUsers;
        private readonly IPasswordHasher<AppUser> passwordHasher;
        private readonly IPasswordValidator<AppUser> passwordValidator;

        public UsersController(
            UserManager<AppUser> usrMgr,
            IConfiguration configuration,
            IPasswordHasher<AppUser> passwordHash,
            IPasswordValidator<AppUser> passwordValidator) {
            this.userManager = usrMgr;
            this.passwordHasher = passwordHash;
            this.passwordValidator = passwordValidator;

            // Načtení seznamu chráněných uživatelů z appsettings.json
            _protectedUsers = configuration
                .GetSection("ProtectedUsers")
                .Get<List<string>>() ?? new List<string>();
        }

        // Načtení všech uživatelů
        [HttpGet]
        public IActionResult Index() {
            var users = userManager.Users
                .OrderBy(u => u.UserName)
                .Select(u => new {
                    u.Id,
                    u.UserName,
                    u.Email
                })
                .ToList();

            return Ok(users);
        }

        // Vytvoření nového uživatele
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] UserVM user) {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Neplatná data", errors = ModelState });

            var appUser = new AppUser {
                UserName = user.Name,
                Email = user.Email
            };

            var result = await userManager.CreateAsync(appUser, user.Password);

            if (result.Succeeded)
                return Ok(new { message = "Uživatel vytvořen" });

            return BadRequest(new {
                message = "Chyba při vytváření",
                errors = result.Errors.Select(e => e.Description)
            });
        }

        // EDITACE (GET – detail) 
        [HttpGet("{id}")]
        public async Task<IActionResult> Detail(string id) {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "Uživatel nenalezen" });

            return Ok(new {
                user.Id,
                user.UserName,
                user.Email
            });
        }

        // EDITACE (PUT – uložení změn)
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(string id, [FromBody] UserVM vm) {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Uživatel nenalezen" });

            if (_protectedUsers.Contains(user.UserName))
                return BadRequest(new { message = $"Uživatel '{user.UserName}' je chráněn a nelze jej upravit." });

            // Přidáno: Aktualizace jména uživatele
            if (!string.IsNullOrWhiteSpace(vm.Name) && user.UserName != vm.Name) {
                var userNameResult = await userManager.SetUserNameAsync(user, vm.Name);
                if (!userNameResult.Succeeded) {
                    return BadRequest(new {
                        message = "Chyba při aktualizaci uživatelského jména",
                        errors = userNameResult.Errors.Select(e => e.Description)
                    });
                }
            }

            if (!string.IsNullOrWhiteSpace(vm.Email))
                user.Email = vm.Email;

            if (!string.IsNullOrWhiteSpace(vm.Password)) {
                var validPass = await passwordValidator.ValidateAsync(userManager, user, vm.Password);
                if (!validPass.Succeeded)
                    return BadRequest(new {
                        message = "Neplatné heslo",
                        errors = validPass.Errors.Select(e => e.Description)
                    });

                user.PasswordHash = passwordHasher.HashPassword(user, vm.Password);
            }

            var result = await userManager.UpdateAsync(user);

            if (result.Succeeded)
                return Ok(new { message = "Změna provedena" });

            return BadRequest(new {
                message = "Chyba při ukládání změn",
                errors = result.Errors.Select(e => e.Description)
            });
        }

        // SMAZÁNÍ 
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id) {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "Uživatel nenalezen" });

            // Kontrola chráněného uživatele
            if (_protectedUsers.Contains(user.UserName))
                return BadRequest(new { message = $"Uživatel '{user.UserName}' je chráněn a nelze jej smazat." });

            var result = await userManager.DeleteAsync(user);

            if (result.Succeeded)
                return Ok(new { message = "Uživatel vymazán" });

            return BadRequest(new {
                message = "Chyba při mazání",
                errors = result.Errors.Select(e => e.Description)
            });
        }
    }
}
