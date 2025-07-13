import { useState } from "react";
import { FaMoon, FaSun, FaBars, FaTimes, FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="navbar-container">

        {/* 🔙 Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {/* Logo */}
        <div className="navbar-logo">
          <a href="/">🎁 Gift AI</a>
        </div>

        {/* Menu Items */}
        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li><a href="/">Home</a></li>
          <li><Link to="/gift-finder">Gift Finder</Link></li>
          <li><a href="/categories"></a></li>
          <li><a href="/about"></a></li>
        </ul>


        {/* 🔄 Dark/Light Mode Toggle */}
        <div className="navbar-toggle">
          <button onClick={toggleDarkMode} className="mode-toggle">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* 🚪 Logout Button */}
        <div className="navbar-logout">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* 📱 Mobile Menu Toggle */}
        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
