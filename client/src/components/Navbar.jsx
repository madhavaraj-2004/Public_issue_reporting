import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = React.useContext(AuthContext);

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;

  return (
    <nav className="navbar glass-nav">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">PIR</span>
          <span className="brand-text">Public Issue Reporting</span>
        </Link>
        <div className="links">
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          {user ? (
            <>
              <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
              <button className="nav-link-button" type="button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link to="/register" className="nav-cta">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
