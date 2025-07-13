using HomeWorkoutWebApp25.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;

namespace HomeWorkoutWebApp25.Controllers;

[ApiController]
[Route("[controller]")]
public class AccountController : ControllerBase {
    private readonly UserManager<AppUser> userManager;
    private readonly SignInManager<AppUser> signInManager;

    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager) {
        this.userManager = userManager;
        this.signInManager = signInManager;
    }

    // GET: /account/login
    // Zobrazí přihlašovací stránku
    [HttpGet("login")]
    [AllowAnonymous]
    public IActionResult LoginGet() {
        return Ok(new { message = "Prosím přihlašte se." });
    }

    // POST: /account/login
    // Přihlašuje uživatele
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginVM login) {
        if (!ModelState.IsValid)
            return BadRequest(new { message = "Neplatná data", errors = ModelState });

        var user = await userManager.FindByNameAsync(login.UserName);
        if (user == null)
            return Unauthorized(new { message = "Uživatel nenalezen" });

        var result = await signInManager.PasswordSignInAsync(user, login.Password, login.Remember, false);
        if (result.Succeeded) {
            var roles = await userManager.GetRolesAsync(user);
            var userRole = roles.FirstOrDefault();

            return Ok(new {
                message = "Přihlášení proběhlo",
                user = new {
                    userName = user.UserName,
                    role = userRole
                }
            });
        }

        return Unauthorized(new { message = "Neplatné přihlašovací údaje" });
    }

    // POST: /account/logout
    // Odhlášení uživatele
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout() {
        await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
        return Ok(new { message = "Odhlášení proběhlo" });
    }

    // GET: /account/userinfo
    // Zobrazí informace o přihlášeném uživateli
    [HttpGet("userinfo")]
    [Authorize]
    public async Task<IActionResult> UserInfo() {
        var userName = User.Identity?.Name;

        if (userName == null)
            return Unauthorized(new { message = "Uživatel není přihlášen." });

        var user = await userManager.FindByNameAsync(userName);
        if (user == null)
            return Unauthorized(new { message = "Uživatel nenalezen v databázi, i když je přihlášen." });

        var roles = await userManager.GetRolesAsync(user);
        var userRole = roles.FirstOrDefault();

        return Ok(new {
            userName = user.UserName,
            role = userRole
        });
    }

    // GET: /account/access-denied
    // Přístup odepřen
    [HttpGet("access-denied")]
    public IActionResult AccessDenied() => Forbid();
}
