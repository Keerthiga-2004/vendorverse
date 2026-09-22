// src/pages/Dashboard/Analytics.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './Analytics.css'

// ─── SIDEBAR (unchanged) ──────────────────────────────────
function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="alg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#F72585" />
        </linearGradient>
        <linearGradient id="alg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAB00" /><stop offset="100%" stopColor="#00C9B1" />
        </linearGradient>
      </defs>
      <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="rgba(124,58,237,.1)" stroke="url(#alg1)" strokeWidth="1.8" />
      <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13" stroke="url(#alg2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.8" fill="url(#alg1)" />
    </svg>
  )
}

function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="logo-link" onClick={() => navigate('/')}>
          <SidebarLogo />
          <span className="sb-logo-txt">Vendor<b>Verse</b></span>
        </div>
      </div>
      <div className="sb-sec">
        <span className="sb-lbl">Main</span>
        <button className="sb-a" onClick={() => navigate('/dashboard')}><span className="sb-ic">📊</span>Overview</button>
        <button className="sb-a" onClick={() => navigate('/dashboard/products')}><span className="sb-ic">📦</span>Products</button>
        <button className="sb-a" onClick={() => navigate('/dashboard/shop')}><span className="sb-ic">🏪</span>My Shop</button>
        <button className="sb-a" onClick={() => navigate('/dashboard/reviews')}><span className="sb-ic">⭐</span>Reviews</button>
        <button
  className="sb-a"
  onClick={() => navigate('/dashboard/analytics')}
>
  <span className="sb-ic">📈</span>Analytics
</button>
      </div>
      <div className="sb-sec" style={{ marginTop: 8 }}>
        <span className="sb-lbl">Other</span>
        <button className="sb-a" onClick={() => navigate('/explore')}><span className="sb-ic">🔍</span>Explore</button>
        <button className="sb-a logout" onClick={logout}><span className="sb-ic">🚪</span>Logout</button>
      </div>
    </aside>
  )
}

// ─── ANIMATION ────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.42, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

