// src/pages/Dashboard/Reviews.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './Reviews.css'

// ─── SIDEBAR ─────────────────────────────────────────────
function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="rlg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#F72585" />
        </linearGradient>
        <linearGradient id="rlg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAB00" /><stop offset="100%" stopColor="#00C9B1" />
        </linearGradient>
      </defs>
      <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="rgba(124,58,237,.1)" stroke="url(#rlg1)" strokeWidth="1.8" />
      <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13" stroke="url(#rlg2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.8" fill="url(#rlg1)" />
    </svg>
  )
}

function Sidebar({ active }) {
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
        <button className={`sb-a${active === 'overview'  ? ' on' : ''}`} onClick={() => navigate('/dashboard')}><span className="sb-ic">📊</span>Overview</button>
        <button className={`sb-a${active === 'products'  ? ' on' : ''}`} onClick={() => navigate('/dashboard/products')}><span className="sb-ic">📦</span>Products</button>
        <button className={`sb-a${active === 'shop'      ? ' on' : ''}`} onClick={() => navigate('/dashboard/shop')}><span className="sb-ic">🏪</span>My Shop</button>
        <button className={`sb-a${active === 'reviews'   ? ' on' : ''}`} onClick={() => navigate('/dashboard/reviews')}><span className="sb-ic">⭐</span>Reviews</button>
      </div>
      <div className="sb-sec" style={{ marginTop: 8 }}>
        <span className="sb-lbl">Other</span>
        <button className="sb-a" onClick={() => navigate('/explore')}><span className="sb-ic">🔍</span>Explore</button>
        <button className="sb-a logout" onClick={logout}><span className="sb-ic">🚪</span>Logout</button>
      </div>
    </aside>
  )
}

// ─── MOCK REVIEWS ─────────────────────────────────────────
const INIT_REVIEWS = [
  { _id: 'r1', name: 'Priya Sharma',    initial: 'P', color: '#F72585', rating: 5, date: '2024-12-10', text: 'Absolutely love this place! The Masala Dosa is crispy and perfectly spiced every single time. My go-to breakfast spot in Coimbatore.', reply: null },
  { _id: 'r2', name: 'Arun Murugan',    initial: 'A', color: '#7C3AED', rating: 5, date: '2024-12-08', text: 'Filter coffee here is unbeatable. The aroma alone is worth the visit. Highly recommend to anyone who appreciates authentic South Indian coffee.', reply: "Thank you so much Arun! We're so happy you enjoy our filter coffee. See you again soon! ☕" },
  { _id: 'r3', name: 'Kavitha R.',       initial: 'K', color: '#10B981', rating: 4, date: '2024-12-05', text: 'Really good food, very hygienic and fresh. The thali is wholesome and filling. Service was prompt. Would definitely come again.', reply: null },
  { _id: 'r4', name: 'Suresh Kumar',    initial: 'S', color: '#F59E0B', rating: 4, date: '2024-11-30', text: 'Good food overall. The idli sambar combo was excellent but had to wait a bit during peak hours. Worth the wait though!', reply: null },
  { _id: 'r5', name: 'Meena Devi',      initial: 'M', color: '#3B82F6', rating: 3, date: '2024-11-25', text: 'Food is decent. Pricing is reasonable for the portion size. Parking was a bit difficult on weekends.', reply: "Thank you for the honest feedback Meena! We are working on improving the weekend experience. 🙏" },
  { _id: 'r6', name: 'Rajan Pillai',    initial: 'R', color: '#00C9B1', rating: 5, date: '2024-11-20', text: 'Traditional taste, just like home! The banana leaf meals on Sundays are extraordinary. Best South Indian food in the city.', reply: null },
  { _id: 'r7', name: 'Deepa Nair',      initial: 'D', color: '#8B5CF6', rating: 4, date: '2024-11-15', text: 'Loved the ambience and the food quality is consistently good. The cold coffee was refreshing. Will be back with family.', reply: null },
]

const AVATAR_COLORS = ['#7C3AED','#F72585','#10B981','#F59E0B','#3B82F6','#FF5757','#00C9B1','#8B5CF6']

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.42, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } })
}

