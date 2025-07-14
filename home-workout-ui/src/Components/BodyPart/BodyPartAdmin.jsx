import React, {useState, useEffect} from 'react';

function BodyPartAdmin({newBodyPart, setNewBodyPart, insertExerciseBodyPart, dataParts, handleDeleteBodyPart, handleUpdateBodyPart}) {
  // Lokální stav pro validaci, editaci a mazání
  const [valid, setValid] = useState(false);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
  setValid(newBodyPart.BodyPartName.trim() !== '');
}, [newBodyPart]);

  // Zpracování změny vstupního pole pro novou partii
  const handleChange = e => {
    const {value} = e.target;
    setNewBodyPart({ ...newBodyPart, BodyPartName: value }); // aktualizace názvu partie
  };

  // Odeslání formuláře pro přidání nové partie
  const handleSubmit = e => {
    e.preventDefault();
    insertExerciseBodyPart(); // volání funkce pro přidání
    setNewBodyPart({BodyPartName: ''}); // reset vstupu
  };

  // Přepnutí do režimu úpravy dané položky
  const enterEdit = item => {
    setEditEntryId(item.id);
    setEditName(item.bodyPartName);
  };

  // Uložení změněného názvu partie
  const saveEdit = id => {
    if (editName.trim() === '') return;
    handleUpdateBodyPart(id, {BodyPartName: editName});
    setEditEntryId(null);
  };

  // Příprava potvrzení mazání dané položky
  const onDeleteClick = id => {
    setConfirmDeleteId(id);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">🦵 Tabulka partií</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>Název svalové partie</th>
              <th style={{width: '120px'}}>Editovat</th>
              <th style={{width: '120px'}}>Smazat</th>
            </tr>
          </thead>
          <tbody>
            {/* Řádek pro přidání nové partie */}
            <tr>
              <td className='bg-secondary-subtle'> 
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3"
                    name="BodyPartName"
                    value={newBodyPart.BodyPartName}
                    onChange={handleChange}
                    placeholder="Např. Ramena"
                    required
                  />
                </form>
              </td>
              <td colSpan={2} className="text-center bg-secondary-subtle">
                <button className="btn btn-outline-success btn-sm" onClick={handleSubmit} disabled={!valid}>
                  Přidat
                </button>
              </td>
            </tr>

            {/* Hlavička při prázdném seznamu */}
            {dataParts.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  Žádné partie k zobrazení
                </td>
              </tr>
            )}

            {/* Iterace přes seznam partií */}
            {dataParts.map(item => (
              <tr key={item.id}>
                <td>
                  {editEntryId === item.id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-3"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    item.bodyPartName
                  )}
                </td>

                <td className="text-center">
                  {editEntryId === item.id ? (
                    <>
                      <button className="btn btn-outline-success btn-sm me-2" onClick={() => saveEdit(item.id)} title="Uložit změny">
                        ✅
                      </button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditEntryId(null)} title="Zrušit editaci">
                        ❌
                      </button>
                    </>
                  ) : ['Vršek těla', 'Střed těla'].includes(item.bodyPartName) ? (
                    <button className="btn btn-outline-secondary btn-sm" disabled>
                      <i className="bi bi-lock-fill"></i> 🔒
                    </button>
                  ) : (
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => enterEdit(item)}>
                      Edituj
                    </button>
                  )}
                </td>

                <td className="text-center">
                  {confirmDeleteId === item.id ? (
                    <>
                      <button
                        onClick={() => {
                          handleDeleteBodyPart(item.id);
                          setConfirmDeleteId(null);
                        }}
                        className="btn btn-outline-danger btn-sm me-2"
                        title="Potvrdit smazání"
                      >
                        🗑️
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="btn btn-outline-secondary btn-sm" title="Zrušit">
                        ❌
                      </button>
                    </>
                  ) : ['Vršek těla', 'Střed těla'].includes(item.bodyPartName) ? (
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

export default BodyPartAdmin;