// ─── BAR CHART (CSS-drawn, no external library) ──────────
function BarChart({ data, labelKey, valueKey, color = '#7C3AED', altColor = null }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, paddingTop: 12 }}>
      {data.map((item, i) => {
        const heightPct = max > 0 ? (item[valueKey] / max) * 100 : 0
        const bg = altColor && i % 2 === 0 ? altColor : color
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 6, height: '100%' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
              <div
                title={`${item[labelKey]}: ${item[valueKey]}`}
                style={{
                  width: '100%',
                  height: `${heightPct}%`,
                  minHeight: item[valueKey] > 0 ? 4 : 0,
                  background: bg,
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                  cursor: 'default',
                  position: 'relative',
                }}
              >
                {item[valueKey] > 0 && (
                  <div style={{
                    position: 'absolute', bottom: 'calc(100% + 4px)',
                    left: '50%', transform: 'translateX(-50%)',
                    fontSize: 10, fontWeight: 700, color: 'var(--ink)',
                    whiteSpace: 'nowrap',
                  }}>
                    {item[valueKey]}
                  </div>
                )}
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink3)', fontWeight: 600, textAlign: 'center' }}>
              {item[labelKey]}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── STAR DISPLAY ─────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={{ color: '#F59E0B', letterSpacing: -1 }}>
      {'★'.repeat(Math.round(rating || 0))}
      {'☆'.repeat(5 - Math.round(rating || 0))}
    </span>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Analytics() {
  const navigate = useNavigate()

  // ✅ CHANGED: real data state
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // ✅ ADDED: fetch real analytics from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get('/products/analytics')
        setData(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  // ─── Loading state ────────────────────────────────────
  if (loading) {
    return (
      <div className="an-wrap">
        <Sidebar />
        <main className="an-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--v)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
            <span style={{ fontSize: 14, color: 'var(--ink3)' }}>Loading analytics…</span>
          </div>
        </main>
      </div>
    )
  }

  // ─── Error state ──────────────────────────────────────
  if (error) {
    return (
      <div className="an-wrap">
        <Sidebar />
        <main className="an-main">
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{error}</div>
            <button className="btn bp bsm" onClick={() => window.location.reload()}>Try again</button>
          </div>
        </main>
      </div>
    )
  }

  // ─── Shorthand refs to real data ─────────────────────
  const P = data.products   // product analytics
  const R = data.reviews    // review analytics

  // ─── RENDER ───────────────────────────────────────────
  return (
    <div className="an-wrap">
      <Sidebar />

      <main className="an-main">

        {/* HEADER */}
        <motion.div className="an-hd" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div>
            <div className="an-title">Analytics</div>
            <div className="an-sub">Real data from your shop</div>
          </div>
        </motion.div>

        {/* ── KPI CARDS (real data) ── */}
        <motion.div className="an-kpi-row" variants={fadeUp} initial="hidden" animate="visible" custom={1}>

          <div className="an-kpi">
            <div className="an-kpi-blob" style={{ background: '#7C3AED' }} />
            <div className="an-kpi-ic" style={{ background: 'var(--vl)' }}>📦</div>
            <div className="an-kpi-lbl">Total Products</div>
            <div className="an-kpi-n">{P.total}</div>
            <div className="an-kpi-tr up">{P.available} available</div>
          </div>

          <div className="an-kpi">
            <div className="an-kpi-blob" style={{ background: 'var(--green)' }} />
            <div className="an-kpi-ic" style={{ background: 'var(--greenl)' }}>✅</div>
            <div className="an-kpi-lbl">Available</div>
            <div className="an-kpi-n">{P.available}</div>
            <div className="an-kpi-tr up">
              {P.total > 0 ? Math.round((P.available / P.total) * 100) : 0}% of products
            </div>
          </div>

          <div className="an-kpi">
            <div className="an-kpi-blob" style={{ background: 'var(--amber)' }} />
            <div className="an-kpi-ic" style={{ background: 'var(--amberl)' }}>⭐</div>
            <div className="an-kpi-lbl">Avg Rating</div>
            <div className="an-kpi-n">{R.averageRating > 0 ? R.averageRating : '—'}</div>
            <div className="an-kpi-tr up">{R.total} reviews total</div>
          </div>

          <div className="an-kpi">
            <div className="an-kpi-blob" style={{ background: 'var(--pink)' }} />
            <div className="an-kpi-ic" style={{ background: 'var(--pinkl)' }}>💬</div>
            <div className="an-kpi-lbl">Total Reviews</div>
            <div className="an-kpi-n">{R.total}</div>
            <div className="an-kpi-tr up">
              {R.total > 0
                ? `${R.breakdown.find(b => b.star === 5)?.count || 0} five-star`
                : 'No reviews yet'}
            </div>
          </div>

        </motion.div>

        {/* ── CHARTS ROW ── */}
        <motion.div className="an-chart-row" variants={fadeUp} initial="hidden" animate="visible" custom={2}>

          {/* Reviews per month */}
          <div className="an-card" style={{ margin: 0 }}>
            <div className="an-card-hd">
              <div>
                <div className="an-card-title">Reviews over time</div>
                <div className="an-card-sub">Last 6 months</div>
              </div>
            </div>
            {R.byMonth.every(m => m.count === 0) ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink3)', fontSize: 13 }}>
                No reviews yet
              </div>
            ) : (
              <BarChart
                data={R.byMonth}
                labelKey="month"
                valueKey="count"
                color="linear-gradient(180deg, #7C3AED, #9333EA)"
              />
            )}
          </div>

          {/* Products added per month */}
          <div className="an-card" style={{ margin: 0 }}>
            <div className="an-card-hd">
              <div>
                <div className="an-card-title">Products added over time</div>
                <div className="an-card-sub">Last 6 months</div>
              </div>
            </div>
            {P.byMonth.every(m => m.count === 0) ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink3)', fontSize: 13 }}>
                No products added yet
              </div>
            ) : (
              <BarChart
                data={P.byMonth}
                labelKey="month"
                valueKey="count"
                color="linear-gradient(180deg, #10B981, #00C9B1)"
              />
            )}
          </div>

        </motion.div>

        {/* ── BOTTOM ROW ── */}
        <motion.div className="an-chart-row" variants={fadeUp} initial="hidden" animate="visible" custom={3}>

          {/* Products by category */}
          <div className="an-card" style={{ margin: 0 }}>
            <div className="an-card-hd">
              <div className="an-card-title">Products by category</div>
            </div>
            {P.byCategory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink3)', fontSize: 13 }}>
                No products yet
              </div>
            ) : (
              <div>
                {P.byCategory.map((item, i) => (
                  <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < P.byCategory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: i === 0 ? 'var(--amberl)' : i === 1 ? 'var(--vl)' : 'var(--greenl)',
                      color:      i === 0 ? '#B45309' : i === 1 ? 'var(--v)' : 'var(--green)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                    }}>
                      #{i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{item.category}</div>
                      <div style={{ height: 5, background: 'var(--bg)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.round((item.count / P.total) * 100)}%`,
                          background: 'linear-gradient(90deg, #7C3AED, #F72585)',
                          borderRadius: 99,
                        }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--v)', flexShrink: 0 }}>
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rating breakdown */}
          <div className="an-card" style={{ margin: 0 }}>
            <div className="an-card-hd">
              <div className="an-card-title">Rating breakdown</div>
            </div>
            {R.total === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink3)', fontSize: 13 }}>
                No reviews yet
              </div>
            ) : (
              <div>
                {/* Summary */}
                <div style={{ textAlign: 'center', marginBottom: 20, padding: '16px', background: 'linear-gradient(135deg, var(--vl), #FFF0F6)', borderRadius: 14 }}>
                  <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -2, background: 'linear-gradient(135deg, #7C3AED, #F72585)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
                    {R.averageRating}
                  </div>
                  <div style={{ fontSize: 18, color: '#F59E0B', margin: '6px 0 4px' }}>
                    {'★'.repeat(Math.round(R.averageRating))}{'☆'.repeat(5 - Math.round(R.averageRating))}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink3)' }}>{R.total} reviews</div>
                </div>

                {/* Per-star bars */}
                {R.breakdown.map(({ star, count }) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink2)', width: 14, textAlign: 'right', flexShrink: 0 }}>{star}</div>
                    <div style={{ fontSize: 12, color: '#F59E0B', flexShrink: 0 }}>★</div>
                    <div style={{ flex: 1, height: 8, background: 'var(--bg)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: R.total > 0 ? `${Math.round((count / R.total) * 100)}%` : '0%',
                        background: 'linear-gradient(90deg, #7C3AED, #F72585)',
                        borderRadius: 99,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink3)', fontWeight: 600, width: 20, textAlign: 'right', flexShrink: 0 }}>{count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </motion.div>

        {/* ── TOP PRODUCTS BY PRICE ── */}
        {P.topByPrice.length > 0 && (
          <motion.div className="an-card" variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <div className="an-card-hd">
              <div className="an-card-title">Top products by price</div>
            </div>
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {P.topByPrice.map((p, i) => (
                  <tr key={p._id}>
                    <td>
                      <span style={{
                        width: 24, height: 24, borderRadius: 7, display: 'inline-flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800,
                        background: i === 0 ? 'var(--amberl)' : i === 1 ? 'var(--vl)' : 'var(--greenl)',
                        color:      i === 0 ? '#B45309' : i === 1 ? 'var(--v)' : 'var(--green)',
                      }}>
                        #{i + 1}
                      </span>
                    </td>
                    <td className="td-name">{p.name}</td>
                    <td style={{ color: 'var(--ink2)', fontSize: 13 }}>{p.category}</td>
                    <td className="td-rev">₹{p.price}</td>
                    <td className="td-badge">
                      <span className={`badge ${p.available ? 'bg2' : 'bc2'}`} style={{ fontSize: 10 }}>
                        {p.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* ── RECENT REVIEWS ── */}
        {R.recent.length > 0 && (
          <motion.div className="an-card" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <div className="an-card-hd">
              <div className="an-card-title">Recent reviews</div>
              <button className="btn bg bsm" onClick={() => navigate('/dashboard/reviews')}>
                View all →
              </button>
            </div>
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {R.recent.map(r => (
                  <tr key={r._id}>
                    <td className="td-name">{r.customerName}</td>
                    <td><Stars rating={r.rating} /></td>
                    <td style={{ color: 'var(--ink2)', fontSize: 13, maxWidth: 260 }}>
                      {r.comment.length > 60 ? r.comment.slice(0, 60) + '…' : r.comment}
                    </td>
                    <td style={{ color: 'var(--ink3)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* ── EMPTY STATE (fresh vendor with no data yet) ── */}
        {P.total === 0 && R.total === 0 && (
          <motion.div className="an-card" style={{ textAlign: 'center', padding: '60px 24px' }} variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📊</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 8 }}>No data yet</div>
            <div style={{ fontSize: 14, color: 'var(--ink3)', marginBottom: 24, lineHeight: 1.6 }}>
              Add products and get customer reviews to see your analytics here.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn bp bsm" onClick={() => navigate('/dashboard/products')}>+ Add products</button>
              <button className="btn bg bsm" onClick={() => navigate('/dashboard/shop')}>Complete your profile</button>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  )
}