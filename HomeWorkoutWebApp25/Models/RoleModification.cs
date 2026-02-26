using System.ComponentModel.DataAnnotations;

namespace HomeWorkoutWebApp25.Models {
    /// <summary>
    /// Model pro úpravu členů role – přidání / odebrání uživatelů.
    /// </summary>
    public class RoleModification {
        [Required]
        /// <summary>Název role, které se úprava týká.</summary>
        public string RoleName { get; set; }
        /// <summary>ID role.</summary>
        public string RoleId { get; set; }
        /// <summary>ID uživatelů k přidání do role.</summary>
        public string[]? AddIds { get; set; }
        /// <summary>ID uživatelů k odebrání z role.</summary>
        public string[]? DeleteIds { get; set; }
    }
}
