using System.ComponentModel.DataAnnotations;

namespace HomeWorkoutWebApp25.Models {
    /// <summary>
    /// ViewModel pro přihlášení uživatele.
    /// </summary>
    public class LoginVM {
        [Required]
        /// <summary>Uživatelské jméno.</summary>
        public string UserName { get; set; }
        [Required]
        /// <summary>Heslo.</summary>
        public string Password { get; set; }
        /// <summary>URL pro přesměrování po přihlášení.</summary>
        public string? ReturnUrl { get; set; }
        /// <summary>Zapamatovat přihlášení.</summary>
        public bool Remember { get; set; }
    }
}
