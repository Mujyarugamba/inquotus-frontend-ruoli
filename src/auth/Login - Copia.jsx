import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading, utente } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Per favore, compila tutti i campi.");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login effettuato con successo!");

        // Reindirizzamento in base al ruolo dell'utente
        if (utente?.ruolo === "committente") {
          navigate("/dashboard/committente");
        } else if (utente?.ruolo === "impresa") {
          navigate("/dashboard/impresa");
        } else if (utente?.ruolo === "professionista") {
          navigate("/dashboard/professionista");
        } else {
          navigate("/"); // Reindirizza alla home come fallback
        }
      } else {
        toast.error(error || "Errore durante il login.");
      }
    } catch (err) {
      toast.error("Errore durante il login.");
    }
  };

  return (
    <div className="login-form">
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Caricamento..." : "Accedi"}
        </button>
      </form>
      <p>
        Non hai un account?{" "}
        <a href="/" style={{ color: "#667eea" }}>
          Registrati qui
        </a>
      </p>
    </div>
  );
};

export default Login;













