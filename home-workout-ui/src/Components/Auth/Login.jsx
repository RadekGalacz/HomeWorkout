import { useState } from "react";
import axios from "axios";

// Login formolář
export default function Login({ onLoginSuccess, baseUrl }) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                `${baseUrl}Account/Login`,
                { userName, password, remember },
                { withCredentials: true }
            );

            onLoginSuccess?.(res.data.user);
        } catch (err) {
            alert("❌ " + (err.response?.data?.message || "Chyba při přihlášení."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-sm p-4" style={{ maxWidth: "420px", width: "100%" }}>
                <h2 className="text-center mb-4">🔑 Přihlášení</h2>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                        <label className="form-label">Uživatelské jméno</label>
                        <input
                            type="text"
                            className="form-control"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Heslo</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-check mb-4">
                        <input
                            type="checkbox"
                            id="rememberCheck"
                            className="form-check-input"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="rememberCheck">
                            Pamatovat si mě
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Přihlašuji..." : "Přihlásit se"}
                    </button>
                </form>
            </div>
        </div>
    );
}
