import React, { useState } from 'react';
import axios from 'axios'; // Import axios pro volání API uvnitř komponenty

function Roles({ roles, newRole, setNewRole, insertRole, deleteRole, users, handleUpdateRoleMembers, baseUrl }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ID role, která čeká na potvrzení smazání
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedRoleForMembers, setSelectedRoleForMembers] = useState(null);
  const [modalMembers, setModalMembers] = useState([]); // Uživatelé aktuálně v této roli
  const [modalNonMembers, setModalNonMembers] = useState([]); // Uživatelé, kteří nejsou v této roli

  // smazání role
  const roleDeleteConfirm = id => {
    deleteRole(id);
    setConfirmDeleteId(null);
  };
  const onDeleteClick = id => setConfirmDeleteId(id);

  // NOVÁ FUNKCE: Otevření modálního okna pro správu členů role
  const openMembersModal = async role => {
    setSelectedRoleForMembers(role);
    try {
      // Načteme detaily role včetně členů a nečlenů z backendu
      const response = await axios.get(`${baseUrl}Roles/${role.id}`);
      const { members, nonMembers } = response.data;
      setModalMembers(members);
      setModalNonMembers(nonMembers);
      setShowMembersModal(true);
    } catch (error) {
      console.error('Chyba při načítání členů role:', error);
      alert('Chyba při načítání členů role.');
    }
  };

  // NOVÁ FUNKCE: Přesun uživatele mezi seznamy členů/nečlenů
  const handleToggleMember = (user, isMember) => {
    if (isMember) {
      // Odebrat z členů, přidat do nečlenů
      setModalMembers(prev => prev.filter(m => m.id !== user.id));
      setModalNonMembers(prev => [...prev, user].sort((a, b) => a.userName.localeCompare(b.userName)));
    } else {
      // Přidat do členů, odebrat z nečlenů
      setModalNonMembers(prev => prev.filter(nm => nm.id !== user.id));
      setModalMembers(prev => [...prev, user].sort((a, b) => a.userName.localeCompare(b.userName)));
    }
  };

  // NOVÁ FUNKCE: Uložení změn členů role
  const saveMembersChanges = async () => {
    if (!selectedRoleForMembers) return;

    const initialMembers = selectedRoleForMembers.members || []; // Pokud backend nevrací members přímo v GetAllRoles, budeme potřebovat plný seznam

    const originalMembersResponse = await axios.get(`${baseUrl}Roles/${selectedRoleForMembers.id}`);
    const originalMemberIds = originalMembersResponse.data.members.map(m => m.id);

    const currentMemberIds = modalMembers.map(m => m.id);

    const addIds = currentMemberIds.filter(id => !originalMemberIds.includes(id));
    const deleteIds = originalMemberIds.filter(id => !currentMemberIds.includes(id));

    await handleUpdateRoleMembers(selectedRoleForMembers.id, selectedRoleForMembers.name, addIds, deleteIds);
    setShowMembersModal(false);
    setSelectedRoleForMembers(null);
    setModalMembers([]);
    setModalNonMembers([]);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">🔑 Správa rolí</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>Název role</th>
              <th style={{ width: '120px' }}>Spravovat uživatele</th>
              <th style={{ width: '120px' }}>Smazat</th>
            </tr>
          </thead>

          <tbody>
            {/* Řádek pro přidání nové role */}
            <tr>
              <td>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3"
                  value={newRole.RoleName}
                  onChange={e => setNewRole({ ...newRole, RoleName: e.target.value })}
                  placeholder="Název role"
                />
              </td>
              <td colSpan={2} className="text-center">
                <button className="btn btn-outline-success btn-sm" onClick={insertRole}>
                  Přidat
                </button>
              </td>
            </tr>

            {/* Seznam rolí */}
            {roles.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>

                {/* Spravovat uživatele role (NOVÝ SLOUPEC) */}
                <td className="text-center">
                  <button className="btn btn-outline-info btn-sm" onClick={() => openMembersModal(r)} title="Spravovat členy role">
                    👥 Spravovat
                  </button>
                </td>

                {/* Mazání role */}
                <td className="text-center">
                  {confirmDeleteId === r.id ? (
                    <>
                      <button
                        onClick={() => roleDeleteConfirm(r.id)}
                        className="btn btn-outline-danger btn-sm me-2"
                        title="Potvrdit smazání"
                      >
                        🗑️
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="btn btn-outline-secondary btn-sm" title="Zrušit">
                        ❌
                      </button>
                    </>
                  ) : r.name === 'Admin' || r.name === 'Host' ? (
                    // Pro roli Admin zamkni možnost smazání
                    <button className="btn btn-outline-danger btn-sm" disabled>
                      <i className="bi bi-lock-fill"></i> 🔒
                    </button>
                  ) : (
                    <button onClick={() => onDeleteClick(r.id)} className="btn btn-outline-danger btn-sm">
                      Smaž
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modální okno pro správu členů role */}
      {showMembersModal && selectedRoleForMembers && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header bg-primary text-white rounded-top-4">
                <h5 className="modal-title">Spravovat členy role: {selectedRoleForMembers.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMembersModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Členové role</h6>
                    <ul className="list-group mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {modalMembers.length === 0 ? (
                        <li className="list-group-item text-muted">Žádní členové</li>
                      ) : (
                        modalMembers.map(user => (
                          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{user.userName}</span> {/* Zobrazí jméno uživatele */}
                            {user.userName === 'Admin' ||user.userName === 'Host'? (
                              <button disabled className="btn btn-outline-danger btn-sm" title="Admin nemůže být odebrán">
                                🔒
                              </button>
                            ) : (
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleToggleMember(user, true)}>
                                Odebrat
                              </button>
                            )}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Ostatní uživatelé</h6>
                    <ul className="list-group mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {modalNonMembers.length === 0 ? (
                        <li className="list-group-item text-muted">Všichni uživatelé jsou členy</li>
                      ) : (
                        modalNonMembers.map(user => (
                          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {user.userName}
                            {user.userName === 'Admin' ||user.userName === 'Host' ? (
                              <button disabled className="btn btn-outline-success btn-sm" title="Admin nemůže být přidán">
                                🔒
                              </button>
                            ) : (
                              <button className="btn btn-outline-success btn-sm" onClick={() => handleToggleMember(user, false)}>
                                Přidat
                              </button>
                            )}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMembersModal(false)}>
                  Zrušit
                </button>
                <button type="button" className="btn btn-primary" onClick={saveMembersChanges}>
                  Uložit změny
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;
