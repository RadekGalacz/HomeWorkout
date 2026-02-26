/**
 * WorkoutPlan – Hlavní přehled tréninkových plánů (karty).
 * Zobrazuje cviky, obtížnost, filtrování dle stavu a svalové partie.
 */
import { useState } from 'react';
import WorkoutExercise from './WorkoutExercise';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import WorkoutPlanForm from './WorkoutPlanForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { STARS } from '../../constants';

function WorkoutPlan({
  exercises, workoutPlans, workoutExercises, bodyParts,
  onPlanCreate, onPlanUpdate, onPlanDelete,
  onExerciseCreate, onExerciseUpdate, onExerciseDelete,
}) {
  const [activeWorkoutPlanId, setActiveWorkoutPlanId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editEntryId, setEditEntryId] = useState(null);
  const [selectedDateEdit, setSelectedDateEdit] = useState(null);
  const [selectedBodyPartIds, setSelectedBodyPartIds] = useState({});
  const [editData, setEditData] = useState({ Name: '', Description: '', Date: '' });
  const [checkedFilter, setCheckedFilter] = useState(null);

  const checkedOptions = [
    { value: null, label: '🌀 Všechny' },
    { value: true, label: '✅ Hotové' },
    { value: false, label: '⏳ Zbývající' },
  ];

  const startEditing = (plan) => {
    const date = plan.date ? new Date(plan.date) : null;
    setEditEntryId(plan.id);
    setEditData({ Name: plan.name || '', Description: plan.description || '', Date: date });
    setSelectedDateEdit(date);
  };

  const handleEditChange = (e) => { const { name, value } = e.target; setEditData((prev) => ({ ...prev, [name]: value })); };

  const handleDateChange = (date) => {
    if (!date) return;
    const d = new Date(date); d.setHours(12, 0, 0, 0);
    setSelectedDateEdit(d);
    setEditData((prev) => ({ ...prev, Date: d }));
  };

  const handleEditSave = (id) => {
    if (editData.Name.trim() === '' || editData.Description.trim() === '') { alert('Název i popis musí být vyplněný.'); return; }
    const d = new Date(editData.Date); d.setHours(12, 0, 0, 0);
    onPlanUpdate(id, { ...editData, Date: d.toISOString().split('T')[0] });
    setEditEntryId(null); setSelectedDateEdit(null);
  };

  const handleBodyPartFilter = (planId, bpId) => {
    setSelectedBodyPartIds((prev) => ({ ...prev, [planId]: prev[planId] === bpId ? null : bpId }));
  };

  const handleCheckSave = (item) => {
    const checked = !item.checked;
    onExerciseUpdate(item.id, { sets: item.sets, reps: item.reps, checked });
  };

  // Průměrná obtížnost
  const avgDifficulty = {};
  workoutPlans.forEach((plan) => {
    let sum = 0, count = 0;
    workoutExercises.filter((e) => e.workoutPlanId === plan.id).forEach((ei) => {
      const m = exercises.find((e) => e.id === ei.exerciseId);
      if (m) { sum += parseInt(m.difficulty) || 0; count++; }
    });
    avgDifficulty[plan.id] = count > 0 ? Math.ceil(sum / count) : 0;
  });

  return (
    <div>
      {/* Header + tlačítko */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h5 className="fw-bold mb-0">📋 Tréninkové plány</h5>
        <WorkoutPlanForm onSubmit={onPlanCreate} />
      </div>

      {/* Filtr */}
      <div className="hw-card mb-3" style={{ padding: '0.5rem 0.75rem' }}>
        <div className="d-flex align-items-center gap-2">
          <span className="small fw-semibold text-nowrap">Filtr:</span>
          <div style={{ minWidth: '180px' }}>
            <Select
              options={checkedOptions}
              value={checkedOptions.find((o) => o.value === checkedFilter) || checkedOptions[0]}
              onChange={(o) => setCheckedFilter(o?.value ?? null)}
              classNamePrefix="react-select"
              isClearable
              placeholder="Stav..."
            />
          </div>
        </div>
      </div>

      {/* Karty plánů */}
      {workoutPlans.length === 0 ? (
        <div className="hw-card p-5 text-center">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏋️</div>
          <h6 className="fw-bold mb-1">Zatím nemáte žádné plány</h6>
          <p className="text-muted small mb-0">Vytvořte svůj první tréninkový plán kliknutím na "+ Nový plán"</p>
        </div>
      ) : (
      <div className="row row-cols-1 row-cols-lg-3 g-3">
        {workoutPlans.map((plan) => {
          const planExs = workoutExercises
            .filter((e) => e.workoutPlanId === plan.id)
            .filter((e) => checkedFilter === null || e.checked === checkedFilter);

          return (
            <div className="col" key={plan.id}>
              <div className="hw-card d-flex flex-column" style={{ padding: 0 }}>
                {/* Plan header */}
                <div className="hw-plan-header">
                  <div className="d-flex justify-content-between align-items-start">
                    {editEntryId === plan.id ? (
                      <div className="flex-grow-1 me-2">
                        <input type="text" name="Name" value={editData.Name} onChange={handleEditChange} className="form-control form-control-sm mb-2" autoFocus placeholder="Název" />
                        <input type="text" name="Description" value={editData.Description} onChange={handleEditChange} className="form-control form-control-sm mb-2" placeholder="Popis" />
                        <DatePicker selected={selectedDateEdit} onChange={handleDateChange} locale={cs} dateFormat="P" placeholderText="Datum" className="form-control form-control-sm" />
                      </div>
                    ) : (
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1 flex-nowrap">
                          <h6 className="fw-bold mb-0">{plan.name || 'Bez názvu'}</h6>
                          {plan.date && <span className="hw-badge" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{format(new Date(plan.date), 'd. M. yyyy', { locale: cs })}</span>}
                        </div>
                        <p className="text-muted small mb-1">{plan.description || 'Žádný popis'}</p>
                        <span className="small">💪 {STARS[avgDifficulty[plan.id] - 1] || '—'}</span>
                      </div>
                    )}
                    <div className="ms-2">
                      {editEntryId === plan.id ? (
                        <div className="hw-action-group" style={{ flexDirection: 'column' }}>
                          <button className="hw-btn hw-btn-success" onClick={() => handleEditSave(plan.id)} title="Uložit změny">✅</button>
                          <button className="hw-btn" onClick={() => setEditEntryId(null)} title="Zrušit editaci">✕</button>
                        </div>
                      ) : (
                        <button className="hw-btn hw-btn-ghost" onClick={() => startEditing(plan)} title="Editovat plán">✏️</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-3 d-flex flex-column flex-grow-1">
                  {/* Cviky */}
                  <div className="flex-grow-1">
                    {planExs.map((item, i, all) => {
                      const match = exercises.find((e) => e.id === item.exerciseId);
                      const bp = bodyParts.find((b) => b.id === match?.bodyPartId);
                      if (selectedBodyPartIds[plan.id] && match?.bodyPartId !== selectedBodyPartIds[plan.id]) return null;

                      return (
                        <div key={item.id}>
                          <div className="d-flex justify-content-between align-items-start py-2">
                            <div className="me-2">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <button
                                  onClick={() => handleCheckSave(item)}
                                  className={`hw-btn ${item.checked ? 'hw-btn-success' : ''}`}
                                  title={item.checked ? 'Označit jako neodcvičené' : 'Označit jako odcvičené'}
                                  style={{ width: '24px', height: '24px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0, borderRadius: '50%' }}
                                >
                                  {item.checked ? '✓' : ''}
                                </button>
                                <span className={`small fw-semibold ${item.checked ? 'text-decoration-line-through text-muted' : ''}`}>
                                  {match?.exerciseName || 'Neznámý cvik'}
                                </span>
                              </div>
                              {match?.exerciseDescription && <div className="text-muted small ps-4">{match.exerciseDescription}</div>}
                              <button
                                className={`hw-badge mt-1 border-0 ${selectedBodyPartIds[plan.id] === match?.bodyPartId ? 'hw-badge-active' : ''}`}
                                onClick={() => handleBodyPartFilter(plan.id, match?.bodyPartId)}
                                style={{ fontSize: '0.7rem', cursor: 'pointer' }}
                                title="Filtrovat podle partie"
                              >
                                {bp?.bodyPartName || '?'}
                              </button>
                            </div>
                            <div className="text-end small text-nowrap">
                              <div className="text-muted">{item.sets}× série · {item.reps} opak.</div>
                              <div className="mt-1">
                                {confirmDeleteId === item.id ? (
                                  <div className="hw-action-group">
                                    <button className="hw-btn hw-btn-danger" onClick={() => { onExerciseDelete(item.id); setConfirmDeleteId(null); }} title="Potvrdit smazání">🗑️</button>
                                    <button className="hw-btn" onClick={() => setConfirmDeleteId(null)} title="Zrušit smazání">✕</button>
                                  </div>
                                ) : (
                                  <button className="hw-btn hw-btn-ghost" onClick={() => setConfirmDeleteId(item.id)} title="Smazat cvik z plánu">🗑️</button>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Oddělovač mezi cviky */}
                          {i < all.length - 1 && <hr className="hw-exercise-divider" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Formulář přidání cviku */}
                  {plan.id === activeWorkoutPlanId && (
                    <WorkoutExercise
                      exercises={exercises}
                      workoutPlanId={plan.id}
                      onSubmit={onExerciseCreate}
                      onClose={() => setActiveWorkoutPlanId(null)}
                    />
                  )}
                </div>

                {/* ===== ODDĚLOVAČ PŘED FOOTREM ===== */}
                <hr className="hw-divider" />

                {/* Footer */}
                <div className="p-2">
                  <div className="d-flex gap-2 align-items-center" style={{ height: '36px' }}>
                    <button
                      className={`hw-btn flex-grow-1 ${plan.id === activeWorkoutPlanId ? '' : 'hw-btn-success'}`}
                      onClick={() => setActiveWorkoutPlanId(plan.id === activeWorkoutPlanId ? null : plan.id)}
                      title={plan.id === activeWorkoutPlanId ? 'Zavřít formulář' : 'Přidat cvik do plánu'}
                      style={{ height: '100%' }}
                    >
                      {plan.id === activeWorkoutPlanId ? '− Zavřít' : '+ Přidat cvik'}
                    </button>
                    {confirmDeleteId === plan.id ? (
                      <div className="hw-action-group" style={{ height: '100%' }}>
                        <button className="hw-btn hw-btn-danger" onClick={() => { onPlanDelete(plan.id); setConfirmDeleteId(null); }} title="Potvrdit smazání plánu">🗑️</button>
                        <button className="hw-btn" onClick={() => setConfirmDeleteId(null)} title="Zrušit smazání">✕</button>
                      </div>
                    ) : (
                      <button className="hw-btn hw-btn-danger" onClick={() => setConfirmDeleteId(plan.id)} title="Smazat celý plán" style={{ height: '100%' }}>🗑️</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

export default WorkoutPlan;
