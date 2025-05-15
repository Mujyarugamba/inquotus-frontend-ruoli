import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import messages from "../utils/messages";

const ruoliValidi = {
  committente: "Committente",
  impresa: "Impresa",
  professionista: "Professionista"
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fadeOut, setFadeOut] = useState(false);

  const ruolo = searchParams.get("role");

  useEffect(() => {
    if (!ruolo || !Object.keys(ruoliValidi).includes(ruolo)) {
      navigate("/");
    }
  }, [ruolo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(messages.error.registrationFailed);
      return;
    }

    try {
      const success = await register(email, password, ruolo);
      if (success) {
        toast.success(messages.success.registration);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            navigate("/verifica-email");
          }, 1000);
        }, 1000);
      } else {
        toast.error(error || messages.error.registrationFailed);
      }
    } catch (err) {
      toast.error(messages.error.registrationFailed);
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
            <h2 className="text-center mb-4">
              📝 Crea il tuo account come <strong>{ruoliValidi[ruolo]}</strong>
            </h2>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                style={inputStyle}
                disabled={loading}
              />
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  style={{ ...inputStyle, paddingRight: "2.5rem" }}
                  disabled={loading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={togglePasswordStyle}
                  title="Mostra/Nascondi password"
                >
                  {showPassword ? "👁️" : "🙈"}
                </span>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                style={buttonStyle}
                whileHover={!loading ? { scale: 1.05 } : {}}
                animate={loading ? { width: 70 } : { width: "100%" }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  <motion.div
                    style={{
                      height: 4,
                      width: "100%",
                      backgroundColor: "#ffffff",
                      borderRadius: 2,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                    }}
                  />
                ) : (
                  "Registrati"
                )}
              </motion.button>
            </form>

            <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
              Hai già un account?{" "}
              <a href="/login" style={linkStyle}>
                Accedi qui
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// STILI
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
  backgroundColor: "rgba(255,255,255,0.92)",
  padding: "2rem",
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
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

export default Register;




