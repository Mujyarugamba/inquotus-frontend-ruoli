import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import messages from "../utils/messages";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(messages.error.loginFailed);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        toast.success(messages.success.login);
        setFadeOut(true);
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        toast.error(messages.error.loginFailed);
      }
    } catch (error) {
      toast.error(messages.error.loginFailed);
    }
  };

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={containerStyle}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={cardStyle}
          >
            <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              🔐 Accedi al tuo account
            </h2>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                disabled={loading}
              />
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "2.5rem" }}
                  disabled={loading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={togglePasswordStyle}
                >
                  {showPassword ? "👁️" : "🙈"}
                </span>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                style={buttonStyle}
                whileHover={!loading ? { scale: 1.05 } : {}}
              >
                {loading ? "..." : "Accedi"}
              </motion.button>
            </form>

            <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
              Non hai un account?{" "}
              <a href="/" style={linkStyle}>
                Registrati
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// STILI GRAFICI COORDINATI
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "2rem",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

const cardStyle = {
  backgroundColor: "rgba(255,255,255,0.95)",
  padding: "2.5rem",
  borderRadius: "1rem",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  width: "100%",
  maxWidth: "400px",
  color: "#333",
};

const inputStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
  fontSize: "1rem",
  width: "100%",
  backgroundColor: "#fff",
  color: "#333",
};

const buttonStyle = {
  padding: "0.8rem 1rem",
  backgroundColor: "#667eea",
  color: "white",
  fontWeight: "bold",
  fontSize: "1rem",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
};

const linkStyle = {
  color: "#667eea",
  textDecoration: "none",
  fontWeight: "bold",
};

const togglePasswordStyle = {
  position: "absolute",
  right: "0.8rem",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "1.2rem",
  color: "#555",
};

export default Login;














