/**
 * WorkoutExercise – Inline formulář pro přidání cviku do plánu.
 * Výběr cviku (react-select), počet sérií a opakování.
 */
import { useState, useMemo } from 'react';
import Select from 'react-select';

function WorkoutExercise({ exercises, workoutPlanId, onSubmit, onClose }) {
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [exerciseId, setExerciseId] = useState(null);

  const options = useMemo(
    () => [...exercises].sort((a, b) => a.exerciseName.toLowerCase().localeCompare(b.exerciseName.toLowerCase()))
      .map((item) => ({ value: item.id, label: item.exerciseName })),
    [exercises]
  );

  const formIsValid = sets.trim() !== '' && reps.trim() !== '' && exerciseId != null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formIsValid) return;
    onSubmit({ sets, reps, exerciseId, workoutPlanId, checked: false });
    setSets(''); setReps(''); setExerciseId(null);
    onClose();
  };

  return (
    <div className="hw-card mt-2" style={{ padding: '0.65rem', borderColor: 'var(--hw-primary-box)' }}>
      <form onSubmit={handleSubmit} className="row g-2 align-items-end">
        <div className="col-12">
          <label className="form-label small fw-semibold mb-1">Cvik</label>
          <Select options={options} value={options.find((o) => o.value === exerciseId) || null} onChange={(o) => setExerciseId(o ? o.value : null)} classNamePrefix="react-select" autoFocus placeholder="Vyberte..." />
        </div>
        <div className="col-5">
          <label className="form-label small fw-semibold mb-1">Série</label>
          <input type="number" className="form-control form-control-sm" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="např. 4" min={1} required />
        </div>
        <div className="col-5">
          <label className="form-label small fw-semibold mb-1">Opak.</label>
          <input type="number" className="form-control form-control-sm" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="např. 8" min={1} required />
        </div>
        <div className="col-2">
          <button type="submit" className="hw-btn hw-btn-success w-100" disabled={!formIsValid}>+</button>
        </div>
      </form>
    </div>
  );
}

export default WorkoutExercise;
