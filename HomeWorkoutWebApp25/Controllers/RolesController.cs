using HomeWorkoutWebApp25.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HomeWorkoutWebApp25.Controllers;

[ApiController]
[Route("[controller]")]
public class RolesController : ControllerBase {
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly List<string> _protectedRoleNames;
    private readonly List<string> _protectedUserNames;

    public RolesController(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager, IConfiguration configuration) {
        _roleManager = roleManager;
        _userManager = userManager;
        _protectedRoleNames = configuration.GetSection("ProtectedRoles").Get<List<string>>() ?? new List<string>();
        _protectedUserNames = configuration.GetSection("ProtectedUsers").Get<List<string>>() ?? new List<string>();
    }

    // Vrátí všechny role (včetně chráněných názvů)
    [HttpGet]
    public IActionResult GetAllRoles() {
        var roles = _roleManager.Roles.OrderBy(role => role.Name).ToList();
        return Ok(new { roles, protectedRoleNames = _protectedRoleNames });
    }

    // Vytvoření nové role
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] string name) {
        if (string.IsNullOrWhiteSpace(name)) {
            return BadRequest(new { message = "Název role nesmí být prázdný" });
        }

        var result = await _roleManager.CreateAsync(new IdentityRole(name));
        if (result.Succeeded) {
            return Ok(new { message = "Role vytvořena", roleName = name });
        }

        return BadRequest(new { message = "Chyba při vytváření role", errors = result.Errors });
    }

    // Smazání role podle ID
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) {
        var roleToDelete = await _roleManager.FindByIdAsync(id);
        if (roleToDelete == null)
            return NotFound(new { message = "Role nenalezena" });

        if (_protectedRoleNames.Contains(roleToDelete.Name))
            return BadRequest(new { message = "Tuto roli nelze smazat" });

        var result = await _roleManager.DeleteAsync(roleToDelete);
        if (result.Succeeded)
            return Ok(new { message = "Role smazána" });

        return BadRequest(new { message = "Chyba při mazání role", errors = result.Errors });
    }

    // Detail role – členové a nečlenové
    [HttpGet("{id}")]
    public async Task<IActionResult> Edit(string id) {
        var role = await _roleManager.FindByIdAsync(id);
        if (role == null)
            return NotFound(new { message = "Role nenalezena" });

        var members = new List<AppUser>();
        var nonMembers = new List<AppUser>();

        var allUsers = _userManager.Users.ToList();
        foreach (var user in allUsers) {
            var list = await _userManager.IsInRoleAsync(user, role.Name) ? members : nonMembers;
            list.Add(user);
        }

        return Ok(new {
            role = new { role.Id, role.Name },
            members = members.Select(u => new { u.Id, u.UserName }),
            nonMembers = nonMembers.Select(u => new { u.Id, u.UserName })
        });
    }

    // Úprava členů role (přidání / odebrání)
    [HttpPost]
    public async Task<IActionResult> EditAsync([FromBody] RoleModification roleModification) {
        if (!ModelState.IsValid)
            return BadRequest(new { message = "Neplatná data", errors = ModelState });

        var errors = new List<string>();

        // Přidání uživatelů
        foreach (var userId in roleModification.AddIds ?? Array.Empty<string>()) {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null) {
                var result = await _userManager.AddToRoleAsync(user, roleModification.RoleName);
                if (!result.Succeeded)
                    errors.AddRange(result.Errors.Select(e => e.Description));
            }
        }

        // Odebrání uživatelů
        foreach (var userId in roleModification.DeleteIds ?? Array.Empty<string>()) {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null) {
                // Zamezit odebrání chráněného uživatele z důležité role
                if (roleModification.RoleName == "Admin" && _protectedUserNames.Contains(user.UserName)) {
                    errors.Add($"Uživatel '{user.UserName}' nemůže být odebrán z role '{roleModification.RoleName}'.");
                    continue;
                }

                var result = await _userManager.RemoveFromRoleAsync(user, roleModification.RoleName);
                if (!result.Succeeded)
                    errors.AddRange(result.Errors.Select(e => e.Description));
            }
        }

        if (errors.Any())
            return BadRequest(new { message = "Některé operace selhaly", errors });

        return Ok(new { message = "Role upravena" });
    }
}