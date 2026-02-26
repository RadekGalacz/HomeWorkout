using Microsoft.AspNetCore.Identity;

namespace HomeWorkoutWebApp25.Models {
    /// <summary>
    /// Stav role – členové a nečlenové (používá se při editaci rolí).
    /// </summary>
    public class RoleState {
        /// <summary>Role.</summary>
        public IdentityRole Role { get; set; }
        /// <summary>Uživatelé v roli.</summary>
        public IEnumerable<AppUser> Members { get; set; }
        /// <summary>Uživatelé mimo roli.</summary>
        public IEnumerable<AppUser> NonMembers { get; set; }
    }
}
