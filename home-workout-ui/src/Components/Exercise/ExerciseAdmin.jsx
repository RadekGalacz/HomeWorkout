/**
 * ExerciseAdmin – CRUD tabulka cviků s obtížností (slider) a vazbou na partii.
 * Zamčené cviky (LOCKED_EXERCISES) nelze editovat ani mazat.
 */
import { useState, useMemo } from 'react';
import Select from 'react-select';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { STARS, LOCKED_EXERCISES } from '../../constants';

function ExerciseAdmin({ dataParts, dataExercises, onAdd, onUpdate, onDelete }) {
  const [newExercise, setNewExercise] = useState({ ExerciseName: '', ExerciseDescription: '', Difficulty: 1, BodyPartId: null });
  const [editEntryId, setEditEntryId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editData, setEditData] = useState({ ExerciseName: '', ExerciseDescription: '', Difficulty: '', BodyPartId: null });

  const isValid = useMemo(() => newExercise.ExerciseName.trim() !== '' && newExercise.ExerciseDescription.trim() !== '' && newExercise.Difficulty !== '' && newExercise.BodyPartId != null, [newExercise]);
  const options = dataParts.map((bp) => ({ value: bp.id, label: bp.bodyPartName }));
  const isLocked = (name) => LOCKED_EXERCISES.includes(name);

  const handleNewChange = (e) => { const { name, value } = e.target; setNewExercise((prev) => ({ ...prev, [name]: value })); };
  const handleNewSelect = (opt) => setNewExercise((prev) => ({ ...prev, BodyPartId: opt ? opt.value : null }));
  const handleNewSubmit = (e) => { e?.preventDefault(); onAdd(newExercise); setNewExercise({ ExerciseName: '', ExerciseDescription: '', Difficulty: 1, BodyPartId: null }); };
  const handleEditChange = (e) => { const { name, value } = e.target; setEditData((prev) => ({ ...prev, [name]: value })); };
  const startEditing = (item) => { setEditEntryId(item.id); setEditData({ ExerciseName: item.exerciseName, ExerciseDescription: item.exerciseDescription, Difficulty: item.difficulty, BodyPartId: item.bodyPartId }); };
  const handleEditSave = (id) => { onUpdate(id, editData); setEditEntryId(null); };
  const confirmDelete = (id) => { onDelete(id); setConfirmDeleteId(null); };

  const DifficultySlider = ({ value, onChange }) => (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Slider value={Number(value) || 1} onChange={(e, val) => onChange(val)} step={1} min={1} max={5} marks size="small" sx={{ width: 100, color: 'var(--hw-primary)' }} />
      <span style={{ fontSize: '0.9rem' }}>{STARS[(Number(value) || 1) - 1]}</span>
    </Box>
  );

  return (
    <div className="hw-card mb-4">
      <div className="hw-card-header">
        <h5 className="mb-0 fw-bold">🏋 Cviky</h5>
      </div>
      <div className="p-0">
        <div className="table-responsive">
          <table className="table hw-table mb-0">
            <thead>
              <tr>
                <th className="ps-3">Partie</th>
                <th>Název</th>
                <th>Popis</th>
                <th className="text-center" style={{ width: '130px' }}>Obtížnost</th>
                <th className="text-center" style={{ width: '90px' }}>Edit</th>
                <th className="text-center" style={{ width: '90px' }}>Smazat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hw-add-row">
                <td className="ps-3"><Select options={options} isSearchable value={options.find((o) => o.value === newExercise.BodyPartId) || null} onChange={handleNewSelect} classNamePrefix="react-select" placeholder="Partie..." /></td>
                <td><input type="text" name="ExerciseName" value={newExercise.ExerciseName} onChange={handleNewChange} className="form-control form-control-sm" placeholder="Název" /></td>
                <td><input type="text" name="ExerciseDescription" value={newExercise.ExerciseDescription} onChange={handleNewChange} className="form-control form-control-sm" placeholder="Popis" /></td>
                <td className="text-center"><DifficultySlider value={newExercise.Difficulty} onChange={(val) => setNewExercise((prev) => ({ ...prev, Difficulty: val }))} /></td>
                <td colSpan="2" className="text-center"><button className="hw-btn hw-btn-success" onClick={handleNewSubmit} disabled={!isValid}>+ Přidat</button></td>
              </tr>

              {dataExercises.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">Žádné cviky</td></tr>
              )}

              {dataExercises.map((item) => (
                <tr key={item.id}>
                  <td className="ps-3">
                    {editEntryId === item.id ? (
                      <Select options={options} isSearchable value={options.find((o) => o.value === editData.BodyPartId) || null} onChange={(opt) => setEditData((prev) => ({ ...prev, BodyPartId: opt ? opt.value : null }))} classNamePrefix="react-select" autoFocus />
                    ) : dataParts.find((bp) => bp.id === item.bodyPartId)?.bodyPartName || '—'}
                  </td>
                  <td>{editEntryId === item.id ? <input type="text" name="ExerciseName" value={editData.ExerciseName} onChange={handleEditChange} className="form-control form-control-sm" /> : item.exerciseName}</td>
                  <td>{editEntryId === item.id ? <input type="text" name="ExerciseDescription" value={editData.ExerciseDescription} onChange={handleEditChange} className="form-control form-control-sm" /> : <span className="text-muted">{item.exerciseDescription}</span>}</td>
                  <td className="text-center">
                    {editEntryId === item.id ? (
                      <DifficultySlider value={editData.Difficulty} onChange={(val) => setEditData((prev) => ({ ...prev, Difficulty: val }))} />
                    ) : <span>{STARS[item.difficulty - 1]}</span>}
                  </td>
                  <td className="text-center">
                    {editEntryId === item.id ? (
                      <div className="hw-action-group">
                        <button className="hw-btn hw-btn-success" onClick={() => handleEditSave(item.id)} title="Uložit změny">✅</button>
                        <button className="hw-btn" onClick={() => setEditEntryId(null)} title="Zrušit editaci">✕</button>
                      </div>
                    ) : isLocked(item.exerciseName) ? (
                      <span className="hw-locked" title="Chráněný cvik – nelze editovat">🔒</span>
                    ) : (
                      <button className="hw-btn hw-btn-ghost" onClick={() => startEditing(item)} title="Editovat cvik">✏️</button>
                    )}
                  </td>
                  <td className="text-center">
                    {confirmDeleteId === item.id ? (
                      <div className="hw-action-group">
                        <button className="hw-btn hw-btn-danger" onClick={() => confirmDelete(item.id)} title="Potvrdit smazání">🗑️</button>
                        <button className="hw-btn" onClick={() => setConfirmDeleteId(null)} title="Zrušit smazání">✕</button>
                      </div>
                    ) : isLocked(item.exerciseName) ? (
                      <span className="hw-locked" title="Chráněný cvik – nelze smazat">🔒</span>
                    ) : (
                      <button className="hw-btn hw-btn-ghost" onClick={() => setConfirmDeleteId(item.id)} title="Smazat cvik">🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExerciseAdmin;
