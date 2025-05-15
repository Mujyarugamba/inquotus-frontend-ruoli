import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { utente, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO + LINKS */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-blue-700">
              🧗 Inquotus
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/richieste"
                className={`text-sm ${
                  isActive("/richieste") ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-500`}
              >
                🔍 Richieste
              </Link>
              <Link
                to="/formazione"
                className={`text-sm ${
                  isActive("/formazione") ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-500`}
              >
                🎓 Formazione
              </Link>
              <Link
                to="/accesso-rapido"
                className={`text-sm ${
                  isActive("/accesso-rapido") ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-500`}
              >
                ✨ Accesso rapido
              </Link>
            </div>
          </div>

          {/* DESKTOP UTENTE */}
          <div className="hidden md:flex flex-col items-end text-right">
            {utente ? (
              <>
                <div className="text-sm text-gray-900">
                  👋 <strong>{utente.nome}</strong>{" "}
                  <span className="text-blue-600">({utente.ruolo})</span>
                </div>
                {utente.ruolo === "admin" && (
                  <Link
                    to="/admin"
                    className="text-xs text-gray-600 hover:text-blue-600"
                  >
                    📊 Area Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-1"
                >
                  🔒 Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/register" className="text-sm text-blue-600 hover:underline">
                  📝 Registrati
                </Link>
                <Link to="/login" className="text-sm text-blue-600 hover:underline">
                  🔐 Accedi
                </Link>
              </div>
            )}
          </div>

          {/* MENU MOBILE */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-gray-700 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden px-4 py-2 bg-gray-50 border-t space-y-2">
          <Link to="/richieste" className="block text-sm text-gray-700 hover:text-blue-600">
            🔍 Richieste
          </Link>
          <Link to="/formazione" className="block text-sm text-gray-700 hover:text-blue-600">
            🎓 Formazione
          </Link>
          <Link to="/accesso-rapido" className="block text-sm text-gray-700 hover:text-blue-600">
            ✨ Accesso rapido
          </Link>

          {utente ? (
            <>
              <div className="pt-2 border-t text-sm text-gray-800">
                👋 <strong>{utente.nome}</strong> –{" "}
                <span className="text-blue-600">{utente.ruolo}</span>
              </div>
              {utente.ruolo === "admin" && (
                <Link
                  to="/admin"
                  className="block text-xs text-gray-600 hover:text-blue-600"
                >
                  📊 Area Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                🔒 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="block text-sm text-blue-600 hover:underline">
                📝 Registrati
              </Link>
              <Link to="/login" className="block text-sm text-blue-600 hover:underline">
                🔐 Accedi
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;




























