import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, role, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Naga Mas
      </Link>
      <div className="navbar-menu">
        {isLoggedIn ? (
          <>
            {role === "admin" ? (
              <>
                <Link to="/add-barang" className="navbar-link">
                  Add Barang
                </Link>
                <button onClick={onLogout} className="navbar-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/cart" className="navbar-link">
                  Cart
                </Link>
                <button onClick={onLogout} className="navbar-link">
                  Logout
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
