// src/components/sections/Hero.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Hero.css'

/* ── Quick pills data ────────────────────────────────── */
const QUICK_PILLS = [
  {
    label: '🍱 Food',
    bg: '#FFF0F0',
    color: '#FF5757',
    border: '#FECACA',
    cat: 'Food & Beverages',
  },
  {
    label: '✂️ Tailor',
    bg: '#F5F0FF',
    color: '#7C3AED',
    border: '#DDD6FE',
    cat: 'Tailoring',
  },
  {
    label: '🥐 Bakery',
    bg: '#FFF8E1',
    color: '#B45309',
    border: '#FDE68A',
    cat: 'Bakery',
  },
  {
    label: '💇 Beauty',
    bg: '#FFF0F6',
    color: '#F72585',
    border: '#FBCFE8',
    cat: 'Beauty & Wellness',
  },
  {
    label: '🛒 Grocery',
    bg: '#E6FAF8',
    color: '#00C9B1',
    border: '#99F6E4',
    cat: 'Grocery',
  },
]

/* ── Featured panel vendors ──────────────────────────── */
/*
  Demo vendors shown only for the visual Hero panel.
  They do not contain fake ratings or fake MongoDB IDs.
*/
const PANEL_VENDORS = [
  {
    emoji: '🍱',
    emBg: '#FFF0F0',
    name: "Ravi's Kitchen",
    meta: 'Food · Coimbatore',
  },
  {
    emoji: '🥐',
    emBg: '#E6FAF8',
    name: "Ammi's Bakery",
    meta: 'Bakery · Coimbatore',
  },
  {
    emoji: '✂️',
    emBg: '#F5F0FF',
    name: 'Stitch Perfect',
    meta: 'Tailoring · Coimbatore',
  },
]

/* ── Animation variants ──────────────────────────────── */
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 32,
  },

  visible: (i = 0) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 32,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.6,
      delay: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Hero() {
  const navigate = useNavigate()

  const [query, setQuery] = useState('')

  /* ── Search ── */
  const handleSearch = () => {
    const q = query.trim()

    navigate(
      q
        ? `/explore?q=${encodeURIComponent(q)}`
        : '/explore'
    )
  }

  /* ── Category filter ── */
  const handlePillClick = (cat) => {
    navigate(
      `/explore?cat=${encodeURIComponent(cat)}`
    )
  }

  /* ── Demo featured vendor click ── */
  const handlePanelVendorClick = () => {
    navigate('/explore')
  }

  return (
    <section className="hero">

      {/* ── Floating orbs ── */}

      <div
        className="orb"
        style={{
          width: 120,
          height: 120,
          background:
            'radial-gradient(circle,rgba(124,58,237,.15),transparent)',
          top: '15%',
          left: '5%',
          animationDuration: '8s',
        }}
      />

      <div
        className="orb"
        style={{
          width: 80,
          height: 80,
          background:
            'radial-gradient(circle,rgba(247,37,133,.12),transparent)',
          top: '60%',
          left: '15%',
          animationDuration: '11s',
          animationDelay: '-3s',
        }}
      />

      <div
        className="orb"
        style={{
          width: 100,
          height: 100,
          background:
            'radial-gradient(circle,rgba(0,201,177,.1),transparent)',
          top: '30%',
          right: '8%',
          animationDuration: '9s',
          animationDelay: '-5s',
        }}
      />

      <div className="wrap">

        <div className="hero-wrap">

          {/* ════════════ LEFT COLUMN ════════════ */}

          <div>

            {/* Eyebrow */}

            <motion.div
              className="hero-eyebrow"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <div className="live-dot" />

              <span>
                Discover local vendors near you
              </span>
            </motion.div>

            {/* Headline */}

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Your street's best
              <br />

              <span className="h1-grad">
                vendors, discovered
              </span>
            </motion.h1>

            {/* Description */}

            <motion.p
              className="hero-p"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              Food, tailoring, repairs, beauty and more —
              find local vendors and explore their shops,
              services and contact details in one place.
            </motion.p>

            {/* CTA buttons */}

            <motion.div
              className="hero-btns"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <button
                className="btn bp bxl"
                onClick={() => navigate('/explore')}
              >
                Explore vendors →
              </button>

              <button
                className="btn bg bxl"
                onClick={() => navigate('/signup')}
              >
                List your shop
              </button>
            </motion.div>

          </div>


          {/* ════════════ RIGHT PANEL ════════════ */}

          <motion.div
            className="hero-panel"
            variants={fadeRight}
            initial="hidden"
            animate="visible"
          >

            <div className="panel-find-lbl">
              🔍 Find vendors near you
            </div>


            {/* Search bar */}

            <div className="search-bar">

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search shops, services…"
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleSearch()
                }
              />

              <button onClick={handleSearch}>
                Search
              </button>

            </div>


            {/* Quick category pills */}

            <div className="qpills">

              {QUICK_PILLS.map((p) => (
                <div
                  key={p.cat}
                  className="qpill"
                  style={{
                    background: p.bg,
                    color: p.color,
                    borderColor: p.border,
                  }}
                  onClick={() =>
                    handlePillClick(p.cat)
                  }
                >
                  {p.label}
                </div>
              ))}

            </div>


            {/* Featured vendors */}

            <div className="panel-label">
              ⭐ Featured vendors
            </div>

            <div className="pv-list">

              {PANEL_VENDORS.map((v) => (
                <div
                  key={v.name}
                  className="pv-item"
                  onClick={handlePanelVendorClick}
                  style={{ cursor: 'pointer' }}
                >

                  <div
                    className="pv-em"
                    style={{
                      background: v.emBg,
                    }}
                  >
                    {v.emoji}
                  </div>

                  <div className="pv-info">

                    <div className="pv-name">
                      {v.name}
                    </div>

                    <div className="pv-meta">
                      {v.meta}
                    </div>

                  </div>

                </div>
              ))}

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  )
}