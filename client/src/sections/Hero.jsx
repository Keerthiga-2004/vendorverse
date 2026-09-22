// src/sections/Hero.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import './Hero.css'

/* ── Quick pills — legitimate UI constants, no fake data ── */
const QUICK_PILLS = [
  { label: '🍱 Food',    bg: '#FFF0F0', color: '#FF5757', border: '#FECACA', cat: 'Food & Beverages'   },
  { label: '✂️ Tailor',  bg: '#F5F0FF', color: '#7C3AED', border: '#DDD6FE', cat: 'Tailoring'          },
  { label: '🥐 Bakery',  bg: '#FFF8E1', color: '#B45309', border: '#FDE68A', cat: 'Bakery'             },
  { label: '💇 Beauty',  bg: '#FFF0F6', color: '#F72585', border: '#FBCFE8', cat: 'Beauty & Wellness'  },
  { label: '🛒 Grocery', bg: '#E6FAF8', color: '#00C9B1', border: '#99F6E4', cat: 'Grocery'            },
]

// Category → emoji for the panel display
const CAT_EMOJI = {
  'Food & Beverages':   '🍱',
  'Grocery':            '🛒',
  'Tailoring':          '✂️',
  'Beauty & Wellness':  '💇',
  'Electronics Repair': '🔌',
  'Home Repair':        '🔨',
  'Electrician':        '⚡',
  'Bakery':             '🥐',
  'Local Services':     '🏪',
}
const CAT_BG = {
  'Food & Beverages':   '#FFF0F0',
  'Grocery':            '#E6FAF8',
  'Tailoring':          '#F5F0FF',
  'Beauty & Wellness':  '#FFF0F6',
  'Electronics Repair': '#FFF8E1',
  'Home Repair':        '#FFF3E0',
  'Electrician':        '#F5F3FF',
  'Bakery':             '#FFF8E1',
  'Local Services':     '#EFF6FF',
}

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

const fadeRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // ✅ CHANGED: fetch real vendors from API instead of PANEL_VENDORS hardcoded array
  const [panelVendors, setPanelVendors] = useState([])

  useEffect(() => {
    const fetchTopVendors = async () => {
      try {
        const { data } = await api.get('/users/vendors?sort=rating')
        // Take up to 3 vendors for the hero panel
        setPanelVendors(data.slice(0, 3))
      } catch {
        // If API fails, panel simply stays empty — no fake fallback
        setPanelVendors([])
      }
    }
    fetchTopVendors()
  }, [])

  const handleSearch = () => {
    const q = query.trim()
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore')
  }

  const handlePillClick = (cat) => {
    navigate(`/explore?cat=${encodeURIComponent(cat)}`)
  }

  return (
    <section className="hero">

      {/* ── Floating orbs ── */}
      <div className="orb" style={{ width: 120, height: 120, background: 'radial-gradient(circle,rgba(124,58,237,.15),transparent)', top: '15%', left: '5%', animationDuration: '8s' }} />
      <div className="orb" style={{ width: 80, height: 80, background: 'radial-gradient(circle,rgba(247,37,133,.12),transparent)', top: '60%', left: '15%', animationDuration: '11s', animationDelay: '-3s' }} />
      <div className="orb" style={{ width: 100, height: 100, background: 'radial-gradient(circle,rgba(0,201,177,.1),transparent)', top: '30%', right: '8%', animationDuration: '9s', animationDelay: '-5s' }} />

      <div className="wrap">
        <div className="hero-wrap">

          {/* ════════════ LEFT COLUMN ════════════ */}
          <div>
            <motion.div className="hero-eyebrow" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <div className="live-dot" />
              <span>Discover local vendors near you</span>
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              Your street's best<br />
              <span className="h1-grad">vendors, discovered</span>
            </motion.h1>

            <motion.p className="hero-p" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              Food, tailoring, repairs, beauty and more —
              find local vendors and explore their shops,
              services and contact details in one place.
            </motion.p>

            <motion.div className="hero-btns" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <button className="btn bp bxl" onClick={() => navigate('/explore')}>
                Explore vendors →
              </button>
              <button className="btn bg bxl" onClick={() => navigate('/signup')}>
                List your shop
              </button>
            </motion.div>
          </div>

          {/* ════════════ RIGHT PANEL ════════════ */}
          <motion.div className="hero-panel" variants={fadeRight} initial="hidden" animate="visible">

            <div className="panel-find-lbl">🔍 Find vendors near you</div>

            {/* Search bar */}
            <div className="search-bar">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search shops, services…"
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {/* Quick category pills */}
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

            {/* ✅ CHANGED: real vendors from API, or nothing if DB is empty */}
            {panelVendors.length > 0 && (
              <>
                <div className="panel-label">⭐ Featured vendors</div>
                <div className="pv-list">
                  {panelVendors.map(v => (
                    <div
                      key={v._id}
                      className="pv-item"
                      onClick={() => navigate(`/vendor/${v._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className="pv-em"
                        style={{ background: CAT_BG[v.category] || '#F5F0FF' }}
                      >
                        {CAT_EMOJI[v.category] || '🏪'}
                      </div>
                      <div className="pv-info">
                        <div className="pv-name">{v.shopName || v.name}</div>
                        <div className="pv-meta">
                          {v.category}{v.city ? ` · ${v.city}` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </motion.div>

        </div>
      </div>
    </section>
  )
}