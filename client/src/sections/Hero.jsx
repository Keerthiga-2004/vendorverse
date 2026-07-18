// src/components/sections/Hero.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Hero.css'

/* ── counter animation hook ──────────────────────────── */
function useCounter(target, duration = 1800, suffix = '') {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + increment, target)
          setVal(Math.floor(current))
          if (current >= target) clearInterval(timer)
        }, duration / steps)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { val, ref }
}

/* ── quick pills data ────────────────────────────────── */
const QUICK_PILLS = [
  { label: '🍱 Food',   bg: '#FFF0F0', color: '#FF5757', border: '#FECACA', cat: 'Food & Beverages' },
  { label: '✂️ Tailor', bg: '#F5F0FF', color: '#7C3AED', border: '#DDD6FE', cat: 'Tailoring' },
  { label: '🥐 Bakery', bg: '#FFF8E1', color: '#B45309', border: '#FDE68A', cat: 'Bakery' },
  { label: '💇 Beauty', bg: '#FFF0F6', color: '#F72585', border: '#FBCFE8', cat: 'Beauty & Wellness' },
  { label: '🛒 Grocery',bg: '#E6FAF8', color: '#00C9B1', border: '#99F6E4', cat: 'Grocery' },
]

/* ── featured panel vendors ──────────────────────────── */
const PANEL_VENDORS = [
  { id: 'v1', emoji: '🍱', emBg: '#FFF0F0', name: "Ravi's Kitchen",  meta: 'Food · Coimbatore · 0.3 km', rating: 4.9 },
  { id: 'v5', emoji: '🥐', emBg: '#E6FAF8', name: "Ammi's Bakery",   meta: 'Bakery · Coimbatore · 0.7 km', rating: 4.9 },
  { id: 'v2', emoji: '✂️', emBg: '#F5F0FF', name: 'Stitch Perfect',  meta: 'Tailoring · Coimbatore · 0.8 km', rating: 4.7 },
]

/* ── animation variants ──────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
}
const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] } }
}

export default function Hero() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const stat1 = useCounter(2400, 1600, '+')
  const stat2 = useCounter(18,   1600, 'K+')
  const stat3 = useCounter(120,  1600, '+')

  const handleSearch = () => {
    const q = query.trim()
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore')
  }
  const handlePillClick = (cat) => {
    navigate(`/explore?cat=${encodeURIComponent(cat)}`)
  }

  return (
    <section className="hero">
      {/* ── floating orbs (exact from HTML) ── */}
      <div className="orb" style={{ width:120, height:120, background:'radial-gradient(circle,rgba(124,58,237,.15),transparent)', top:'15%', left:'5%',  animationDuration:'8s' }} />
      <div className="orb" style={{ width:80,  height:80,  background:'radial-gradient(circle,rgba(247,37,133,.12),transparent)', top:'60%', left:'15%', animationDuration:'11s', animationDelay:'-3s' }} />
      <div className="orb" style={{ width:100, height:100, background:'radial-gradient(circle,rgba(0,201,177,.1),transparent)',   top:'30%', right:'8%', animationDuration:'9s',  animationDelay:'-5s' }} />

      <div className="wrap">
        <div className="hero-wrap">

          {/* ════════════ LEFT COLUMN ════════════ */}
          <div>
            {/* eyebrow */}
            <motion.div
              className="hero-eyebrow"
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
            >
              <div className="live-dot" />
              <span>Live · 120+ cities across India</span>
            </motion.div>

            {/* headline */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
            >
              Your street's best<br />
              <span className="h1-grad">vendors, discovered</span>
            </motion.h1>

            {/* subtext */}
            <motion.p
              className="hero-p"
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
            >
              Food, tailoring, repairs, beauty and more — find trusted local vendors
              right around the corner. Support local. Live better.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="hero-btns"
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
            >
              <button className="btn bp bxl" onClick={() => navigate('/explore')}>
                Explore vendors →
              </button>
              <button className="btn bg bxl" onClick={() => navigate('/signup')}>
                List your shop
              </button>
            </motion.div>

            {/* mini stats with counter */}
            <motion.div
              className="hero-stats"
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
            >
              <div className="hstat" ref={stat1.ref}>
                <div className="hstat-n">{stat1.val.toLocaleString()}<span>+</span></div>
                <div className="hstat-l">Vendors listed</div>
              </div>
              <div className="hstat" ref={stat2.ref}>
                <div className="hstat-n">{stat2.val}<span>K+</span></div>
                <div className="hstat-l">Happy customers</div>
              </div>
              <div className="hstat" ref={stat3.ref}>
                <div className="hstat-n">{stat3.val}<span>+</span></div>
                <div className="hstat-l">Cities covered</div>
              </div>
            </motion.div>
          </div>

          {/* ════════════ RIGHT PANEL ════════════ */}
          <motion.div
            className="hero-panel"
            variants={fadeRight} initial="hidden" animate="visible"
          >
            <div className="panel-find-lbl">🔍 Find vendors near you</div>

            {/* search bar */}
            <div className="search-bar">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search shops, services…"
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {/* quick pills */}
            <div className="qpills">
              {QUICK_PILLS.map(p => (
                <div
                  key={p.cat}
                  className="qpill"
                  style={{ background: p.bg, color: p.color, borderColor: p.border }}
                  onClick={() => handlePillClick(p.cat)}
                >
                  {p.label}
                </div>
              ))}
            </div>

            {/* featured near you */}
            <div className="panel-label">⭐ Featured near you</div>
            <div className="pv-list">
              {PANEL_VENDORS.map(v => (
                <div
                  key={v.id}
                  className="pv-item"
                  onClick={() => navigate(`/vendor/${v.id}`)}
                >
                  <div className="pv-em" style={{ background: v.emBg }}>{v.emoji}</div>
                  <div className="pv-info">
                    <div className="pv-name">{v.name}</div>
                    <div className="pv-meta">{v.meta}</div>
                  </div>
                  <div className="pv-star">⭐ {v.rating}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}