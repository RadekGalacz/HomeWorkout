using System.ComponentModel.DataAnnotations;

namespace HomeWorkoutWebApp25.ViewModel {
    /// <summary>
    /// ViewModel pro vytvoření / editaci uživatele.
    /// </summary>
    public class UserVM {
        [Required]
        /// <summary>Uživatelské jméno.</summary>
        public string Name { get; set; }
        [Required]
        /// <summary>E-mailová adresa.</summary>
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "E-mail není validní")]
        public string Email { get; set; }
        /// <summary>Heslo (volitelné při editaci).</summary>
        public string? Password { get; set; }
    }
}
