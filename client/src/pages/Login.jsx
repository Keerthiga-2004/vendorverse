// src/pages/Auth/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from "../context/AuthContext";
import './Login.css'

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Enter a valid email address'
    }
    if (!form.password) {
      errs.password = 'Password is required'
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the errors below')
      return
    }
    setSubmitting(true)
    try {
      await login(form.email.trim(), form.password)
      navigate('/')
    } catch (err) {
      // error toast already shown inside AuthContext.login()
    } finally {
      setSubmitting(false)
    }
  }

  const isBusy = submitting || loading

  return (
    <div className="auth-wrap">

      {/* ── LEFT PANEL ── */}
      <div className="auth-left auth-left-bg">
        <div className="auth-left-content">
          <Link to="/" className="logo">
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
              <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.6)" strokeWidth="1.8" />
              <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="3" fill="#fff" />
            </svg>
            <span className="logo-txt">
              Vendor
              <b style={{
                background: 'linear-gradient(135deg,#FFAB00,#10B981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Verse</b>
            </span>
          </Link>

          <div className="auth-q">
            Welcome back to your <em>neighbourhood</em> marketplace
          </div>

          <div className="auth-pts">
            <div className="auth-pt">
              <div className="auth-pt-ic">📍</div>
              <div className="auth-pt-t"><strong>Hyperlocal discovery</strong>Find vendors within walking distance.</div>
            </div>
            <div className="auth-pt">
              <div className="auth-pt-ic">⭐</div>
              <div className="auth-pt-t"><strong>Real reviews</strong>Honest ratings from your actual neighbours.</div>
            </div>
            <div className="auth-pt">
              <div className="auth-pt-ic">🏪</div>
              <div className="auth-pt-t"><strong>Vendor dashboard</strong>Powerful tools to manage your business.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: FORM ── */}
      <div className="auth-right">
        <motion.div
          className="auth-box"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h2>Welcome back</h2>
          <div className="sub">Sign in to your VendorVerse account</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="lbl">Email address</label>
              <input
                className={`inp${errors.email ? ' has-error' : ''}`}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={isBusy}
                autoComplete="email"
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field">
              <label className="lbl">Password</label>
              <input
                className={`inp${errors.password ? ' has-error' : ''}`}
                type="password"
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                disabled={isBusy}
                autoComplete="current-password"
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn bp blg"
              style={{ width: '100%' }}
              disabled={isBusy}
            >
              {isBusy ? <span className="spin" /> : 'Sign in →'}
            </button>
          </form>

          <div className="auth-sw">
            No account? <Link to="/signup">Create one free →</Link>
          </div>

          <div className="demo-box">
            <strong>Demo accounts</strong><br />
            User: <strong>user@demo.com</strong> / demo123<br />
            Vendor: <strong>vendor@demo.com</strong> / demo123
          </div>
        </motion.div>
      </div>
    </div>
  )
}