// ─── HELPERS ─────────────────────────────────────────────
function starStr(n) { return '★'.repeat(n) + '☆'.repeat(5 - n) }
function avgRating(reviews) {
  if (!reviews.length) return 0
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
}
function ratingBreakdown(reviews) {
  return [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0
  }))
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function Reviews() {
  const [reviews, setReviews]     = useState(INIT_REVIEWS)
  const [search, setSearch]       = useState('')
  const [ratingFilter, setRatingFilter] = useState('All')

  // reply modal state
  const [replyTarget, setReplyTarget] = useState(null)
  const [replyText, setReplyText]     = useState('')

  // ── filtered ───────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return reviews.filter(r => {
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q)
      const matchRating = ratingFilter === 'All' || r.rating === Number(ratingFilter)
      return matchSearch && matchRating
    })
  }, [reviews, search, ratingFilter])

  const avg       = avgRating(reviews)
  const breakdown = ratingBreakdown(reviews)

  // ── reply handlers ─────────────────────────────────────
  const openReply  = (r) => { setReplyTarget(r); setReplyText(r.reply || '') }
  const closeReply = () => { setReplyTarget(null); setReplyText('') }
  const saveReply  = () => {
    if (!replyText.trim()) return
    setReviews(rs => rs.map(r => r._id === replyTarget._id ? { ...r, reply: replyText.trim() } : r))
    closeReply()
  }

  return (
    <div className="rev-wrap">
      <Sidebar active="reviews" />

      <main className="rev-main">
        {/* ── Header ── */}
        <motion.div className="rev-hd-row" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div>
            <div className="rev-page-title">Reviews</div>
            <div className="rev-page-sub">Customer feedback for your shop</div>
          </div>
        </motion.div>

        {/* ── Summary Row: Rating Card + Breakdown ── */}
        <motion.div className="rev-summary-row" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          {/* Average rating */}
          <div className="rev-rating-card">
            <div className="rev-big-num">{avg}</div>
            <div className="rev-big-stars">{starStr(Math.round(Number(avg)))}</div>
            <div className="rev-big-count">{reviews.length} total reviews</div>
          </div>

          {/* Breakdown bars */}
          <div className="rev-breakdown-card">
            <div className="rev-bd-title">Rating breakdown</div>
            {breakdown.map(({ star, count, pct }) => (
              <div key={star} className="rev-bar-row">
                <div className="rev-bar-label">{star}</div>
                <div className="rev-bar-star">★</div>
                <div className="rev-bar-track">
                  <div className="rev-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="rev-bar-count">{count}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Controls ── */}
        <motion.div className="rev-controls" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <div className="rev-search">
            <span>🔍</span>
            <input
              placeholder="Search by customer name or review text…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="rev-select" value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
            <option value="All">All ratings</option>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </motion.div>

        <div className="rev-result-count">
          Showing {filtered.length} review{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* ── Review Cards ── */}
        {filtered.length > 0 ? (
          <div className="rev-card-list">
            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.div
                  key={r._id}
                  className="rev-card"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.38 } }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                >
                  {/* card header */}
                  <div className="rev-card-hd">
                    <div className="rev-card-av" style={{ background: r.color || AVATAR_COLORS[0] }}>
                      {r.initial}
                    </div>
                    <div className="rev-card-meta">
                      <div className="rev-card-name">{r.name}</div>
                      <div className="rev-card-date">
                        {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="rev-card-stars">{starStr(r.rating)}</div>
                  </div>

                  {/* review text */}
                  <div className="rev-card-text">"{r.text}"</div>

                  {/* existing reply block */}
                  {r.reply && (
                    <div className="rev-reply-block">
                      <div className="rev-reply-label">Your reply</div>
                      <div className="rev-reply-text">{r.reply}</div>
                    </div>
                  )}

                  {/* footer */}
                  <div className="rev-card-foot">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`rev-card-tag ${r.rating >= 4 ? 'bg2' : r.rating === 3 ? 'ba' : 'bc2'}`}>
                        {r.rating >= 4 ? '👍 Positive' : r.rating === 3 ? '😐 Neutral' : '👎 Negative'}
                      </span>
                    </div>
                    <button className="btn bg bsm" onClick={() => openReply(r)}>
                      {r.reply ? '✏️ Edit reply' : '💬 Reply'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="rev-empty">
            <span className="rev-empty-em">⭐</span>
            <h3>No reviews found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </main>

      {/* ── Reply Modal ── */}
      <AnimatePresence>
        {replyTarget && (
          <motion.div className="rm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="rm-modal"
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0 }}
            >
              <div className="rm-hd">
                <div className="rm-title">Reply to {replyTarget.name}</div>
                <button className="rm-close" onClick={closeReply}>✕</button>
              </div>

              <div className="rm-quote">"{replyTarget.text}"</div>

              <label className="rm-label">Your reply</label>
              <textarea
                className="rm-textarea"
                placeholder="Write a helpful, friendly reply…"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />

              <div className="rm-foot">
                <button className="btn bg bsm" onClick={closeReply}>Cancel</button>
                <button className="btn bp bsm" onClick={saveReply}>Post reply</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}