import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import API_BASE_URL from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "L'email est obligatoire.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Format d'email invalide.";
    if (!mot_de_passe.trim()) next.mot_de_passe = "Le mot de passe est obligatoire.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api','')}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur de connexion");
      dispatch(loginSuccess(data.token));
      navigate("/subjects", { replace: true });
    } catch (error) {
      setServerError(error.message || "Erreur connexion backend");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to="/subjects" replace />;

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f7fb" }}>
      <div className="form-card" style={{ width: 380, padding: 24 }}>
        <h2 style={{ marginBottom: 20 }}>Connexion</h2>
        <form onSubmit={handleSubmit} className="entity-form">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="error-text">{errors.email}</p>}
          <label>Mot de passe</label>
          <input type="password" value={mot_de_passe} onChange={(e) => setMotDePasse(e.target.value)} />
          {errors.mot_de_passe && <p className="error-text">{errors.mot_de_passe}</p>}
          {serverError && <p className="error-text">{serverError}</p>}
          <button className="primary-btn" type="submit" disabled={loading} style={{ width: "100%", marginTop: 12 }}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="muted-text" style={{ marginTop: 16 }}>Compte test: powell@gmail.com / Admin123!</p>
      </div>
    </div>
  );
}

export default Login;
