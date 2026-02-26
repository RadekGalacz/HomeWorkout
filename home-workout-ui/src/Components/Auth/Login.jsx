/**
 * Login – Přihlašovací formulář s remember-me volbou.
 */
import { useState } from 'react';
import { authApi } from '../../api';
import { useAuth } from '../../AuthContext';

export default function Login() {
  const { handleLogin } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ userName, password, remember });
      handleLogin(res.data.user);
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Chyba při přihlášení.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="hw-card overflow-hidden" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="hw-login-header text-center">
          <h4 className="mb-0 fw-bold text-center">🔑 Přihlášení</h4>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-3">
              <label className="form-label small fw-semibold">Uživatelské jméno</label>
              <input type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Heslo</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-check mb-4">
              <input type="checkbox" id="rememberCheck" className="form-check-input" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <label className="form-check-label small" htmlFor="rememberCheck">Pamatovat si mě</label>
            </div>
            <button type="submit" className="hw-btn hw-btn-filled w-100 py-2" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Přihlašuji...</>
              ) : 'Přihlásit se'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
