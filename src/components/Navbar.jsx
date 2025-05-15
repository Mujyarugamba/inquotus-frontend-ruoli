import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const VALID_ROLES = ["committente", "impresa", "professionista"];

const Navbar = () => {
  const { utente, logout, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setShowRegisterDropdown(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  if (initializing) {
    return (
      <nav className="navbar">
        <div className="navbar-logo">🧗 Inquotus</div>
        <div>⏳ Caricamento...</div>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="flex items-center gap-6">
          <Link to="/" className="navbar-logo">🧗 Inquotus</Link>
          <div className="navbar-links">
            <Link
              to="/richieste"
              className={isActive("/richieste") ? "underline" : ""}
              onClick={closeMenu}
            >
              🔍 Richieste
            </Link>
            <Link
              to="/formazione"
              className={isActive("/formazione") ? "underline" : ""}
              onClick={closeMenu}
            >
              🎓 Formazione
            </Link>
            <Link
              to="/accesso-rapido"
              className={isActive("/accesso-rapido") ? "underline" : ""}
              onClick={closeMenu}
            >
              ✨ Accesso rapido
            </Link>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          {utente ? (
            <div className="navbar-user flex items-center gap-4">
              <span className="saluto">
                Benvenuto nella tua area di lavoro,{" "}
                <strong>
                  {utente.nome || utente.email} ({VALID_ROLES.includes(utente.ruolo) ? utente.ruolo : "ruolo sconosciuto"})
                </strong>
              </span>
              <button
                onClick={handleLogout}
                className="logout-button"
                aria-label="Logout"
              >
                🔒 Logout
              </button>
            </div>
          ) : (
            <div className="navbar-user relative">
              <button
                onClick={() => setShowRegisterDropdown(!showRegisterDropdown)}
                className="underline text-sm mr-2"
              >
                📝 Registrati
              </button>
              {showRegisterDropdown && (
                <div className="dropdown-menu" onMouseLeave={() => setShowRegisterDropdown(false)}>
                  <Link to="/register?role=committente" onClick={closeMenu}>👤 Committente</Link>
                  <Link to="/register?role=impresa" onClick={closeMenu}>🏢 Impresa</Link>
                  <Link to="/register?role=professionista" onClick={closeMenu}>🧰 Professionista</Link>
                </div>
              )}
              <Link
                to="/login"
                className="underline text-sm"
                onClick={closeMenu}
              >
                🔐 Accedi
              </Link>
            </div>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu open">
          <Link to="/richieste" onClick={closeMenu}>🔍 Richieste</Link>
          <Link to="/formazione" onClick={closeMenu}>🎓 Formazione</Link>
          <Link to="/accesso-rapido" onClick={closeMenu}>✨ Accesso rapido</Link>
          {!utente && (
            <>
              <Link to="/register?role=committente" onClick={closeMenu}>📝 Committente</Link>
              <Link to="/register?role=impresa" onClick={closeMenu}>📝 Impresa</Link>
              <Link to="/register?role=professionista" onClick={closeMenu}>📝 Professionista</Link>
              <Link to="/login" onClick={closeMenu}>🔐 Accedi</Link>
            </>
          )}
          {utente && (
            <>
              <span>
                👋 {utente.nome || "Utente"}{" "}
                <span className={`badge badge-${utente.ruolo}`}>
                  {utente.ruolo}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="logout-button"
                aria-label="Logout"
              >
                🔒 Logout
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;




























