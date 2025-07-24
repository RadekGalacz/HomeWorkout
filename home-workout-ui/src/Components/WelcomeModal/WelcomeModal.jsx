import { useEffect, useState } from 'react';

const WelcomeModal = ({ isOpen: externalIsOpen, onClose }) => {
  const [internalOpen, setInternalOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setInternalOpen(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const isVisible = internalOpen || externalIsOpen;

  const handleClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!isVisible}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg rounded-3">
          <div className="modal-header bg-primary text-white border-0">
            <h1 className="modal-title fs-4 fw-bold text-decoration-underline" id="exampleModalLabel">
              Vítejte v aplikaci HomeWorkout!
            </h1>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
              aria-label="Zavřít"
            ></button>
          </div>
          <div className="modal-body p-4">
            <p className="text-center mb-4 text-muted fs-5">Krátký návod, jak aplikaci používat:</p>

            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h2 className="card-title fs-5 fw-semibold mb-3">Přístup do aplikace</h2>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Uživatelské jméno</th>
                        <th scope="col">Heslo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Admin</td>
                        <td>Abcd1234.</td>
                      </tr>
                      <tr>
                        <td>Host</td>
                        <td>Abcd1234.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <h2 className="fs-5 fw-semibold mb-3">Přístupnost: členové rolí "Admin" a "Host"</h2>

            <div className="alert alert-info mb-4 shadow-sm" role="alert">
              <p className="fw-semibold">🏋️ Vytvářejte si denní plány nebo přidávejte cviky do stávajících.</p>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <span className="badge bg-light text-dark me-2">Filtr cviků:</span> Filtrování cviků podle toho, zda byly již odcvičené
                </li>
                <li className="mb-2">
                  <button className="badge rounded-pill bg-secondary border-0 text-white me-2">Vršek těla</button>
                  Filtrování cviků na kartě podle svalové partie
                </li>
                <li className="mb-2">
                  Cviky lze označit za odcvičené nebo je smazat{' '}
                  <button className="btn btn-outline-success btn-sm me-1">✔️</button>
                  <button className="btn btn-outline-danger btn-sm">🗑️</button>
                </li>
                <li className="mb-2">
                  Denní plán lze upravit nebo úplně smazat{' '}
                  <button className="btn btn-outline-secondary btn-sm me-1">✏️</button>
                  <button className="btn btn-outline-danger btn-sm">Smazat plán</button>
                </li>
                <li>
                  Po stisku <button className="btn btn-sm btn-success">+ Přidat cvik</button> můžete vložit nový cvik do plánu
                </li>
              </ul>
            </div>

            <h2 className="fs-5 fw-semibold mb-3">Přístupnost: členové role "Admin"</h2>
            <div className="alert alert-warning mb-4 shadow-sm" role="alert">
              <p className="fw-semibold">✍️ V editační sekci spravujte cvičení a partie.</p>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">Přidejte v tabulce novou cvičenou partii, upravte nebo smažte stávající</li>
                <li className="mb-2">Vytvořte nový cvik, upravte nebo smažte stávající</li>
                <li>
                  Uzamčené položky nelze mazat ani upravovat{' '}
                  <button className="btn btn-outline-danger btn-sm" disabled>🔒</button>
                </li>
              </ul>
            </div>

            <h2 className="fs-5 fw-semibold mb-3">Přístupnost: členové role "Admin"</h2>
            <div className="alert alert-danger mb-4 shadow-sm" role="alert">
              <p className="fw-semibold">🛡️ V administrační sekci spravujte uživatele a jejich role.</p>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">Přidejte v tabulce nového uživatele</li>
                <li>
                  V tabulce rolí je pak možné přiřadit tohoto uživatele do vybrané role, položky označené{' '}
                  <button className="btn btn-outline-danger btn-sm" disabled>🔒</button> nelze smazat
                </li>
              </ul>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-primary px-4" onClick={handleClose}>
              Rozumím
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
