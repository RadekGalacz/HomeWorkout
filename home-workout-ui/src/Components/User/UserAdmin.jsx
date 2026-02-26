/**
 * UserAdmin – CRUD tabulka uživatelů (jméno, email, heslo).
 * Zamčení uživatelé (LOCKED_USERS) jsou chráněni proti úpravám.
 */
import { useState, useEffect, useMemo } from 'react';
import { LOCKED_USERS } from '../../constants';

function UserAdmin({ users, onAdd, onUpdate, onDelete }) {
  const [newUser, setNewUser] = useState({ Name: '', Email: '', Password: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editData, setEditData] = useState({ Name: '', Email: '', Password: '' });
  const [validEdit, setValidEdit] = useState(false);

  const validNewUser = useMemo(() => newUser.Name.trim() !== '' && newUser.Email.trim() !== '' && newUser.Password.trim() !== '', [newUser]);

  useEffect(() => {
    if (!editEntryId) { setValidEdit(false); return; }
    const original = users.find((u) => u.id === editEntryId);
    if (!original) { setValidEdit(false); return; }
    setValidEdit(editData.Name !== original.userName || editData.Email !== original.email || editData.Password.trim() !== '');
  }, [editData, editEntryId, users]);

  const isLocked = (name) => LOCKED_USERS.includes(name);
  const handleInsert = () => { onAdd(newUser); setNewUser({ Name: '', Email: '', Password: '' }); };
  const enterEdit = (u) => { setEditEntryId(u.id); setEditData({ Name: u.userName, Email: u.email, Password: '' }); };
  const handleEditChange = (e) => { const { name, value } = e.target; setEditData((prev) => ({ ...prev, [name]: value })); };
  const saveEdit = (id) => {
    if (!validEdit) return;
    const data = { Name: editData.Name, Email: editData.Email };
    if (editData.Password.trim() !== '') data.Password = editData.Password;
    onUpdate(id, data); setEditEntryId(null); setValidEdit(false);
  };

  return (
    <div className="hw-card mb-4">
      <div className="hw-card-header">
        <h5 className="mb-0 fw-bold">👤 Uživatelé</h5>
      </div>
      <div className="p-0">
        <div className="table-responsive">
          <table className="table hw-table mb-0">
            <thead>
              <tr>
                <th className="ps-3">Jméno</th>
                <th>Email</th>
                <th>Heslo</th>
                <th className="text-center" style={{ width: '100px' }}>Edit</th>
                <th className="text-center" style={{ width: '100px' }}>Smazat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hw-add-row">
                <td className="ps-3"><input type="text" className="form-control form-control-sm" value={newUser.Name} onChange={(e) => setNewUser({ ...newUser, Name: e.target.value })} placeholder="Jméno" /></td>
                <td><input type="email" className="form-control form-control-sm" value={newUser.Email} onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })} placeholder="example@google.com" /></td>
                <td><input type="password" className="form-control form-control-sm" value={newUser.Password} onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })} placeholder="••••••••" /></td>
                <td colSpan={2} className="text-center"><button className="hw-btn hw-btn-success" onClick={handleInsert} disabled={!validNewUser}>+ Přidat</button></td>
              </tr>

              {users.map((u) => (
                <tr key={u.id}>
                  <td className="ps-3">{editEntryId === u.id ? <input type="text" name="Name" value={editData.Name} onChange={handleEditChange} className="form-control form-control-sm" autoFocus /> : u.userName}</td>
                  <td>{editEntryId === u.id ? <input type="email" name="Email" value={editData.Email} onChange={handleEditChange} className="form-control form-control-sm" /> : <span className="text-muted">{u.email}</span>}</td>
                  <td>{editEntryId === u.id ? <input type="password" name="Password" value={editData.Password} onChange={handleEditChange} className="form-control form-control-sm" placeholder="••••••••" /> : <span className="text-muted">••••••••</span>}</td>
                  <td className="text-center">
                    {editEntryId === u.id ? (
                      <div className="hw-action-group">
                        <button className="hw-btn hw-btn-success" onClick={() => saveEdit(u.id)} disabled={!validEdit} title="Uložit změny">✅</button>
                        <button className="hw-btn" onClick={() => setEditEntryId(null)} title="Zrušit editaci">✕</button>
                      </div>
                    ) : isLocked(u.userName) ? (
                      <span className="hw-locked" title="Chráněný uživatel – nelze editovat">🔒</span>
                    ) : (
                      <button className="hw-btn hw-btn-ghost" onClick={() => enterEdit(u)} title="Editovat uživatele">✏️</button>
                    )}
                  </td>
                  <td className="text-center">
                    {confirmDeleteId === u.id ? (
                      <div className="hw-action-group">
                        <button className="hw-btn hw-btn-danger" onClick={() => { onDelete(u.id); setConfirmDeleteId(null); }} title="Potvrdit smazání">🗑️</button>
                        <button className="hw-btn" onClick={() => setConfirmDeleteId(null)} title="Zrušit smazání">✕</button>
                      </div>
                    ) : isLocked(u.userName) ? (
                      <span className="hw-locked" title="Chráněný uživatel – nelze smazat">🔒</span>
                    ) : (
                      <button className="hw-btn hw-btn-ghost" onClick={() => setConfirmDeleteId(u.id)} title="Smazat uživatele">🗑️</button>
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

export default UserAdmin;
