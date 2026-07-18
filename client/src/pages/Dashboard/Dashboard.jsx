// src/pages/Dashboard/Dashboard.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

// ─── MOCK DATA ────────────────────────────────────────────
const MOCK_VENDOR = {
  rating: 4.8,
  reviewCount: 23,
  isOpen: true,
}

const MOCK_PRODUCTS = [
  { _id: 'dp1', name: 'Masala Dosa',   emoji: '🥞', price: 60,  category: 'Food',     available: true  },
  { _id: 'dp2', name: 'Filter Coffee', emoji: '☕', price: 25,  category: 'Food',     available: true  },
  { _id: 'dp3', name: 'Thali Meals',   emoji: '🍱', price: 120, category: 'Food',     available: true  },
  { _id: 'dp4', name: 'Cold Coffee',   emoji: '🧊', price: 45,  category: 'Beverage', available: false },
  { _id: 'dp5', name: 'Veg Puff',      emoji: '🥟', price: 30,  category: 'Snacks',   available: true  },
]

// Empty by design — matches approved HTML's renderRecR() which always
// shows the empty state on the overview tab (reviews live in Reviews tab)
const MOCK_RECENT_REVIEWS = []

// ─── ANIMATION VARIANTS ───────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

// ─── SIDEBAR LOGO SVG ─────────────────────────────────────
function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="sb-lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F72585" />
        </linearGradient>
        <linearGradient id="sb-lg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAB00" />
          <stop offset="100%" stopColor="#00C9B1" />
        </linearGradient>
      </defs>
      <path
        d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z"
        fill="rgba(124,58,237,.1)"
        stroke="url(#sb-lg1)"
        strokeWidth="1.8"
      />
      <path
        d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13"
        stroke="url(#sb-lg2)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="2.8" fill="url(#sb-lg1)" />
    </svg>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const firstName = user?.name?.split(' ')[0] || 'Vendor'
  const recentProducts = MOCK_PRODUCTS.slice(0, 5)

  return (
    <div className="dash-wrap">

      {/* ════════════════ SIDEBAR ════════════════ */}
      <aside className="sb">

        {/* Logo */}
        <div className="sb-logo">
          <div className="logo-link" onClick={() => navigate('/')}>
            <SidebarLogo />
            <span className="sb-logo-txt">
              Vendor<b>Verse</b>
            </span>
          </div>
        </div>

        {/* Main nav items */}
        <div className="sb-sec">
          <span className="sb-lbl">Main</span>

          {/* Overview — active */}
          <button className="sb-a on">
            <span className="sb-ic">📊</span>
            Overview
          </button>

          <button className="sb-a" onClick={() => navigate('/dashboard/products')}>
            <span className="sb-ic">📦</span>
            Products
          </button>

          <button className="sb-a" onClick={() => navigate('/dashboard/shop')}>
            <span className="sb-ic">🏪</span>
            My Shop
          </button>

          <button className="sb-a" onClick={() => navigate('/dashboard/reviews')}>
            <span className="sb-ic">⭐</span>
            Reviews
          </button>
        </div>

        {/* Other nav items */}
        <div className="sb-sec" style={{ marginTop: 8 }}>
          <span className="sb-lbl">Other</span>

          <button className="sb-a" onClick={() => navigate('/explore')}>
            <span className="sb-ic">🔍</span>
            Explore
          </button>

          <button className="sb-a logout" onClick={logout}>
            <span className="sb-ic">🚪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* ════════════════ MAIN ════════════════ */}
      <main className="dmain">

        {/* ── Header ── */}
        <motion.div
          className="dash-hd"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div>
            <div className="dash-title">Dashboard</div>
            <div className="dash-sub">
              Welcome back, {firstName}! Here's your shop overview.
            </div>
          </div>

          <button
            className="btn bp bsm"
            onClick={() => navigate('/dashboard/products')}
          >
            + Add product
          </button>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div
          className="kpis"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          {/* Products */}
          <div className="kpi">
            <div className="kpi-blob" style={{ background: 'var(--v)' }} />
            <div className="kpi-ic" style={{ background: 'var(--vl)' }}>📦</div>
            <div className="kpi-lbl">Products</div>
            <div className="kpi-n">{MOCK_PRODUCTS.length}</div>
            <div className="kpi-tr">↑ In your shop</div>
          </div>

          {/* Avg Rating */}
          <div className="kpi">
            <div className="kpi-blob" style={{ background: 'var(--amber)' }} />
            <div className="kpi-ic" style={{ background: 'var(--amberl)' }}>⭐</div>
            <div className="kpi-lbl">Avg Rating</div>
            <div className="kpi-n">{MOCK_VENDOR.rating || '—'}</div>
            <div className="kpi-tr">Customer score</div>
          </div>

          {/* Reviews */}
          <div className="kpi">
            <div className="kpi-blob" style={{ background: 'var(--green)' }} />
            <div className="kpi-ic" style={{ background: 'var(--greenl)' }}>💬</div>
            <div className="kpi-lbl">Reviews</div>
            <div className="kpi-n">{MOCK_VENDOR.reviewCount}</div>
            <div className="kpi-tr">Total feedback</div>
          </div>

          {/* Status */}
          <div className="kpi">
            <div className="kpi-blob" style={{ background: 'var(--teal)' }} />
            <div className="kpi-ic" style={{ background: 'var(--teall)' }}>✅</div>
            <div className="kpi-lbl">Status</div>
            <div className="kpi-n kpi-n-sm">
              {MOCK_VENDOR.isOpen
                ? <span style={{ color: 'var(--green)' }}>Open ✅</span>
                : <span style={{ color: 'var(--coral)' }}>Closed ⛔</span>
              }
            </div>
            <div className="kpi-tr">Shop visibility</div>
          </div>
        </motion.div>

        {/* ── Recent Products ── */}
        <motion.div
          className="dcard"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="dcard-hd">
            <div className="dcard-t">Recent products</div>
            <button
              className="btn bg bsm"
              onClick={() => navigate('/dashboard/products')}
            >
              Manage all →
            </button>
          </div>

          {recentProducts.length > 0 ? (
            <div>
              {/* Table header */}
              <div className="pt-head">
                <div>Product</div>
                <div>Price</div>
                <div>Category</div>
                <div>Available</div>
                <div></div>
              </div>

              {/* Table rows */}
              {recentProducts.map(p => (
                <div key={p._id} className="pt-row">
                  <div className="pt-n">
                    <span className="pt-em">{p.emoji}</span>
                    {p.name}
                  </div>
                  <div className="pt-p">₹{p.price}</div>
                  <div style={{ color: 'var(--ink2)', fontSize: 13 }}>{p.category}</div>
                  <div>
                    <span
                      className={`badge ${p.available ? 'bg2' : 'bc2'}`}
                      style={{ fontSize: 10 }}
                    >
                      {p.available ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <span className="empty-em">📦</span>
              <h3>No products yet</h3>
              <p>Start by adding a product to your shop.</p>
            </div>
          )}
        </motion.div>

        {/* ── Recent Reviews ── */}
        <motion.div
          className="dcard"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="dcard-hd">
            <div className="dcard-t">Recent reviews</div>
            <button
              className="btn bg bsm"
              onClick={() => navigate('/dashboard/reviews')}
            >
              View all →
            </button>
          </div>

          {MOCK_RECENT_REVIEWS.length > 0 ? (
            MOCK_RECENT_REVIEWS.map(r => (
              <div key={r._id} className="rev-item">
                <div className="rev-hd">
                  <div className="rev-av" style={{ background: r.color || '#7C3AED' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="rev-name">{r.name}</div>
                    <div className="rev-dt">{new Date(r.date).toLocaleDateString()}</div>
                  </div>
                  <div className="rev-str">{'★'.repeat(r.rating)}</div>
                </div>
                <div className="rev-text">{r.comment}</div>
              </div>
            ))
          ) : (
            /* ── Exact empty-state copy from approved HTML ── */
            <div className="empty">
              <span className="empty-em">⭐</span>
              <h3>No reviews yet</h3>
              <p>Customer reviews will appear here.</p>
            </div>
          )}
        </motion.div>

      </main>
    </div>
  )
}