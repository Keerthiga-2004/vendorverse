// src/pages/Dashboard/Analytics.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './Analytics.css'

// ─── SIDEBAR ─────────────────────────────────────────────
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
      </div>
      <div className="sb-sec" style={{ marginTop: 8 }}>
        <span className="sb-lbl">Other</span>
        <button className="sb-a" onClick={() => navigate('/explore')}><span className="sb-ic">🔍</span>Explore</button>
        <button className="sb-a logout" onClick={logout}><span className="sb-ic">🚪</span>Logout</button>
      </div>
    </aside>
  )
}

// ─── MOCK DATA ────────────────────────────────────────────
const MONTHLY = {
  '7d': {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    revenue: [1200, 1800, 1400, 2200, 1900, 2800, 2400],
    orders:  [8, 12, 9, 15, 13, 19, 16],
  },
  '30d': {
    labels: ['W1','W2','W3','W4'],
    revenue: [14200, 18600, 16800, 22400],
    orders:  [94, 124, 112, 149],
  },
  '90d': {
    labels: ['Jan','Feb','Mar'],
    revenue: [48000, 54000, 72000],
    orders:  [320, 360, 479],
  },
}

const KPIS = {
  '7d':  { revenue: '₹13,700', orders: 92,    customers: 68,  sold: 184,  revTrend: '+12%', ordTrend: '+8%',  custTrend: '+15%', soldTrend: '+10%'  },
  '30d': { revenue: '₹72,000', orders: 479,   customers: 312, sold: 958,  revTrend: '+18%', ordTrend: '+14%', custTrend: '+22%', soldTrend: '+16%'  },
  '90d': { revenue: '₹1,74,000',orders:1159,  customers: 784, sold: 2318, revTrend: '+24%', ordTrend: '+19%', custTrend: '+28%', soldTrend: '+21%'  },
}

const TOP_PRODUCTS = [
  { _id:'tp1', name:'Masala Dosa',      emoji:'🥞', category:'Food',     sold:312, revenue: 18720 },
  { _id:'tp2', name:'Thali Meals',      emoji:'🍱', category:'Food',     sold:198, revenue: 23760 },
  { _id:'tp3', name:'Filter Coffee',    emoji:'☕', category:'Beverage', sold:184, revenue:  4600 },
  { _id:'tp4', name:'Idli Sambar',      emoji:'🍚', category:'Food',     sold:142, revenue:  7100 },
  { _id:'tp5', name:'Veg Puff',         emoji:'🥟', category:'Snacks',   sold:97,  revenue:  2910 },
]

const REV_SUMMARY = [
  { month: 'December 2024', revenue: '₹24,200', orders: 161, growth: '+18%', up: true  },
  { month: 'November 2024', revenue: '₹20,500', orders: 137, growth: '+11%', up: true  },
  { month: 'October 2024',  revenue: '₹18,400', orders: 123, growth: '-3%',  up: false },
  { month: 'September 2024',revenue: '₹19,000', orders: 127, growth: '+7%',  up: true  },
  { month: 'August 2024',   revenue: '₹17,700', orders: 118, growth: '+5%',  up: true  },
]

const ORD_SUMMARY = [
  { week: 'Dec 23 – Dec 29', orders: 49, avgValue: '₹150', status: '92% fulfilled' },
  { week: 'Dec 16 – Dec 22', orders: 42, avgValue: '₹144', status: '96% fulfilled' },
  { week: 'Dec 9 – Dec 15',  orders: 38, avgValue: '₹138', status: '89% fulfilled' },
  { week: 'Dec 2 – Dec 8',   orders: 32, avgValue: '₹160', status: '94% fulfilled' },
]

// ─── HELPERS ─────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.42, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
  })
}

function pct(val, max) { return max ? Math.round((val / max) * 100) : 0 }

