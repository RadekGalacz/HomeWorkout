using HomeWorkoutWebApp25.DTO;

namespace HomeWorkoutWebApp25.Models {
    public class BodyParts {
        public int Id { get; set; }
        public string BodyPartName { get; set; }
        public List<Exercises>? Exercises { get; set; }
    }
}
