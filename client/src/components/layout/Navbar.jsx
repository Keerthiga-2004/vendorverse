// src/components/layout/Navbar.jsx
import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Logo from '../ui/Logo'
import './Navbar.css'

// ─── NOTIFICATION BELL + DROPDOWN ────────────────────────
function NotificationBell() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [unread,  setUnread]  = useState(0)
  const [notifs,  setNotifs]  = useState([])
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const pollRef     = useRef(null)

  // Poll unread count every 10s
  useEffect(() => {
    if (!user) return

    const fetchCount = async () => {
      try {
        const { data } = await api.get('/notifications/unread-count')
        setUnread(data.unreadCount || 0)
      } catch {
        // silently fail
      }
    }

    fetchCount()
    pollRef.current = setInterval(fetchCount, 10000)
    return () => clearInterval(pollRef.current)
  }, [user])

  // Fetch full list when dropdown opens
  const handleOpen = async () => {
    setOpen(v => !v)
    if (open) return  // closing — don't refetch

    try {
      setLoading(true)
      const { data } = await api.get('/notifications')
      setNotifs(data)

      // Mark all read
      await api.put('/notifications/read-all')
      setUnread(0)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const ICONS = {
    new_review:   '⭐',
    review_reply: '💬',
    new_message:  '✉️',
    wishlist_save:'💜',
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          position: 'relative',
          background: 'none',
          border: '1.5px solid var(--border)',
          borderRadius: 10,
          width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--ink2)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--v)'; e.currentTarget.style.color = 'var(--v)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink2)' }}
        title="Notifications"
      >
        {/* Bell SVG */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        {/* Unread badge */}
        {unread > 0 && (
          <span style={{
            position: 'absolute',
            top: -5, right: -5,
            background: 'var(--coral)',
            color: '#fff',
            borderRadius: '99px',
            fontSize: 10, fontWeight: 800,
            padding: '1px 5px',
            minWidth: 16, textAlign: 'center',
            border: '1.5px solid #fff',
            lineHeight: 1.5,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 320, maxHeight: 420,
          background: '#fff', borderRadius: 18,
          border: '1.5px solid var(--border)',
          boxShadow: '0 16px 48px rgba(15,13,26,.12)',
          zIndex: 600, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', letterSpacing: -0.3 }}>Notifications</span>
            {notifs.length > 0 && (
              <button
                onClick={async () => {
                  await api.put('/notifications/read-all')
                  setNotifs(prev => prev.map(n => ({ ...n, read: true })))
                  setUnread(0)
                }}
                style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--v)', fontWeight: 700, cursor: 'pointer' }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--ink3)', fontSize: 13 }}>
                Loading…
              </div>
            ) : notifs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🔔</div>
                <div style={{ fontSize: 13, color: 'var(--ink3)' }}>No notifications yet</div>
              </div>
            ) : (
              notifs.map(n => (
                <div
                  key={n._id}
                  onClick={() => {
                    setOpen(false)
                    if (n.link) navigate(n.link)
                    // Mark single as read
                    api.put(`/notifications/${n._id}/read`).catch(() => {})
                  }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 18px',
                    borderBottom: '1px solid var(--border)',
                    cursor: n.link ? 'pointer' : 'default',
                    background: n.read ? '#fff' : 'linear-gradient(135deg, #F5F0FF, #FFF0F6)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = n.read ? '#fff' : 'linear-gradient(135deg, #F5F0FF, #FFF0F6)' }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: 'var(--vl)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {ICONS[n.type] || '🔔'}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, color: 'var(--ink)', lineHeight: 1.5,
                      fontWeight: n.read ? 500 : 700,
                    }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 3 }}>
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--v)', flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MAIN NAVBAR ──────────────────────────────────────────
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const avatarColors = ['#7C3AED','#F72585','#10B981','#FFAB00','#FF5757']
  const avatarColor  = user ? avatarColors[user.name.charCodeAt(0) % 5] : '#7C3AED'
  const initials     = user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : ''

  return (
    <nav id="nav" className={scrolled ? 'nav-scrolled' : ''}>
      <div className="wrap nav-in">

        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <Logo size={38} />
        </Link>

        <div className="nav-links">
          <NavLink to="/"           className={({ isActive }) => `nav-a${isActive ? ' on' : ''}`} end>Home</NavLink>
          <NavLink to="/explore"    className={({ isActive }) => `nav-a${isActive ? ' on' : ''}`}>Explore</NavLink>
          <NavLink to="/categories" className={({ isActive }) => `nav-a${isActive ? ' on' : ''}`}>Categories</NavLink>

          {user && user.role === 'user' && (
            <NavLink to="/wishlist" className={({ isActive }) => `nav-a${isActive ? ' on' : ''}`}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Wishlist
              </span>
            </NavLink>
          )}

          {user && (
            <NavLink to="/chat" className={({ isActive }) => `nav-a${isActive ? ' on' : ''}`}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Messages
              </span>
            </NavLink>
          )}
        </div>

        <div className="nav-r">
          {user ? (
            <>
              <span className="nav-user-name">Hi, {user.name.split(' ')[0]}</span>

              {/* ✅ ADDED: Notification bell */}
              <NotificationBell />

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