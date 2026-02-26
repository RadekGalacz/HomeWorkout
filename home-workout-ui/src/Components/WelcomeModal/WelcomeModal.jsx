/**
 * WelcomeModal – Uvítací nápověda zobrazená při prvním přihlášení.
 * Lze znovu otevřít tlačítkem "Nápověda" v navbaru.
 */
import { useEffect, useState } from 'react';

const WelcomeModal = ({ isOpen: externalIsOpen, onClose }) => {
  const [internalOpen, setInternalOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hasVisited')) {
      setInternalOpen(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const isVisible = internalOpen || externalIsOpen;
  const handleClose = () => { setInternalOpen(false); onClose?.(); };

  if (!isVisible) return null;

  return (
    <div className="modal d-block hw-modal" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header py-3">
            <h5 className="modal-title fw-bold">Vítejte v HomeWorkout!</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body p-4">
            <p className="text-center text-muted mb-4">Krátký návod, jak aplikaci používat</p>

            {/* Přihlašovací údaje */}
            <div className="hw-card mb-4 p-3">
              <h6 className="fw-bold mb-2">🔐 Přístupové údaje</h6>
              <table className="table table-sm table-borderless mb-0">
                <thead><tr><th className="text-muted small">Uživatel</th><th className="text-muted small">Heslo</th></tr></thead>
                <tbody>
                  <tr><td><code>Admin</code></td><td><code>Abcd1234.</code></td></tr>
                  <tr><td><code>Host</code></td><td><code>Abcd1234.</code></td></tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="hw-card p-3">
                <h6 className="fw-bold mb-1">🏋️ Plány (všichni uživatelé)</h6>
                <ul className="small mb-0 ps-3 text-muted">
                  <li>Vytvářejte denní plány a přidávejte cviky</li>
                  <li>Filtrujte podle stavu a svalové partie</li>
                  <li>Označujte cviky za odcvičené ✓</li>
                </ul>
              </div>
              <div className="hw-card p-3">
                <h6 className="fw-bold mb-1">✍️ Editace (admin)</h6>
                <ul className="small mb-0 ps-3 text-muted">
                  <li>Spravujte cviky a svalové partie</li>
                  <li>Zamčené položky 🔒 nelze editovat</li>
                </ul>
              </div>
              <div className="hw-card p-3">
                <h6 className="fw-bold mb-1">🛡️ Administrace (admin)</h6>
                <ul className="small mb-0 ps-3 text-muted">
                  <li>Správa uživatelů a přiřazení rolí</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="hw-btn hw-btn-filled px-4" onClick={handleClose}>Rozumím</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
