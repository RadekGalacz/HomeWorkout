/**
 * BodyPartAdmin – CRUD tabulka svalových partií.
 * Zamčené položky (LOCKED_BODY_PARTS) nelze editovat ani mazat.
 */
import { useState, useMemo } from 'react';
import { LOCKED_BODY_PARTS } from '../../constants';

function BodyPartAdmin({ dataParts, onAdd, onUpdate, onDelete }) {
  const [newName, setNewName] = useState('');
  const [editEntryId, setEditEntryId] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const isValid = useMemo(() => newName.trim() !== '', [newName]);
  const isLocked = (name) => LOCKED_BODY_PARTS.includes(name);

  const handleSubmit = (e) => { e?.preventDefault(); if (!isValid) return; onAdd({ BodyPartName: newName }); setNewName(''); };
  const enterEdit = (item) => { setEditEntryId(item.id); setEditName(item.bodyPartName); };
  const saveEdit = (id) => { if (editName.trim() === '') return; onUpdate(id, { BodyPartName: editName }); setEditEntryId(null); };

  return (
    <div className="hw-card mb-4">
      <div className="hw-card-header">
        <h5 className="mb-0 fw-bold">🦵 Svalové partie</h5>
      </div>
      <div className="p-0">
        <div className="table-responsive">
          <table className="table hw-table mb-0">
            <thead>
              <tr>
                <th className="ps-3">Název</th>
                <th style={{ width: '100px' }} className="text-center">Editovat</th>
                <th style={{ width: '100px' }} className="text-center">Smazat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hw-add-row">
                <td className="ps-3">
                  <form onSubmit={handleSubmit}>
                    <input type="text" className="form-control form-control-sm" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Např. Ramena" required />
                  </form>
                </td>
                <td colSpan={2} className="text-center">
                  <button className="hw-btn hw-btn-success" onClick={handleSubmit} disabled={!isValid}>+ Přidat</button>
                </td>
              </tr>

              {dataParts.length === 0 && (
                <tr><td colSpan={3} className="text-center text-muted py-4">Žádné partie k zobrazení</td></tr>
              )}

              {dataParts.map((item) => (
                <tr key={item.id}>
                  <td className="ps-3">
                    {editEntryId === item.id ? (
                      <input type="text" className="form-control form-control-sm" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                    ) : item.bodyPartName}
                  </td>
                  <td className="text-center">
                    {editEntryId === item.id ? (
                      <div className="hw-action-group">
                        <button className="hw-btn hw-btn-success" onClick={() => saveEdit(item.id)} title="Uložit změny">✅</button>
                        <button className="hw-btn" onClick={() => setEditEntryId(null)} title="Zrušit editaci">✕</button>
                      </div>
                    ) : isLocked(item.bodyPartName) ? (
                      <span className="hw-locked" title="Chráněná položka – nelze editovat">🔒</span>
                    ) : (
                      <button className="hw-btn hw-btn-ghost" onClick={() => enterEdit(item)} title="Editovat položku">✏️</button>
                    )}
                  </td>
                  <td className="text-center">
                    {confirmDeleteId === item.id ? (
                      <div className="hw-action-group">
                        <button className="hw-btn hw-btn-danger" onClick={() => { onDelete(item.id); setConfirmDeleteId(null); }} title="Potvrdit smazání">🗑️</button>
                        <button className="hw-btn" onClick={() => setConfirmDeleteId(null)} title="Zrušit smazání">✕</button>
                      </div>
                    ) : isLocked(item.bodyPartName) ? (
                      <span className="hw-locked" title="Chráněná položka – nelze smazat">🔒</span>
                    ) : (
                      <button className="hw-btn hw-btn-ghost" onClick={() => setConfirmDeleteId(item.id)} title="Smazat položku">🗑️</button>
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

export default BodyPartAdmin;