// ─── BAR CHART ───────────────────────────────────────────
function BarChart({ data, labels, color = 'primary' }) {
  const max = Math.max(...data)
  return (
    <div className="bar-chart">
      {data.map((val, i) => {
        const h = max ? (val / max) * 100 : 0
        return (
          <div key={i} className="bar-group">
            <div className="bar-col-wrap">
              <div
                className={`bar-col${color === 'alt' ? ' alt' : ''}`}
                style={{ height: `${h}%` }}
              >
                <div className="bar-col-tooltip">
                  {typeof val === 'number' && val > 999 ? `₹${(val/1000).toFixed(1)}k` : val}
                </div>
              </div>
            </div>
            <div className="bar-label">{labels[i]}</div>
          </div>
        )
      })}
    </div>
  )
}

// ─── LINE CHART (SVG sparkline) ───────────────────────────
function LineChart({ data, color = '#7C3AED' }) {
  const W = 400; const H = 140; const PAD = 16
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((v, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: PAD + ((max - v) / range) * (H - PAD * 2),
  }))

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1]
    const cx = (prev.x + p.x) / 2
    return `${acc} C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`
  }, '')

  const fillD = `${pathD} L ${points[points.length-1].x} ${H} L ${points[0].x} ${H} Z`

  return (
    <div className="line-chart-wrap">
      <svg className="line-chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lc-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={fillD} fill="url(#lc-grad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} stroke="#fff" strokeWidth="2" />
        ))}
      </svg>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Analytics() {
  const [period, setPeriod] = useState('30d')
  const data = MONTHLY[period]
  const kpi  = KPIS[period]
  const maxSold = TOP_PRODUCTS[0]?.sold || 1

  return (
    <div className="an-wrap">
      <Sidebar />

      <main className="an-main">

        {/* ── Header ── */}
        <motion.div className="an-hd" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div>
            <div className="an-title">Analytics</div>
            <div className="an-sub">Track your shop's performance and growth</div>
          </div>
          <div className="an-period">
            {[['7d','7 days'],['30d','30 days'],['90d','90 days']].map(([val, lbl]) => (
              <button
                key={val}
                className={`an-period-btn${period === val ? ' on' : ''}`}
                onClick={() => setPeriod(val)}
              >
                {lbl}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── KPI Cards ── */}
        <motion.div className="an-kpi-row" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <div className="an-kpi">
            <div className="an-kpi-blob" style={{ background: '#7C3AED' }} />
            <div className="an-kpi-ic" style={{ background: 'var(--vl)' }}>💰</div>
            <div className="an-kpi-lbl">Revenue</div>
            <div className="an-kpi-n">{kpi.revenue}</div>
            <div className="an-kpi-tr up">↑ {kpi.revTrend} vs last period</div>
          </div>
          <div className="an-kpi">
            <div className="an-kpi-blob" style={{ background: 'var(--green)' }} />
            <div className="an-kpi-ic" style={{ background: 'var(--greenl)' }}>🛍️</div>
            <div className="an-kpi-lbl">Orders</div>
            <div className="an-kpi-n">{kpi.orders}</div>
            <div className="an-kpi-tr up">↑ {kpi.ordTrend} vs last period</div>
          </div>
          <div className="an-kpi">
            <div className="an-kpi-blob" style={{ background: 'var(--teal)' }} />
            <div className="an-kpi-ic" style={{ background: 'var(--teall)' }}>👥</div>
            <div className="an-kpi-lbl">Customers</div>
            <div className="an-kpi-n">{kpi.customers}</div>
            <div className="an-kpi-tr up">↑ {kpi.custTrend} vs last period</div>
          </div>
          <div className="an-kpi">
            <div className="an-kpi-blob" style={{ background: 'var(--amber)' }} />
            <div className="an-kpi-ic" style={{ background: 'var(--amberl)' }}>📦</div>
            <div className="an-kpi-lbl">Products Sold</div>
            <div className="an-kpi-n">{kpi.sold}</div>
            <div className="an-kpi-tr up">↑ {kpi.soldTrend} vs last period</div>
          </div>
        </motion.div>

        {/* ── Charts Row ── */}
        <motion.div className="an-chart-row" variants={fadeUp} initial="hidden" animate="visible" custom={2}>

          {/* Monthly Revenue Chart */}
          <div className="an-card" style={{ margin: 0 }}>
            <div className="an-card-hd">
              <div>
                <div className="an-card-title">Revenue</div>
                <div className="an-card-sub">₹ over selected period</div>
              </div>
            </div>
            <BarChart data={data.revenue} labels={data.labels} color="primary" />
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'linear-gradient(135deg,#7C3AED,#9333EA)' }} />
                Revenue (₹)
              </div>
            </div>
          </div>

          {/* Monthly Orders Chart */}
          <div className="an-card" style={{ margin: 0 }}>
            <div className="an-card-hd">
              <div>
                <div className="an-card-title">Orders</div>
                <div className="an-card-sub">Total orders over selected period</div>
              </div>
            </div>
            <BarChart data={data.orders} labels={data.labels} color="alt" />
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'linear-gradient(135deg,#10B981,#00C9B1)' }} />
                Orders
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Revenue Trend Line Chart ── */}
        <motion.div className="an-card" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
          <div className="an-card-hd">
            <div>
              <div className="an-card-title">Revenue trend</div>
              <div className="an-card-sub">Cumulative revenue curve</div>
            </div>
          </div>
          <LineChart data={data.revenue} color="#7C3AED" />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--ink3)', marginTop:6 }}>
            {data.labels.map(l => <span key={l}>{l}</span>)}
          </div>
        </motion.div>

        {/* ── Top Products + Revenue Summary (two col) ── */}
        <motion.div className="an-chart-row" variants={fadeUp} initial="hidden" animate="visible" custom={4}>

          {/* Top Selling Products */}
          <div className="an-card" style={{ margin: 0 }}>
            <div className="an-card-hd">
              <div className="an-card-title">Top selling products</div>
            </div>
            {TOP_PRODUCTS.map((p, i) => {
              const rankCls = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : 'rn'
              return (
                <div key={p._id} className="top-prod-row">
                  <div className={`top-prod-rank ${rankCls}`}>#{i+1}</div>
                  <div className="top-prod-em">{p.emoji}</div>
                  <div className="top-prod-info">
                    <div className="top-prod-name">{p.name}</div>
                    <div className="top-prod-bar">
                      <div className="top-prod-bar-fill" style={{ width: `${pct(p.sold, maxSold)}%` }} />
                    </div>
                    <div className="top-prod-cat">{p.category}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div className="top-prod-num">₹{p.revenue.toLocaleString()}</div>
                    <div className="top-prod-sold">{p.sold} sold</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Orders Summary */}
          <div className="an-card" style={{ margin: 0 }}>
            <div className="an-card-hd">
              <div className="an-card-title">Orders summary</div>
            </div>
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Orders</th>
                  <th>Avg value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ORD_SUMMARY.map((row, i) => (
                  <tr key={i}>
                    <td className="td-name" style={{ fontSize:12 }}>{row.week}</td>
                    <td className="td-num">{row.orders}</td>
                    <td className="td-rev">{row.avgValue}</td>
                    <td><span className="badge bg2" style={{ fontSize:10 }}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Revenue Summary Table ── */}
        <motion.div className="an-card" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <div className="an-card-hd">
            <div className="an-card-title">Monthly revenue summary</div>
          </div>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {REV_SUMMARY.map((row, i) => (
                <tr key={i}>
                  <td className="td-name">{row.month}</td>
                  <td className="td-rev">{row.revenue}</td>
                  <td className="td-num">{row.orders}</td>
                  <td>
                    <span
                      className={`badge ${row.up ? 'bg2' : 'bc2'}`}
                      style={{ fontSize: 10 }}
                    >
                      {row.up ? '↑' : '↓'} {row.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </main>
    </div>
  )
}