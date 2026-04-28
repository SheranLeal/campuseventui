import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth, useTheme } from '../context/AppContext'
import './Navbar.css'

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth()
  const { dark, setDark } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false) }
  const close = () => setMenuOpen(false)

  const linkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <NavLink to="/" className="brand" onClick={close}>
          <span className="brand-icon">◈</span>
          <span className="brand-text">CampusEvent<em>UI</em></span>
        </NavLink>

        {/* Desktop right side */}
        <nav className="nav-right">
          <NavLink to="/"          className={linkClass} end>Home</NavLink>
          <NavLink to="/events"    className={linkClass}>Events</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>

          {/* Dark mode toggle */}
          <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>

          {/* Login / Logout */}
          {isLoggedIn
            ? <button className="nav-auth nav-auth-logout" onClick={handleLogout}>Logout</button>
            : <NavLink to="/login" className="nav-auth nav-auth-login">Login</NavLink>
          }
        </nav>

        {/* Hamburger (mobile) */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <NavLink to="/"          className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} end onClick={close}>Home</NavLink>
        <NavLink to="/events"    className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={close}>Events</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={close}>Dashboard</NavLink>
        <div className="mobile-divider" />
        <button style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', color:'var(--text-2)', fontSize:14, fontWeight:500, borderRadius:'var(--radius)', width:'100%' }}
          onClick={() => { setDark(d => !d); close() }}>
          {dark ? '☀️  Light mode' : '🌙  Dark mode'}
        </button>
        {isLoggedIn
          ? <button className="mobile-auth mobile-auth-logout" onClick={handleLogout}>Logout</button>
          : <NavLink to="/login" className="mobile-auth mobile-auth-login" onClick={close}>Login</NavLink>
        }
      </div>
    </header>
  )
}
