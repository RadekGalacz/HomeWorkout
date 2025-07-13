import React, {useState} from 'react';

function UserAdmin({users, newUser, setNewUser, insertUser, deleteUser, handleUpdateUser}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ID uživatele, který čeká na potvrzení smazání
  const [editEntryId, setEditEntryId] = useState(null); // ID uživatele, který je právě v režimu editace
  const [editData, setEditData] = useState({
    Name: '',
    Email: '',
    Password: ''
  });
  const [validEdit, setValidEdit] = useState(false); // validace formuláře editace

  // smazání uživatele
  const userDeleteConfirm = id => {
    deleteUser(id);
    setConfirmDeleteId(null);
  };
  const onDeleteClick = id => setConfirmDeleteId(id);

  // vstup do režimu úprav
  const enterEdit = u => {
    setEditEntryId(u.id);
    setEditData({
      Name: u.userName,
      Email: u.email,
      Password: ''
    });
     setValidEdit(updated.Name.trim() && updated.Email.trim() && updated.Password.trim());
  };

  // změny v poli editace
  const handleEditChange = e => {
    const {name, value} = e.target;
    const updated = {...editData, [name]: value};
    setEditData(updated);
    // základní validace: všechna pole musí být vyplněna
    setValidEdit(updated.Name.trim() && updated.Email.trim() && updated.Password.trim());
  };

  // uložit úpravy
  const saveEdit = id => {
    if (!validEdit) return;

    handleUpdateUser(id, {
      Name: editData.Name,
      Email: editData.Email,
      Password: editData.Password
    });
    setEditEntryId(null);
    setValidEdit(false);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">👤 Správa uživatelů</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>Jméno</th>
              <th>Email</th>
              <th>Heslo</th>
              <th style={{width: '120px'}}>Editovat</th>
              <th style={{width: '120px'}}>Smazat</th>
            </tr>
          </thead>

          <tbody>
            {/* Řádek pro přidání nového uživatele */}
            <tr>
              <td>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3"
                  value={newUser.Name}
                  onChange={e => setNewUser({...newUser, Name: e.target.value})}
                  placeholder="Jméno"
                />
              </td>
              <td>
                <input
                  type="email"
                  className="form-control form-control-sm rounded-3"
                  value={newUser.Email}
                  onChange={e => setNewUser({...newUser, Email: e.target.value})}
                  placeholder="E‑mail"
                />
              </td>
              <td>
                <input
                  type="password"
                  className="form-control form-control-sm rounded-3"
                  value={newUser.Password}
                  onChange={e => setNewUser({...newUser, Password: e.target.value})}
                  placeholder="Heslo"
                />
              </td>
              <td colSpan={2} className="text-center">
                <button className="btn btn-outline-success btn-sm" onClick={insertUser}>
                  Přidat
                </button>
              </td>
            </tr>

            {/* Seznam uživatelů */}
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  {editEntryId === u.id ? (
                    <input
                      type="text"
                      name="Name"
                      value={editData.Name}
                      onChange={handleEditChange}
                      className="form-control form-control-sm rounded-3"
                      placeholder="Jméno"
                      autoFocus
                    />
                  ) : (
                    u.userName
                  )}
                </td>
                <td>
                  {editEntryId === u.id ? (
                    <input
                      type="email"
                      name="Email"
                      value={editData.Email}
                      onChange={handleEditChange}
                      className="form-control form-control-sm rounded-3"
                      placeholder="E‑mail"
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td>
                  {editEntryId === u.id ? (
                    <input
                      type="password"
                      name="Password"
                      value={editData.Password}
                      onChange={handleEditChange}
                      className="form-control form-control-sm rounded-3"
                      placeholder="Heslo"
                    />
                  ) : (
                    '••••••••'
                  )}
                </td>

                {/* Editace */}
                <td className="text-center">
                  {editEntryId === u.id ? (
                    <>
                      <button
                        className="btn btn-outline-success btn-sm me-2"
                        onClick={() => saveEdit(u.id)}
                        disabled={!validEdit}
                        title="Uložit změny"
                      >
                        ✅
                      </button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditEntryId(null)} title="Zrušit editaci">
                        ❌
                      </button>
                    </>
                  ) : ['Admin', 'Host'].includes(u.userName) ? (
                    <button className="btn btn-outline-secondary btn-sm" disabled>
                      <i className="bi bi-lock-fill"></i> 🔒
                    </button>
                  ) : (
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => enterEdit(u)}>
                      Edituj
                    </button>
                  )}
                </td>

                {/* Mazání */}
                <td className="text-center">
                  {confirmDeleteId === u.id ? (
                    <>
                      <button
                        onClick={() => userDeleteConfirm(u.id)}
                        className="btn btn-outline-danger btn-sm me-2"
                        title="Potvrdit smazání"
                      >
                        🗑️
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="btn btn-outline-secondary btn-sm" title="Zrušit">
                        ❌
                      </button>
                    </>
                  ) : ['Admin', 'Host'].includes(u.userName) ? (
                    <button className="btn btn-outline-danger btn-sm" disabled>
                      <i className="bi bi-lock-fill"></i> 🔒
                    </button>
                  ) : (
                    <button onClick={() => onDeleteClick(u.id)} className="btn btn-outline-danger btn-sm">
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

export default UserAdmin;
