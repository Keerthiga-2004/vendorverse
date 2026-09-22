// src/pages/VendorDetail/VendorDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import VendorCard from '../../components/ui/VendorCard'
import api from '../../services/api'
import toast from 'react-hot-toast'
import './VendorDetail.css'

// ─── ANIMATION VARIANTS ───────────────────────────────────
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

// ─── CATEGORY → COVER GRADIENT ───────────────────────────
const CATEGORY_BG = {
  'Food & Beverages':   'linear-gradient(135deg,#FFF4EE,#FFF0F0)',
  'Grocery':            'linear-gradient(135deg,#F0FDF9,#E6FAF8)',
  'Tailoring':          'linear-gradient(135deg,#F5F0FF,#EDE9FE)',
  'Beauty & Wellness':  'linear-gradient(135deg,#FFF0F6,#F5F3FF)',
  'Electronics Repair': 'linear-gradient(135deg,#FFF8E1,#FFF3E0)',
  'Home Repair':        'linear-gradient(135deg,#FFF3E0,#FFF0F0)',
  'Electrician':        'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
  'Bakery':             'linear-gradient(135deg,#E6FAF8,#ECFDF5)',
  'Local Services':     'linear-gradient(135deg,#EFF6FF,#F5F0FF)',
}

// ─── CATEGORY SVG ICONS ──────────────────────────────────
const CATEGORY_ICONS = {
  'Food & Beverages': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(242,92,84,0.15)"/>
      <path d="M18 20c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#F25C54" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 20v12" stroke="#F25C54" strokeWidth="2" strokeLinecap="round"/>
      <rect x="28" y="16" width="6" height="4" rx="1" fill="#F25C54"/>
      <path d="M31 20v12" stroke="#F25C54" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 34h18" stroke="#F25C54" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'Grocery': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(16,185,129,0.15)"/>
      <path d="M16 18h3l2.5 10h11l2-7H20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="23" cy="31" r="2" fill="#10B981"/>
      <circle cx="33" cy="31" r="2" fill="#10B981"/>
    </svg>
  ),
  'Tailoring': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(124,58,237,0.15)"/>
      <path d="M26 16l-6 8h12l-6-8z" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M20 24l-3 12h18l-3-12" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  'Beauty & Wellness': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(244,63,94,0.15)"/>
      <path d="M26 15c-4 0-7 2.5-7 7 0 5 7 14 7 14s7-9 7-14c0-4.5-3-7-7-7z" fill="#F43F5E" opacity="0.2" stroke="#F43F5E" strokeWidth="2"/>
      <circle cx="26" cy="22" r="3" fill="#F43F5E"/>
    </svg>
  ),
  'Electronics Repair': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(245,158,11,0.15)"/>
      <rect x="17" y="20" width="18" height="13" rx="2" stroke="#F59E0B" strokeWidth="2"/>
      <path d="M22 20v-3M30 20v-3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'Home Repair': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(249,115,22,0.15)"/>
      <path d="M18 24l8-8 8 8v12H18V24z" stroke="#F97316" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="23" y="28" width="6" height="8" rx="1" stroke="#F97316" strokeWidth="1.5"/>
    </svg>
  ),
  'Electrician': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(139,92,246,0.15)"/>
      <path d="M28 15l-6 11h6l-4 11 10-13h-6l4-9h-4z" fill="#8B5CF6" opacity="0.25" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  'Bakery': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(5,150,105,0.15)"/>
      <path d="M18 30c0-4.4 3.6-8 8-8s8 3.6 8 8H18z" stroke="#059669" strokeWidth="2"/>
      <rect x="16" y="30" width="20" height="6" rx="2" stroke="#059669" strokeWidth="2"/>
    </svg>
  ),
  'Local Services': (
    <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="rgba(59,130,246,0.15)"/>
      <path d="M26 15c-5 0-9 4-9 9 0 6.5 9 13 9 13s9-6.5 9-13c0-5-4-9-9-9z" stroke="#3B82F6" strokeWidth="2"/>
      <circle cx="26" cy="24" r="4" stroke="#3B82F6" strokeWidth="2"/>
    </svg>
  ),
}

