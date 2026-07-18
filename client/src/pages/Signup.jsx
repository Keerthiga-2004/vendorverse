// src/pages/Auth/Signup.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from "../context/AuthContext";
import './Signup.css'

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

export default function Signup() {
  const navigate = useNavigate()
  const { signup, loading } = useAuth()

  const [role, setRole] = useState('user')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) {
      errs.name = 'Full name is required'
    } else if (form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters'
    }
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
      await signup(form.name.trim(), form.email.trim(), form.password, role)
      navigate('/')
    } catch (err) {
      // error toast already shown inside AuthContext.signup()/register()
    } finally {
      setSubmitting(false)
    }
  }

  const isBusy = submitting || loading

  return (
    <div className="auth-wrap">

      {/* ── LEFT PANEL ── */}
      <div
        className="auth-left"
        style={{ background: 'linear-gradient(160deg,#10B981 0%,#00C9B1 40%,#7C3AED 100%)' }}
      >
        <div className="auth-left-content">
          <Link to="/" className="logo">
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
              <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.6)" strokeWidth="1.8" />
              <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="logo-txt">
              Vendor
              <b style={{ opacity: 0.75 }}>Verse</b>
            </span>
          </Link>

          <div className="auth-q">
            Join thousands of vendors <em>building their digital presence</em>
          </div>

          <div className="auth-pts">
            <div className="auth-pt">
              <div className="auth-pt-ic">🆓</div>
              <div className="auth-pt-t"><strong>Free forever</strong>No listing fees. No hidden charges.</div>
            </div>
            <div className="auth-pt">
              <div className="auth-pt-ic">🚀</div>
              <div className="auth-pt-t"><strong>Live in minutes</strong>Set up and start getting discovered today.</div>
            </div>
            <div className="auth-pt">
              <div className="auth-pt-ic">📊</div>
              <div className="auth-pt-t"><strong>Analytics</strong>Track who's viewing your shop.</div>
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
          <h2>Create your account</h2>
          <div className="sub">Join VendorVerse — completely free</div>

          {/* role selector */}
          <div className="role-tabs">
            <div
              className={`role-tab${role === 'user' ? ' on' : ''}`}
              onClick={() => setRole('user')}
            >
              👤 Customer
            </div>
            <div
              className={`role-tab${role === 'vendor' ? ' on' : ''}`}
              onClick={() => setRole('vendor')}
            >
              🏪 Vendor
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="lbl">Full name</label>
              <input
                className={`inp${errors.name ? ' has-error' : ''}`}
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                disabled={isBusy}
                autoComplete="name"
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

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
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                disabled={isBusy}
                autoComplete="new-password"
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn bp blg"
              style={{ width: '100%' }}
              disabled={isBusy}
            >
              {isBusy ? <span className="spin" /> : 'Create account ✦'}
            </button>
          </form>

          <div className="auth-sw">
            Have an account? <Link to="/login">Sign in →</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}