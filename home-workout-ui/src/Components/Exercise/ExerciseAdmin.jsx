import React, {useState, useEffect} from 'react';
import Select from 'react-select';

function ExerciseAdmin({newExercise, setNew, insertExercise, dataParts, dataExercises, handleDelete, handleUpdate}) {
  const [isValid, setIsValid] = useState(false);
  const [editEntryId, setEditEntryId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editData, setEditData] = useState({
    ExerciseName: '',
    ExerciseDescription: '',
    Difficulty: '',
    BodyPartId: null
  });

  const [stars] = useState(['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']);

  useEffect(() => {
    const valid =
      newExercise.ExerciseName.trim() !== '' &&
      newExercise.ExerciseDescription.trim() !== '' &&
      newExercise.Difficulty !== '' &&
      newExercise.BodyPartId != null;
    setIsValid(valid);
  }, [newExercise]);

  // Select - options do selectu
  const options = dataParts.map(bodyPart => ({
    value: bodyPart.id,
    label: bodyPart.bodyPartName
  }));

  // Změna dat v režimu editace
  const handleEditChange = e => {
    const {name, value} = e.target;
    setEditData(prev => ({...prev, [name]: value}));
  };

  // Uložení změn při editaci
  const handleEditSave = id => {
    handleUpdate(id, editData);
    setEditEntryId(null);
  };

  // Změna na potvrzovací režim pro smazání
  const onDeleteClick = id => setConfirmDeleteId(id);

  // Potvrzení smazání
  const exerciseDeleteConfirm = id => {
    handleDelete(id);
    setConfirmDeleteId(null);
  };

  // Přepnutí do režimu editace
  const editEntryIdconfirm = item => {
    setEditEntryId(item.id);
    setEditData({
      ExerciseName: item.exerciseName,
      ExerciseDescription: item.exerciseDescription,
      Difficulty: item.difficulty,
      BodyPartId: item.bodyPartId
    });
  };

  // Změna v inputu při přidávání nového cviku
  const handleNewChange = e => {
    const {name, value} = e.target;
    const updated = {...newExercise, [name]: value};
    setNew(updated);
  };

  // Změna ve selectu při přidávání nového cviku
  const handleNewSelect = selectedOption => {
    const updated = {
      ...newExercise,
      BodyPartId: selectedOption ? selectedOption.value : null
    };
    setNew(updated);
  };

  // Odeslání nového cviku
  const handleNewSubmit = e => {
    e.preventDefault();
    insertExercise();
    setNew({
      ExerciseName: '',
      ExerciseDescription: '',
      Difficulty: '',
      BodyPartId: null
    });
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">🏋 Tabulka cviků</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>Partie</th>
              <th>Název cviku</th>
              <th>Popis cviku</th>
              <th>Obtížnost</th>
              <th style={{width: '110px'}}>Editovat</th>
              <th style={{width: '110px'}}>Smazat</th>
            </tr>
          </thead>
          <tbody>
            {/* Formulář přidání nového cviku jako první řádek tabulky */}
            <tr>
              <td className="bg-secondary-subtle">
                <Select
                  options={options}
                  isSearchable
                  value={options.find(opt => opt.value === newExercise.BodyPartId) || null}
                  onChange={handleNewSelect}
                  classNamePrefix="react-select"
                />
              </td>
              <td className="bg-secondary-subtle">
                <input
                  type="text"
                  name="ExerciseName"
                  value={newExercise.ExerciseName}
                  onChange={handleNewChange}
                  className="form-control form-control-sm rounded-3"
                  placeholder="Např. Kliky"
                />
              </td>
              <td className="bg-secondary-subtle">
                <input
                  type="text"
                  name="ExerciseDescription"
                  value={newExercise.ExerciseDescription}
                  onChange={handleNewChange}
                  className="form-control form-control-sm rounded-3"
                  placeholder="Např. Prsní svaly, tricepsy"
                />
              </td>
              <td className="text-center bg-secondary-subtle">
                <select
                  name="Difficulty"
                  value={newExercise.Difficulty}
                  onChange={handleNewChange}
                  className="form-select form-select-sm rounded-3 text-center"
                >
                  <option value="">Zvolte</option>
                  <option value="1">⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
              </td>
              <td colSpan="2" className="text-center bg-secondary-subtle">
                <button className="btn btn-outline-success btn-sm" onClick={handleNewSubmit} disabled={!isValid}>
                  Přidat
                </button>
              </td>
            </tr>

            {/* Pokud nejsou cviky */}
            {dataExercises.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  Žádné cviky k zobrazení
                </td>
              </tr>
            )}

            {/* Seznam existujících cviků */}
            {dataExercises.map(item => (
              <tr key={item.id}>
                <td className="align-middle">
                  {editEntryId === item.id ? (
                    <Select
                      options={options}
                      isSearchable
                      value={options.find(opt => opt.value === editData.BodyPartId) || null}
                      onChange={selectedOption =>
                        setEditData(prev => ({
                          ...prev,
                          BodyPartId: selectedOption ? selectedOption.value : null
                        }))
                      }
                      classNamePrefix="react-select"
                      autoFocus
                    />
                  ) : (
                    dataParts.find(bp => bp.id === item.bodyPartId)?.bodyPartName || 'Neznámá partie'
                  )}
                </td>
                <td className="align-middle ">
                  {editEntryId === item.id ? (
                    <input
                      type="text"
                      name="ExerciseName"
                      value={editData.ExerciseName}
                      onChange={handleEditChange}
                      className="form-control form-control-sm rounded-3"
                    />
                  ) : (
                    item.exerciseName
                  )}
                </td>
                <td className="align-middle">
                  {editEntryId === item.id ? (
                    <input
                      type="text"
                      name="ExerciseDescription"
                      value={editData.ExerciseDescription}
                      onChange={handleEditChange}
                      className="form-control form-control-sm rounded-3"
                    />
                  ) : (
                    item.exerciseDescription
                  )}
                </td>
                <td className="align-middle text-center">
                  {editEntryId === item.id ? (
                    <select
                      name="Difficulty"
                      value={editData.Difficulty}
                      onChange={handleEditChange}
                      className="form-select form-select-sm rounded-3 text-center"
                    >
                      <option value="1">⭐</option>
                      <option value="2">⭐⭐</option>
                      <option value="3">⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐</option>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                    </select>
                  ) : (
                    <span>{stars[item.difficulty - 1]}</span>
                  )}
                </td>
                <td className="align-middle text-center">
                  {editEntryId === item.id ? (
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-outline-success btn-sm" onClick={() => handleEditSave(item.id)} title="Uložit změny">
                        ✅
                      </button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditEntryId(null)} title="Zrušit editaci">
                        ❌
                      </button>
                    </div>
                  ) : ['Shyby na hrazdě'].includes(item.exerciseName) ? (
                    <button className="btn btn-outline-secondary btn-sm" disabled>
                      <i className="bi bi-lock-fill"></i> 🔒
                    </button>
                  ) : (
                    <button onClick={() => editEntryIdconfirm(item)} className="btn btn-outline-secondary btn-sm">
                      Edituj
                    </button>
                  )}
                </td>
                <td className="align-middle text-center">
                  {confirmDeleteId === item.id ? (
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => exerciseDeleteConfirm(item.id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Potvrdit smazání"
                      >
                        🗑️
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="btn btn-outline-secondary btn-sm" title="Zrušit smazání">
                        ❌
                      </button>
                    </div>
                  ) : ['Shyby na hrazdě'].includes(item.exerciseName) ? (
                    <button className="btn btn-outline-danger btn-sm" disabled>
                      <i className="bi bi-lock-fill"></i> 🔒
                    </button>
                  ) : (
                    <button onClick={() => onDeleteClick(item.id)} className="btn btn-outline-danger btn-sm">
                      Smaž
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExerciseAdmin;
