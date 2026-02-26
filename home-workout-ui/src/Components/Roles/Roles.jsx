/**
 * Roles – Správa rolí a přiřazení uživatelů do rolí (modal).
 * Zamčené role (LOCKED_ROLES) nelze smazat.
 */
import { useState, useMemo } from 'react';
import { roleApi } from '../../api';
import { LOCKED_ROLES } from '../../constants';

function Roles({ roles, users, onAdd, onUpdate, onDelete }) {
  const [newRoleName, setNewRoleName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalMembers, setModalMembers] = useState([]);
  const [modalNonMembers, setModalNonMembers] = useState([]);

  const validNewRole = useMemo(() => newRoleName.trim() !== '', [newRoleName]);
  const isLocked = (name) => LOCKED_ROLES.includes(name);
  const handleInsert = () => { onAdd(newRoleName); setNewRoleName(''); };
  const confirmDel = (id) => { onDelete(id); setConfirmDeleteId(null); };

  const openMembersModal = async (role) => {
    setSelectedRole(role);
    try {
      const { members, nonMembers } = await roleApi.getById(role.id);
      setModalMembers(members); setModalNonMembers(nonMembers); setShowMembersModal(true);
    } catch { alert('Chyba při načítání členů role.'); }
  };

  const handleToggleMember = (user, isMember) => {
    if (isMember) { setModalMembers((p) => p.filter((m) => m.id !== user.id)); setModalNonMembers((p) => [...p, user].sort((a, b) => a.userName.localeCompare(b.userName))); }
    else { setModalNonMembers((p) => p.filter((n) => n.id !== user.id)); setModalMembers((p) => [...p, user].sort((a, b) => a.userName.localeCompare(b.userName))); }
  };

  const saveMembersChanges = async () => {
    if (!selectedRole) return;
    const { members: orig } = await roleApi.getById(selectedRole.id);
    const origIds = orig.map((m) => m.id);
    const currIds = modalMembers.map((m) => m.id);
    await onUpdate({ RoleId: selectedRole.id, RoleName: selectedRole.name, AddIds: currIds.filter((id) => !origIds.includes(id)), DeleteIds: origIds.filter((id) => !currIds.includes(id)) });
    setShowMembersModal(false); setSelectedRole(null);
  };

  return (
    <div className="hw-card mb-4">
      <div className="hw-card-header">
        <h5 className="mb-0 fw-bold">🔑 Role</h5>
      </div>
      <div className="p-0">
        <div className="table-responsive">
          <table className="table hw-table mb-0">
            <thead>
              <tr>
                <th className="ps-3">Název</th>
                <th className="text-center" style={{ width: '130px' }}>Členové</th>
                <th className="text-center" style={{ width: '100px' }}>Smazat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hw-add-row">
                <td className="ps-3"><input type="text" className="form-control form-control-sm" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="Název role" /></td>
                <td colSpan={2} className="text-center"><button className="hw-btn hw-btn-success" onClick={handleInsert} disabled={!validNewRole}>+ Přidat</button></td>
              </tr>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td className="ps-3 fw-semibold">{r.name}</td>
                  <td className="text-center"><button className="hw-btn" onClick={() => openMembersModal(r)} title="Spravovat členy role">👥 Spravovat</button></td>
                  <td className="text-center">
                    {confirmDeleteId === r.id ? (
                      <div className="hw-action-group">
                        <button className="hw-btn hw-btn-danger" onClick={() => confirmDel(r.id)} title="Potvrdit smazání">🗑️</button>
                        <button className="hw-btn" onClick={() => setConfirmDeleteId(null)} title="Zrušit smazání">✕</button>
                      </div>
                    ) : isLocked(r.name) ? (
                      <span className="hw-locked" title="Chráněná role – nelze smazat">🔒</span>
                    ) : (
                      <button className="hw-btn hw-btn-ghost" onClick={() => setConfirmDeleteId(r.id)} title="Smazat roli">🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showMembersModal && selectedRole && (
        <div className="modal d-block hw-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Členové role: {selectedRole.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowMembersModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-2">✅ Členové</h6>
                    <ul className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {modalMembers.length === 0 ? <li className="list-group-item text-muted text-center">Žádní</li> :
                        modalMembers.map((u) => (
                          <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {u.userName}
                            {isLocked(u.userName) ? <span className="hw-locked" title="Chráněný uživatel">🔒</span> :
                              <button className="hw-btn hw-btn-danger" onClick={() => handleToggleMember(u, true)}>Odebrat</button>}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-2">⏳ Ostatní</h6>
                    <ul className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {modalNonMembers.length === 0 ? <li className="list-group-item text-muted text-center">Všichni jsou členy</li> :
                        modalNonMembers.map((u) => (
                          <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {u.userName}
                            {isLocked(u.userName) ? <span className="hw-locked" title="Chráněný uživatel">🔒</span> :
                              <button className="hw-btn hw-btn-success" onClick={() => handleToggleMember(u, false)}>Přidat</button>}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="hw-btn" onClick={() => setShowMembersModal(false)}>Zrušit</button>
                <button className="hw-btn hw-btn-filled" onClick={saveMembersChanges}>Uložit změny</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;
