// src/components/layout/Navbar.jsx
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../ui/Logo'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  console.log(user);
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const avatarColors = ['#7C3AED','#F72585','#10B981','#FFAB00','#FF5757']
  const avatarColor = user
    ? avatarColors[user.name.charCodeAt(0) % 5]
    : '#7C3AED'
  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <nav id="nav" className={scrolled ? 'nav-scrolled' : ''}>
      <div className="wrap nav-in">
        {/* LOGO */}
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <Logo size={38} />
        </Link>

        {/* NAV LINKS */}
        <div className="nav-links">
          <NavLink to="/"          className={({ isActive }) => `nav-a${isActive ? ' on' : ''}`} end>Home</NavLink>
          <NavLink to="/explore"   className={({ isActive }) => `nav-a${isActive ? ' on' : ''}`}>Explore</NavLink>
          <NavLink to="/categories" className={({ isActive }) => `nav-a${isActive ? ' on' : ''}`}>Categories</NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-r">
          {user ? (
            <>
              <span className="nav-user-name">Hi, {user.name.split(' ')[0]}</span>
              {user.role === 'vendor' && (
                <button className="btn bg bsm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </button>
              )}
              <div
                className="av"
                style={{ background: avatarColor }}
                onClick={logout}
                title="Logout"
              >
                {initials}
              </div>
            </>
          ) : (
            <>
              <button className="btn bg bsm" onClick={() => navigate('/login')}>Sign in</button>
              <button className="btn bp bsm" onClick={() => navigate('/signup')}>Join free ✦</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}