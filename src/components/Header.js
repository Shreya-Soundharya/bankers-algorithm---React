import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css'; // Assuming you have a separate CSS file for the header

function Header() {
  const location = useLocation(); // Get the current location
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to close the menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/b.png" alt="Logo" />
      </div>
      <h1>Resource Allocation Simulation using Banker's Algorithm</h1>
      <div className="hamburger" onClick={toggleMenu}>
        {/* Hamburger Icon */}
        <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
      </div>

      {menuOpen && (
        <nav className="navbar">
          <ul>
            <li className={location.pathname === '/introduction' ? 'active' : ''}>
              <Link to="/introduction" onClick={closeMenu}>Introduction</Link>
            </li>
            <li className={location.pathname === '/pseudocode' ? 'active' : ''}>
              <Link to="/pseudocode" onClick={closeMenu}>Pseudocode</Link>
            </li>
            <li className={location.pathname === '/calculator' ? 'active' : ''}>
              <Link to="/calculator" onClick={closeMenu}>Calculator</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