// ─── DEFAULT HERO ICON (storefront, not a lock) ──────────
const DEFAULT_HERO_ICON = (
  <svg width="96" height="96" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="22" fill="rgba(91,63,248,0.15)"/>
    <path d="M14 24h24M14 24v14h24V24" stroke="#5B3FF8" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 24l3-8h22l3 8" stroke="#5B3FF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="21" y="28" width="10" height="10" rx="1" fill="#5B3FF8" opacity="0.2" stroke="#5B3FF8" strokeWidth="1.5"/>
  </svg>
)

// ─── AVATAR COLOURS ───────────────────────────────────────
const AVATAR_COLORS = [
  '#7C3AED','#F72585','#10B981','#F59E0B',
  '#3B82F6','#FF5757','#00C9B1','#8B5CF6',
]
function getAvatarColor(name = '') {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]
}

// ─── STAR SELECTOR ────────────────────────────────────────
function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          style={{ fontSize: 28, cursor: 'pointer', color: n <= (hovered || value) ? '#F59E0B' : '#D1D5DB', transition: 'color .15s', userSelect: 'none' }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >★</span>
      ))}
    </div>
  )
}

// ─── LOADING STATE ────────────────────────────────────────
function LoadingState() {
  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ height: 300, background: 'linear-gradient(135deg,#EDE9FE,#F5F0FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(124,58,237,.2)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin .9s linear infinite' }} />
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function VendorDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Vendor data
  const [vendor,     setVendor]     = useState(null)
  const [allVendors, setAllVendors] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // Products — real API fetch
  const [products,        setProducts]        = useState([])
  const [productsLoading, setProductsLoading] = useState(true)

  // Reviews
  const [reviews,        setReviews]        = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)

  // Write review
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating,      setNewRating]      = useState(0)
  const [newComment,     setNewComment]     = useState('')
  const [submitting,     setSubmitting]     = useState(false)

  // Vendor reply modal
  const [replyTarget, setReplyTarget] = useState(null)
  const [replyText,   setReplyText]   = useState('')
  const [replying,    setReplying]    = useState(false)

  // Fetch vendor by ID
  const fetchVendor = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get(`/users/vendors/${id}`)
      setVendor(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendor')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all vendors for similar section
  const fetchAllVendors = async () => {
    try {
      const { data } = await api.get('/users/vendors')
      setAllVendors(Array.isArray(data) ? data : [])
    } catch {
      setAllVendors([])
    }
  }

  // Fetch real products for this vendor
  // Uses GET /api/products?vendor=:id — shows public product listing
  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
          const { data } = await api.get(`/products/vendor/${id}`)
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  // Fetch real reviews
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      const { data } = await api.get(`/reviews/${id}`)
      setReviews(Array.isArray(data) ? data : [])
    } catch {
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  useEffect(() => {
    fetchVendor()
    fetchAllVendors()
    fetchProducts()
    fetchReviews()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Submit review
  const handleSubmitReview = async () => {
    if (newRating === 0) { toast.error('Please select a star rating'); return }
    if (newComment.trim().length < 5) { toast.error('Please write at least 5 characters'); return }
    try {
      setSubmitting(true)
      const { data } = await api.post(`/reviews/${id}`, { rating: newRating, comment: newComment.trim() })
      setReviews(prev => [data.review, ...prev])
      setNewRating(0)
      setNewComment('')
      setShowReviewForm(false)
      toast.success('Review submitted! Thank you 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  // Vendor reply
  const handleReply = async () => {
    if (!replyText.trim()) { toast.error('Reply cannot be empty'); return }
    try {
      setReplying(true)
      const { data } = await api.put(`/reviews/${replyTarget._id}/reply`, { reply: replyText.trim() })
      setReviews(prev => prev.map(r => r._id === replyTarget._id ? data.review : r))
      setReplyTarget(null)
      setReplyText('')
      toast.success('Reply posted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post reply')
    } finally {
      setReplying(false)
    }
  }

  // ─── RENDER STATES ──────────────────────────────────────
  if (loading) return <LoadingState />

  if (error) {
    return (
      <div className="wrap" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="empty">
          <div className="empty-em">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
            <button className="btn bp bsm" onClick={fetchVendor}>Try again</button>
            <button className="btn bg bsm" onClick={() => navigate('/explore')}>← Back to explore</button>
          </div>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="wrap" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="empty">
          <div className="empty-em">🔍</div>
          <h3>Vendor not found</h3>
          <p>This vendor may have been removed or doesn't exist.</p>
          <button className="btn bp bsm" onClick={() => navigate('/explore')} style={{ marginTop: 20 }}>
            ← Back to explore
          </button>
        </div>
      </div>
    )
  }

  // ─── DESTRUCTURE SAFELY ──────────────────────────────────
  const {
    shopName     = '',
    category     = '',
    city         = '',
    openingHours = '',
    isOpen       = false,
    description  = '',
    address      = '',
    phone        = '',
    isVerified   = false,
    rating       = 0,
    reviewCount  = 0,
    lat, lng,
  } = vendor

  const coverBg      = CATEGORY_BG[category] || 'linear-gradient(135deg,#EDE9FE,#F5F0FF)'
  const heroIcon     = CATEGORY_ICONS[category] || DEFAULT_HERO_ICON
  const whatsappLink = `https://wa.me/91${phone}?text=${encodeURIComponent(`Hi ${shopName}, I found you on VendorVerse!`)}`
  const mapsLink     = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${city}`)}`
  const mapEmbedSrc  = lat && lng
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(`${address || ''} ${city || ''}`.trim())}&output=embed`

  const similar      = allVendors.filter(v => v._id !== id && v.category === category).slice(0, 3)
  const liveAvg      = reviews.length
    ? (reviews.reduce((s,r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : (rating > 0 ? Number(rating).toFixed(1) : null)
  const hasReviewed  = user && reviews.some(r => r.customer?._id === user._id)

  return (
    <div className="page-vendor-detail" style={{ paddingTop: 68 }}>

      {/* ── HERO ── */}
      <div className="vd-hero" style={{ background: coverBg }}>
        <div style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 28px rgba(0,0,0,.12))', transform: 'scale(1.05)' }}>
          {heroIcon}
        </div>
        <div className="vd-ov" />
        <div className="vd-ct">
          <div className="wrap">
            {isVerified && (
              <div style={{ marginBottom: 10, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 100, background: 'rgba(16,185,129,.15)', color: '#34D399', fontSize: 11, fontWeight: 700 }}>
                ✓ Verified vendor
              </div>
            )}
            <div className="vd-name">{shopName || 'Shop'}</div>
            <div className="vd-meta">
              {category && <span>📂 {category}</span>}
              {liveAvg && <span>⭐ {liveAvg} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>}
              {(address || city) && <span>📍 {[address, city].filter(Boolean).join(', ')}</span>}
              {openingHours && <span>🕐 {openingHours}</span>}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: isOpen ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: isOpen ? '#34D399' : '#F87171' }}>
                ● {isOpen ? 'Open now' : 'Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="wrap">
        <div className="vd-body">

          {/* MAIN COLUMN */}
          <div>

            {/* About */}
            <div className="vd-card">
              <div className="vd-card-t">About this shop</div>
              <p style={{ color: 'var(--ink2)', fontSize: 14, lineHeight: 1.8, marginBottom: description ? 16 : 0 }}>
                {description || (
                  <span style={{ color: 'var(--ink3)', fontStyle: 'italic' }}>
                    This vendor hasn't added a description yet.
                  </span>
                )}
              </p>
              {(phone || address) && (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
                  {phone && <span style={{ fontSize: 13, color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: 5 }}>📞 {phone}</span>}
                  {address && <span style={{ fontSize: 13, color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: 5 }}>📍 {address}</span>}
                </div>
              )}

              {/* Map embed — only if address or city exists */}
              {(address || city) && (
                <div style={{ marginTop: 20, borderRadius: 14, overflow: 'hidden', border: '1.5px solid var(--border)' }}>
                  <iframe
                    title={`Map for ${shopName}`}
                    width="100%" height="200"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbedSrc}
                  />
                  <div style={{ padding: '8px 14px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--ink3)' }}>📍 {[address, city].filter(Boolean).join(', ')}</span>
                    <a href={mapsLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: 'var(--v)', textDecoration: 'none' }}>
                      Open in Maps →
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Products & Services — REAL data from API */}
            <div className="vd-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="vd-card-t" style={{ margin: 0 }}>Products & Services</div>
                {!productsLoading && (
                  <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'var(--vl)', color: 'var(--v)' }}>
                    {products.length} item{products.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {productsLoading ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink3)', fontSize: 13 }}>Loading products…</div>
              ) : products.length > 0 ? (
                <div className="pgrid">
                  {products.map(p => (
                    <div key={p._id} className="pc">
                      <div className="pc-img" style={{ background: p.image ? 'transparent' : (CATEGORY_BG[category] || 'var(--bg)') }}>
                        {p.image
                          ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 36 }}>📦</span>
                        }
                      </div>
                      <div className="pc-body">
                        <div className="pc-n">{p.name}</div>
                        {p.description && <div className="pc-d">{p.description.slice(0, 60)}{p.description.length > 60 ? '…' : ''}</div>}
                        <div className="pc-ft">
                          <div>
                            <div className="pc-p">₹{p.price}</div>
                            {p.unit && <div className="pc-u">{p.unit}</div>}
                          </div>
                          <span className={`badge ${p.available ? 'bg2' : 'bc2'}`} style={{ fontSize: 10 }}>
                            {p.available ? 'Available' : 'Sold out'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty" style={{ padding: 32 }}>
                  <div className="empty-em">📦</div>
                  <h3>No products yet</h3>
                  <p>This vendor hasn't added any products yet.</p>
                </div>
              )}
            </div>

            {/* Customer Reviews — REAL data from API */}
            <div className="vd-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="vd-card-t" style={{ margin: 0 }}>
                  Customer Reviews
                  {reviews.length > 0 && (
                    <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 600, color: 'var(--ink3)' }}>
                      ({reviews.length})
                    </span>
                  )}
                </div>

                {!user ? (
                  <button
                    style={{ background: '#fff', border: '1.5px solid var(--border)', padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => navigate('/login')}
                  >
                    Login to review
                  </button>
                ) : user.role === 'user' && !hasReviewed ? (
                  <button
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#9333EA)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => setShowReviewForm(v => !v)}
                  >
                    {showReviewForm ? 'Cancel' : '✏️ Write review'}
                  </button>
                ) : user.role === 'user' && hasReviewed ? (
                  <span style={{ fontSize: 12, color: 'var(--ink3)', fontWeight: 600 }}>✓ You reviewed this</span>
                ) : null}
              </div>

              {/* Write review form */}
              {showReviewForm && (
                <div style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 14, padding: 18, marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>Your rating</div>
                  <StarSelector value={newRating} onChange={setNewRating} />
                  <div style={{ marginTop: 14, marginBottom: 6, fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Your review</div>
                  <textarea
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', minHeight: 80, outline: 'none' }}
                    placeholder="Share your experience with this vendor…"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'flex-end' }}>
                    <button
                      style={{ background: '#fff', border: '1.5px solid var(--border)', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => { setShowReviewForm(false); setNewRating(0); setNewComment('') }}
                      disabled={submitting}
                    >Cancel</button>
                    <button
                      style={{ background: 'linear-gradient(135deg,#7C3AED,#9333EA)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                      onClick={handleSubmitReview}
                      disabled={submitting}
                    >{submitting ? 'Submitting…' : 'Submit review'}</button>
                  </div>
                </div>
              )}

              {/* Review list */}
              {reviewsLoading ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink3)', fontSize: 13 }}>Loading reviews…</div>
              ) : reviews.length > 0 ? (
                reviews.map(r => (
                  <div key={r._id} className="rev-item">
                    <div className="rev-hd">
                      <div className="rev-av" style={{ background: getAvatarColor(r.customer?.name || '') }}>
                        {(r.customer?.name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="rev-name">{r.customer?.name || 'Customer'}</div>
                        <div className="rev-dt">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                      <div className="rev-str">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    <div className="rev-text">{r.comment}</div>

                    {r.vendorReply && (
                      <div style={{ background: 'var(--vl)', borderLeft: '3px solid var(--v)', borderRadius: '0 10px 10px 0', padding: '10px 14px', marginTop: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--v)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Vendor reply</div>
                        <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6 }}>{r.vendorReply}</div>
                      </div>
                    )}

                    {user && user.role === 'vendor' && user._id === id && (
                      <div style={{ marginTop: 10 }}>
                        <button
                          style={{ background: 'none', border: '1.5px solid var(--border)', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', color: 'var(--ink2)' }}
                          onClick={() => { setReplyTarget(r); setReplyText(r.vendorReply || '') }}
                        >{r.vendorReply ? '✏️ Edit reply' : '💬 Reply'}</button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty" style={{ padding: 30 }}>
                  <div className="empty-em">💬</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first customer to share your experience.</p>
                </div>
              )}
            </div>

            <button
              style={{ background: '#fff', border: '1.5px solid var(--border)', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 40 }}
              onClick={() => navigate('/explore')}
            >
              ← Back to explore
            </button>
          </div>

          {/* SIDEBAR */}
          <div>
            <div className="contact-card">
              <div className="cc-t">Contact vendor</div>
              <div className="cc-actions">
                {phone ? (
                  <a href={`tel:${phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, background: 'linear-gradient(135deg,#7C3AED,#9333EA)', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                    📞 Call now
                  </a>
                ) : (
                  <button disabled style={{ padding: '12px 0', borderRadius: 12, background: '#f3f4f6', color: '#9ca3af', border: 'none', fontSize: 14, fontWeight: 700, width: '100%', cursor: 'not-allowed' }}>
                    📞 No phone added
                  </button>
                )}

                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, background: 'linear-gradient(135deg,#25D366,#1FAA55)', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                  💬 WhatsApp
                </a>

                {user && user.role === 'user' && (
                  <button
                    onClick={() => navigate(`/chat/${user._id}_${id}`)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, background: 'var(--vl)', color: 'var(--v)', border: '1.5px solid rgba(124,58,237,.2)', fontSize: 14, fontWeight: 700, width: '100%', cursor: 'pointer' }}
                  >
                    ✉️ Message vendor
                  </button>
                )}

                <a href={mapsLink} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, background: 'var(--bg)', color: 'var(--ink2)', border: '1.5px solid var(--border)', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                  🧭 Directions
                </a>
              </div>

              {(address || city) && <div className="cc-row"><div className="cc-ic">📍</div><span>{[address, city].filter(Boolean).join(', ')}</span></div>}
              {openingHours && <div className="cc-row"><div className="cc-ic">🕐</div><span>{openingHours}</span></div>}
              {phone && <div className="cc-row"><div className="cc-ic">📞</div><span>{phone}</span></div>}
            </div>

            {liveAvg && (
              <div className="contact-card">
                <div className="cc-t">Rating</div>
                <div className="rating-box">
                  <div className="rating-n">{liveAvg}</div>
                  <div className="rating-s">{'★'.repeat(Math.round(Number(liveAvg))).padEnd(5, '☆')}</div>
                  <div className="rating-c">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIMILAR VENDORS */}
      {similar.length > 0 && (
        <section className="similar-sec">
          <div className="wrap">
            <div className="sec-row" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <div className="sec-ey" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--v)', marginBottom: 4 }}>You might also like</div>
                <div className="sec-h" style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, color: 'var(--ink)' }}>More {category} near you</div>
              </div>
              <Link to={`/explore?cat=${encodeURIComponent(category)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#fff', border: '1.5px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>
            <motion.div className="vgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}
              variants={gridVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
              {similar.map((v, i) => (
                <motion.div key={v._id} variants={cardVariants} custom={i}>
                  <VendorCard vendor={v} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* VENDOR REPLY MODAL */}
      {replyTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(24,16,58,.6)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 28, width: '100%', maxWidth: 460, boxShadow: 'var(--shx)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>Reply to review</div>
              <button onClick={() => setReplyTarget(null)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ background: 'var(--bg)', borderLeft: '3px solid var(--border)', borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--ink2)', fontStyle: 'italic' }}>"{replyTarget.comment}"</div>
            <textarea
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', minHeight: 90, outline: 'none' }}
              placeholder="Write a friendly reply…"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
              <button onClick={() => setReplyTarget(null)} style={{ background: '#fff', border: '1.5px solid var(--border)', padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }} disabled={replying}>Cancel</button>
              <button onClick={handleReply} style={{ background: 'linear-gradient(135deg,#7C3AED,#9333EA)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }} disabled={replying}>
                {replying ? 'Posting…' : 'Post reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}