import React, {useState} from 'react';
import WorkoutExercise from './WorkoutExercise';
import {format} from 'date-fns';
import {cs} from 'date-fns/locale';
import WorkoutPlanForm from './WorkoutPlanForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

function WorkoutPlan({
  exercises,
  workoutPlans,
  insertWorkoutPlan,
  newWorkoutPlan,
  setNewWorkoutPlan,
  handleUpdateWorkoutPlan,
  handleDeleteWorkoutPlan,
  setNewWorkoutExercises,
  newWorkoutExercises,
  workoutExercises,
  insertWorkoutExercises,
  handleDeleteWorkoutExercises,
  bodyParts,
  handleUpdateWorkoutExercises
}) {
  const [activeWorkoutPlanId, setActiveWorkoutPlanId] = useState(null); // ID aktivního plánu pro přidávání cviku
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ID pro potvrzení smazání
  const [editEntryId, setEditEntryId] = useState(null); // ID plánu v režimu editace
  const [selectedDateEdit, setSelectedDateEdit] = useState(null); // vybraný datum pro editaci
  const [selectedBodyPartIds, setSelectedBodyPartIds] = useState({}); // vybraná partie pro filtrování cviků
  const [editData, setEditData] = useState({
    Name: '',
    Description: '',
    Date: ''
  });
  const [stars] = useState(['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']); // úroveň obtížnosti
  const [checkedExercises, setCheckedExercises] = useState({}); // id označeného cviku

  // Spustit režim editace pro konkrétní plán
  const startEditing = plan => {
    const date = plan.date ? new Date(plan.date) : null;
    setEditEntryId(plan.id);
    setEditData({
      Name: plan.name || '',
      Description: plan.description || '',
      Date: date
    });
    setSelectedDateEdit(date);
  };

  // Možnosti pro výběr true/false cviků
  const [checkedFilter, setCheckedFilter] = useState(null);

  const checkedOptions = [
    {value: null, label: '🌀 Všechny cviky'},
    {value: true, label: '✅ Odcvičené'},
    {value: false, label: '❌ Ještě neodcvičené'}
  ];

  // Změna textových polí v editaci
  const handleEditChange = e => {
    const {name, value} = e.target;
    setEditData(prev => ({...prev, [name]: value}));
  };

  // Změna data v editaci
  const handleDateChange = date => {
    if (!date) return;
    const fixedDate = new Date(date);
    fixedDate.setHours(12, 0, 0, 0);
    setSelectedDateEdit(fixedDate);
    setEditData(prev => ({...prev, Date: fixedDate}));
  };

  // Uložit změny plánu
  const handleEditSave = id => {
    if (editData.Name.trim() === '' || editData.Description.trim() === '') {
      alert('Název i popis musí být vyplněný.');
      return;
    }

    const fixedDate = new Date(editData.Date);
    fixedDate.setHours(12, 0, 0, 0);

    const formattedData = {
      ...editData,
      Date: fixedDate.toISOString().split('T')[0]
    };

    handleUpdateWorkoutPlan(id, formattedData);
    setEditEntryId(null);
    setSelectedDateEdit(null);
  };

  // Filtr cviků na kartě plánu podle BodyParts
  const handleBodyPartFilter = (planId, bodyPartId) => {
    setSelectedBodyPartIds(prev => ({
      ...prev,
      [planId]: prev[planId] === bodyPartId ? null : bodyPartId
    }));
  };
  
  // Uložit check cviku v plánu
  const handleCheckSave = exerciseItem => {
    {
      /* Označit odcvičený cvik v plánu */
    }
    const newChecked = !exerciseItem.checked;

    setCheckedExercises(prev => ({
      ...prev,
      [exerciseItem.id]: newChecked
    }));

    handleUpdateWorkoutExercises(exerciseItem.id, {sets: exerciseItem.sets, reps: exerciseItem.reps, checked: newChecked});
  };

  // Potvrzení smazání plánu
  const workoutPlanDeleteConfirm = id => {
    handleDeleteWorkoutPlan(id);
    setConfirmDeleteId(null);
  };

  // Potvrzení smazání cviku z plánu
  const exerciseDeleteConfirm = id => {
    handleDeleteWorkoutExercises(id);
    setConfirmDeleteId(null);
  };

  const onDeleteClick = id => setConfirmDeleteId(id);

  // Výpočet průměrné obtížnosti pro každý plán
  const averageDifficulty = {};
  workoutPlans.forEach(plan => {
    let sum = 0;
    let count = 0;
    workoutExercises
      .filter(ex => ex.workoutPlanId === plan.id)
      .forEach(exerciseItem => {
        const matchingExercise = exercises.find(ex => ex.id === exerciseItem.exerciseId);
        if (matchingExercise) {
          sum += parseInt(matchingExercise.difficulty) || 0;
          count += 1;
        }
      });
    averageDifficulty[plan.id] = count > 0 ? Math.ceil(sum / count) : 0;
  });

  return (
    <div className="container my-4">
      <h3 className="mb-3">
        Karty plánů tréninků - <span className="text-muted small">vytvořte si svůj plán</span>
      </h3>

      {/* Formulář pro vytvoření nového plánu */}
      <WorkoutPlanForm newWorkoutPlan={newWorkoutPlan} setNewWorkoutPlan={setNewWorkoutPlan} insertWorkoutPlan={insertWorkoutPlan} />

      <div className="row align-items-start g-3">
        <div className="col-12 d-flex align-items-center gap-2 mb-2 flex-nowrap">
          <span className="border border-primary rounded px-3 py-2 bg-white flex-shrink-0">Filtr cviků:</span>

          {/* Výběr partie pro filtrování */}
          <div className="flex-grow-1">
            <Select
              options={checkedOptions}
              value={checkedOptions.find(opt => opt.value === checkedFilter) || null}
              onChange={opt => setCheckedFilter(opt?.value ?? null)}
              classNamePrefix="react-select"
              isClearable
              placeholder="Filtrovat podle stavu..."
            />
          </div>
        </div>
      </div>

      {/* Karty všech tréninkových plánů */}
      <div className="row row-cols-1 row-cols-lg-3 g-3">
        {workoutPlans.map(plan => (
          <div className="col" key={plan.id}>
            <div className="card shadow-sm rounded-3 d-flex flex-column">
              <div className={`card-body p-3 d-flex flex-column ${plan.id === activeWorkoutPlanId ? '' : 'overflow-hidden'}`}>
                <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1">
                  {/* Režim editace plánu */}
                  {editEntryId === plan.id ? (
                    <div className="flex-grow-1">
                      <input
                        type="text"
                        name="Name"
                        value={editData.Name}
                        onChange={handleEditChange}
                        className="form-control form-control-sm mb-2"
                        autoFocus
                        placeholder="Název plánu"
                      />
                      <input
                        type="text"
                        name="Description"
                        value={editData.Description}
                        onChange={handleEditChange}
                        className="form-control form-control-sm mb-2"
                        placeholder="Popis plánu"
                      />
                      <DatePicker
                        selected={selectedDateEdit}
                        onChange={handleDateChange}
                        locale={cs}
                        dateFormat="P"
                        placeholderText="Vyberte datum"
                        className="form-control form-control-sm rounded-2 mb-2"
                      />
                    </div>
                  ) : (
                    <div className="flex-grow-1">
                      {/* Zobrazení názvu, data, popisu a obtížnosti */}
                      <div className="bg-light rounded p-1">
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex align-items-center">
                            <span>🔥</span>
                            <h6 className="fw-bold mb-0 text-dark fs-6">{plan.name || 'Žádný nadpis'}</h6>
                          </div>
                          <span className="text-muted small">
                            {plan.date
                              ? format(new Date(plan.date), 'd. M. yyyy', {
                                  locale: cs
                                })
                              : ''}
                          </span>
                        </div>
                        <p className="text-secondary small fst-italic mb-0">📝 {plan.description || 'Žádný popisek'}</p>
                        <div className="text-secondary small mb-0">
                          💪 Celková obtížnost: {stars[averageDifficulty[plan.id] - 1] || 'nejprve přidejte cvik'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tlačítka pro editaci/uložení/zrušení */}
                  <div className="ms-3 d-flex flex-column gap-1">
                    {editEntryId === plan.id ? (
                      <>
                        <button className="btn btn-outline-success btn-sm" onClick={() => handleEditSave(plan.id)} title="Uložit změny">
                          ✅
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditEntryId(null)} title="Zrušit editaci">
                          ❌
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => startEditing(plan)} title="Edituj plán">
                        ✏️
                      </button>
                    )}
                  </div>
                </div>

                {/* Seznam cviků v plánu */}
                <ul className="list-unstyled mb-2 flex-grow-1">
                  {workoutExercises
                    .filter(ex => ex.workoutPlanId === plan.id)
                    .filter(ex => {
                      // pokud je checkedFilter null  zobrazit všechny
                      if (checkedFilter === null) return true;
                      // jen odpovídající odpovídají true/false
                      return ex.checked === checkedFilter;
                    })
                    .map((exerciseItem, index, allItems) => {
                      const matchingExercise = exercises.find(ex => ex.id === exerciseItem.exerciseId);
                      const exerciseName = matchingExercise ? matchingExercise.exerciseName : 'Neznámý cvik';
                      const exerciseDescription = matchingExercise ? matchingExercise.exerciseDescription : 'Žádný popisek';
                      const bodyPart = bodyParts.find(bp => bp.id === matchingExercise?.bodyPartId);

                      // Filtrování podle vybrané partie
                      if (selectedBodyPartIds[plan.id] && matchingExercise?.bodyPartId !== selectedBodyPartIds[plan.id]) {
                        return null;
                      }

                      return (
                        <div key={exerciseItem.id}>
                          <li className="d-flex justify-content-between align-items-start small mb-1">
                            <div className="me-2">
                              <div className="d-flex align-items-center mb-1">
                                {/* Označit odcvičený cvik v plánu */}
                                <button
                                  onClick={() => {
                                    handleCheckSave(exerciseItem);
                                  }}
                                  className={`btn btn-sm me-2 ${
                                    exerciseItem.checked ? 'btn-outline-success bg-success-subtle' : 'btn-outline-secondary'
                                  }`}
                                >
                                  {exerciseItem.checked ? <span>🎉</span> : <span>✔️</span>}
                                </button>

                                {exerciseItem.checked ? (
                                  <strong className="text-decoration-line-through">{exerciseName}</strong>
                                ) : (
                                  <strong>{exerciseName}</strong>
                                )}
                              </div>
                              <div className="text-muted mb-2">• {exerciseDescription}</div>
                              <div>
                                {/*Button filtruje cviky na kartách plánů podle svalové partie*/}
                                <button
                                  className={`rounded-pill badge  me-1 border-0 ${
                                    selectedBodyPartIds[plan.id] && matchingExercise?.bodyPartId ? 'bg-warning text-dark' : 'bg-secondary'
                                  }`}
                                  onClick={() => handleBodyPartFilter(plan.id, matchingExercise?.bodyPartId)}
                                >
                                  {bodyPart?.bodyPartName || 'Partie nenalezena'}
                                </button>
                              </div>
                            </div>

                            {/* Zobrazení sérií a opakování + mazání */}
                            <div className="text-muted ms-auto text-end" style={{minWidth: '70px'}}>
                              <div className="mb-2 mt-1">
                                <span role="img" aria-label="series" className="me-1">
                                  🎯
                                </span>{' '}
                                <strong>{exerciseItem.sets}x</strong> série
                              </div>
                              <div className="mb-2">
                                <span role="img" aria-label="repetitions" className="me-1">
                                  🔁
                                </span>{' '}
                                <strong>{exerciseItem.reps}</strong> opak.
                              </div>

                              {/* Potvrzení nebo zrušení smazání cviku */}
                              {confirmDeleteId === exerciseItem.id ? (
                                <div className="d-flex justify-content-center gap-2">
                                  <button
                                    onClick={() => exerciseDeleteConfirm(exerciseItem.id)}
                                    className="btn btn-outline-danger btn-sm"
                                    title="Potvrdit smazání"
                                  >
                                    🗑️
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="btn btn-outline-secondary btn-sm"
                                    title="Zrušit smazání"
                                  >
                                    ❌
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => onDeleteClick(exerciseItem.id)}
                                  className="btn btn-outline-danger btn-sm"
                                  title="Smaž záznam"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </li>

                          {/* Oddělovací čára mezi cviky */}
                          {index < allItems.length - 1 && (
                            <li>
                              <hr className="my-2" />
                            </li>
                          )}
                        </div>
                      );
                    })}

                  <hr
                    className="mb-0"
                    style={{
                      marginLeft: '-1rem',
                      marginRight: '-1rem',
                      border: 'none',
                      height: '3px',
                      backgroundColor: '#198754'
                    }}
                  />
                </ul>

                {/* Formulář pro přidání nového cviku */}
                {plan.id === activeWorkoutPlanId && (
                  <WorkoutExercise
                    exercises={exercises}
                    newWorkoutExercises={newWorkoutExercises}
                    setNewWorkoutExercises={setNewWorkoutExercises}
                    insertWorkoutExercises={insertWorkoutExercises}
                    setActiveWorkoutPlanId={setActiveWorkoutPlanId}
                  />
                )}
              </div>

              {/* Zápatí karty - tlačítka pro přidání cviku nebo smazání plánu */}
              <div className="card-footer bg-transparent border-0 p-2">
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm flex-grow-1 ${plan.id === activeWorkoutPlanId ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => {
                      setActiveWorkoutPlanId(plan.id === activeWorkoutPlanId ? null : plan.id);
                      setNewWorkoutExercises(prev => ({
                        ...prev,
                        workoutPlanId: plan.id
                      }));
                    }}
                  >
                    {plan.id === activeWorkoutPlanId ? '- Zavřít formulář' : '+ Přidat cvik'}
                  </button>

                  {/* Smazání celého plánu */}
                  {confirmDeleteId === plan.id ? (
                    <>
                      <button
                        onClick={() => workoutPlanDeleteConfirm(plan.id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Potvrdit smazání"
                      >
                        🗑️
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="btn btn-outline-secondary btn-sm" title="Zrušit smazání">
                        ❌
                      </button>
                    </>
                  ) : (
                    <button onClick={() => onDeleteClick(plan.id)} className="btn btn-outline-danger btn-sm">
                      Smaž plán
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutPlan;
