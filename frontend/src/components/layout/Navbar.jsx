import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiGlobe } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../ui/Button";

function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLink = (to, labelKey) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`font-semibold transition-colors px-2 py-1 rounded-sm ${
        location.pathname === to
          ? "text-blue-800 border-b-2 border-blue-800"
          : "text-gray-700 hover:text-blue-800 hover:bg-blue-50"
      }`}
    >
      {t(labelKey)}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo Section */}
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-black text-blue-900 tracking-tight uppercase">
            JanaSeva Portal
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Government of Kerala
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLink("/", "home")}
          {navLink("/schemes", "schemes")}
          {navLink("/help", "Help")}
          {navLink("/updates", "Updates")}

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <button
            onClick={() => setLang(lang === "en" ? "ml" : "en")}
            className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-blue-800 transition-colors"
            title="Toggle Language"
          >
            <FiGlobe className="h-5 w-5" />
            {lang === "en" ? "മലയാളം" : "English"}
          </button>

          {user ? (
            <>
              {user.role === "admin" ? (
                <>
                  {navLink("/admin", "dashboard")}
                </>
              ) : (
                <>
                  {navLink("/dashboard", "dashboard")}
                  {navLink("/my-applications", "myApplications")}
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">{t("login")}</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">{t("register")}</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setLang(lang === "en" ? "ml" : "en")}
            className="text-gray-700 p-1"
          >
            <FiGlobe size={22} />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-700 bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLink("/", "home")}
            {navLink("/schemes", "schemes")}
            {navLink("/help", "localHelp")}
            {navLink("/updates", "updates")}

            {user ? (
              <>
                {user.role === "admin" ? (
                  <>
                    {navLink("/admin", "dashboard")}
                  </>
                ) : (
                  <>
                    {navLink("/dashboard", "dashboard")}
                    {navLink("/my-applications", "myApplications")}
                  </>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout} className="mt-2">
                  {t("logout")}
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-100">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">{t("login")}</Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button size="md" className="w-full">{t("register")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
