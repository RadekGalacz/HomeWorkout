using System.ComponentModel.DataAnnotations;

namespace HomeWorkoutWebApp25.ViewModel {
    public class UserVM {
        [Required]
        public string Name { get; set; }
        [Required]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "E-mail není validní")]
        public string Email { get; set; }
        public string? Password { get; set; }
    }
}
