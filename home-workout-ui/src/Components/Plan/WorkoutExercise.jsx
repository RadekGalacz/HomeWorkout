import React, { useState } from "react";
import Select from "react-select";

function WorkoutExercise({
  exercises,
  newWorkoutExercises,
  setNewWorkoutExercises,
  insertWorkoutExercises,
  setActiveWorkoutPlanId,
}) {
  const [validSets, setValidSets] = useState(false); // Validace pole pro série
  const [validReps, setValidReps] = useState(false); // Validace pole pro opakování

  // Změna hodnoty série
  const handleSetsChange = (e) => {
    const value = e.target.value;
    setNewWorkoutExercises((prev) => ({ ...prev, sets: value }));
    setValidSets(value.trim() !== ""); // Validace – nesmí být prázdné
  };

  // Změna hodnoty opakování
  const handleRepsChange = (e) => {
    const value = e.target.value;
    setNewWorkoutExercises((prev) => ({ ...prev, reps: value }));
    setValidReps(value.trim() !== ""); // Validace – nesmí být prázdné
  };

  // Změna výběru cviku
  const handleExerciseChange = (selectedOption) => {
    setNewWorkoutExercises((prev) => ({
      ...prev,
      exerciseId: selectedOption ? selectedOption.value : null,
    }));
  };

  // Odeslání formuláře
const handleSubmit = (e) => {
  e.preventDefault();

  // Kontrola, zda jsou všechna pole validní
  if (
    validSets &&
    validReps &&
    newWorkoutExercises.exerciseId != null &&
    newWorkoutExercises.workoutPlanId != null
  ) {
    // Nastavení defaultní hodnoty pro checked
    const newExercise = {
      ...newWorkoutExercises,
      checked: false, 
    };

    insertWorkoutExercises(newExercise); 
    setNewWorkoutExercises({
      sets: "",
      reps: "",
      workoutPlanId: newWorkoutExercises.workoutPlanId,
      exerciseId: null,
    });
    setValidSets(false);
    setValidReps(false);
    setActiveWorkoutPlanId(null);
  }
};

  // Převod cviků do formátu pro react-select, seřazedno dle abecedy
  const options = exercises
  .sort((a, b) =>
    a.exerciseName.toLowerCase().localeCompare(b.exerciseName.toLowerCase())
).map((item) => ({
    value: item.id,
    label: item.exerciseName,
  }));

  // Kontrola, zda je celý formulář validní
  const formIsValid =
    validSets &&
    validReps &&
    newWorkoutExercises.exerciseId != null &&
    newWorkoutExercises.workoutPlanId != null;

  return (
    <div className="border border-primary rounded p-3 mt-3">
      
      {/* Formulář se zobrazuje v plánu pro přidání cviku */}
      <form onSubmit={handleSubmit} className="row g-2  px-2">
        <div className="bg-light"></div>

        {/* Výběr cviku */}
        <div className="col-12">
          <label className="form-label fw-semibold small">
            🏋️ Co budete cvičit
          </label>
          <Select
            options={options}
            value={
              options.find(
                (opt) => opt.value === newWorkoutExercises.exerciseId
              ) || null
            }
            onChange={handleExerciseChange}
            classNamePrefix="react-select"
            autoFocus
          />
        </div>

        {/* Zadání série */}
        <div className="col-6">
          <label htmlFor="Sets" className="form-label fw-semibold small">
            🎯 Série
          </label>
          <input
            type="number"
            id="Sets"
            className="form-control form-control-sm"
            value={newWorkoutExercises.sets || ""}
            onChange={handleSetsChange}
            placeholder="Např. 4"
            min={1}
            required
          />
        </div>

        {/* Zadání opakování */}
        <div className="col-6">
          <label htmlFor="Reps" className="form-label fw-semibold small">
            🔁 Opak.
          </label>
          <input
            type="number"
            id="Reps"
            className="form-control form-control-sm"
            value={newWorkoutExercises.reps || ""}
            onChange={handleRepsChange}
            placeholder="Např. 8"
            min={1}
            required
          />
        </div>

        {/* Tlačítko pro přidání cviku */}
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-sm btn-outline-success w-100"
            disabled={!formIsValid}
          >
            ➕ Přidat
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkoutExercise;
