// src/pages/VendorDetail/VendorDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import VendorCard from '../../components/ui/VendorCard'
import api from '../../services/api'
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

// ─── LOADING SKELETON ─────────────────────────────────────
function LoadingState() {
  return (
    <div style={{ paddingTop: 68 }}>
      <div
        style={{
          height: 300,
          background: 'linear-gradient(135deg,#EDE9FE,#F5F0FF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 64, opacity: 0.3 }}>🏪</div>
      </div>
      <div className="wrap">
        <div style={{ padding: '40px 0' }}>
          {[1, 2].map(i => (
            <div
              key={i}
              className="vd-card"
              style={{ background: '#F9F8FF', border: 'none' }}
            >
              <div style={{
                height: 20, width: '40%', borderRadius: 8,
                background: '#EDE9FE', marginBottom: 16,
              }} />
              <div style={{
                height: 14, width: '90%', borderRadius: 6,
                background: '#F0EBFF', marginBottom: 10,
              }} />
              <div style={{
                height: 14, width: '70%', borderRadius: 6,
                background: '#F0EBFF',
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ERROR STATE ─────────────────────────────────────────
function ErrorState({ message, onRetry, onBack }) {
  return (
    <div className="wrap" style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="empty">
        <div className="empty-em">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{message || 'Unable to load vendor details. Please try again.'}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          <button
            className="btn bp bsm"
            onClick={onRetry}
            style={{ background: 'var(--v)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Try again
          </button>
          <button
            className="btn bg bsm"
            onClick={onBack}
            style={{ background: '#fff', border: '1.5px solid var(--border)', padding: '10px 20px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            ← Back to explore
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── NOT FOUND STATE ─────────────────────────────────────
function NotFoundState({ onBack }) {
  return (
    <div className="wrap" style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="empty">
        <div className="empty-em">🔍</div>
        <h3>Vendor not found</h3>
        <p>This vendor may have been removed or doesn't exist.</p>
        <button
          className="btn bp bsm"
          onClick={onBack}
          style={{ marginTop: 20, background: 'var(--v)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          ← Back to explore
        </button>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function VendorDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { user }     = useAuth()

  const [vendor,     setVendor]     = useState(null)
  const [allVendors, setAllVendors] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // ── Fetch vendor by ID from dedicated endpoint ──────────
  const fetchVendor = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get(`/users/vendors/${id}`)
      setVendor(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load vendor')
    } finally {
      setLoading(false)
    }
  }

  // ── Fetch all vendors for "similar" section ─────────────
  const fetchAllVendors = async () => {
    try {
      const { data } = await api.get('/users/vendors')
      setAllVendors(Array.isArray(data) ? data : [])
    } catch {
      // similar vendors are non-critical — fail silently
      setAllVendors([])
    }
  }

  useEffect(() => {
    fetchVendor()
    fetchAllVendors()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render states ───────────────────────────────────────
  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} onRetry={fetchVendor} onBack={() => navigate('/explore')} />
  if (!vendor) return <NotFoundState onBack={() => navigate('/explore')} />

  // ── Destructure safely ──────────────────────────────────
  const {
    shopName     = '',
    category     = '',
    emoji        = '🏪',
    city         = '',
    openingHours = '',
    isOpen       = false,
    description  = '',
    address      = '',
    phone        = '',
    isVerified   = false,
    rating       = 0,
    reviewCount  = 0,
  } = vendor

  // ── Derived values ──────────────────────────────────────
  const coverBg      = CATEGORY_BG[category] || 'linear-gradient(135deg,#EDE9FE,#F5F0FF)'
  const whatsappLink = `https://wa.me/91${phone}?text=${encodeURIComponent(`Hi ${shopName}, I found you on VendorVerse!`)}`
  const mapsLink     = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${city}`)}`

  // ── Similar vendors: same category, exclude self ────────
  const similar = allVendors
    .filter(v => v._id !== id && v.category === category)
    .slice(0, 3)

  // ── Star string helper ──────────────────────────────────
  const starStr = (n) => '★'.repeat(Math.round(n || 0)).padEnd(5, '☆')

  return (
    <div className="page-vendor-detail" style={{ paddingTop: 68 }}>

      {/* ── HERO BANNER ── */}
      <div className="vd-hero" style={{ background: coverBg }}>
        <div style={{
          fontSize: 100,
          filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.18))',
          position: 'relative',
          zIndex: 1,
        }}>
          {emoji}
        </div>
        <div className="vd-ov" />
        <div className="vd-ct">
          <div className="wrap">
            {isVerified && (
              <div
                className="badge bg2"
                style={{ marginBottom: 10, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 100, background: 'rgba(16,185,129,.12)', color: '#059669', fontSize: 11, fontWeight: 700 }}
              >
                ✅ Verified vendor
              </div>
            )}
            <div className="vd-name">{shopName}</div>
            <div className="vd-meta">
              <span>📂 {category || 'General'}</span>
              {rating > 0 && <span>⭐ {rating} ({reviewCount} reviews)</span>}
              {(address || city) && (
                <span>📍 {[address, city].filter(Boolean).join(', ')}</span>
              )}
              {openingHours && <span>🕐 {openingHours}</span>}
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                  background: isOpen ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)',
                  color: isOpen ? '#059669' : '#DC2626',
                }}
              >
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
              <p style={{ color: 'var(--ink2)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
                {description || 'No description added yet.'}
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {phone && (
                  <span style={{ fontSize: 13, color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    📞 {phone}
                  </span>
                )}
                {address && (
                  <span style={{ fontSize: 13, color: 'var(--ink2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    📍 {address}
                  </span>
                )}
              </div>
            </div>

            {/* Products & Services — placeholder until product API is available */}
            <div className="vd-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="vd-card-t" style={{ margin: 0 }}>Products & Services</div>
                <span
                  style={{ padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'var(--vl)', color: 'var(--v)' }}
                >
                  0 items
                </span>
              </div>
              <div className="empty" style={{ padding: 32 }}>
                <div className="empty-em">📦</div>
                <h3>No products yet</h3>
                <p>This vendor hasn't listed any products.</p>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="vd-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="vd-card-t" style={{ margin: 0 }}>Customer Reviews</div>
                {user ? (
                  <button
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#9333EA)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Write review
                  </button>
                ) : (
                  <button
                    style={{ background: '#fff', border: '1.5px solid var(--border)', padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => navigate('/login')}
                  >
                    Login to review
                  </button>
                )}
              </div>
              <div className="empty" style={{ padding: 30 }}>
                <div className="empty-em">💬</div>
                <h3>No reviews yet</h3>
                <p>Be the first to review!</p>
              </div>
            </div>

            <button
              style={{ background: '#fff', border: '1.5px solid var(--border)', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 40, display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onClick={() => navigate('/explore')}
            >
              ← Back to explore
            </button>

          </div>

          {/* SIDEBAR */}
          <div>

            {/* Contact card */}
            <div className="contact-card">
              <div className="cc-t">Contact vendor</div>

              <div className="cc-actions">
                {/* Call */}
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 14, background: 'linear-gradient(135deg,#7C3AED,#9333EA)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 18px rgba(124,58,237,.35)', transition: 'transform .18s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    📞 Call now
                  </a>
                ) : (
                  <button
                    disabled
                    style={{ padding: '13px 0', borderRadius: 14, background: '#f3f4f6', color: '#9ca3af', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'not-allowed', width: '100%' }}
                  >
                    📞 No phone added
                  </button>
                )}

                {/* WhatsApp */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 14, background: 'linear-gradient(135deg,#25D366,#1FAA55)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,211,102,.35)', transition: 'transform .18s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  💬 WhatsApp
                </a>

                {/* Directions */}
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-directions"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 14, background: 'var(--vl)', color: 'var(--v)', border: '1.5px solid rgba(124,58,237,.2)', fontSize: 15, fontWeight: 700, textDecoration: 'none', transition: 'all .18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E4DBFF'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--vl)'; e.currentTarget.style.transform = 'none' }}
                >
                  🧭 Directions
                </a>
              </div>

              {/* Info rows */}
              {(address || city) && (
                <div className="cc-row">
                  <div className="cc-ic">📍</div>
                  <span>{[address, city].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {openingHours && (
                <div className="cc-row">
                  <div className="cc-ic">🕐</div>
                  <span>{openingHours}</span>
                </div>
              )}
              {phone && (
                <div className="cc-row">
                  <div className="cc-ic">📞</div>
                  <span>{phone}</span>
                </div>
              )}
            </div>

            {/* Rating card */}
            {rating > 0 && (
              <div className="contact-card">
                <div className="cc-t">Rating</div>
                <div className="rating-box">
                  <div className="rating-n">{Number(rating).toFixed(1)}</div>
                  <div className="rating-s">{starStr(rating)}</div>
                  <div className="rating-c">{reviewCount} reviews</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── SIMILAR VENDORS ── */}
      {similar.length > 0 && (
        <section className="similar-sec">
          <div className="wrap">
            <div className="sec-row" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                <div className="sec-ey" style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#7C3AED', marginBottom: 6 }}>
                  You might also like
                </div>
                <div className="sec-h" style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: 'var(--ink)' }}>
                  More {category} near you
                </div>
              </div>
              <Link
                to={`/explore?cat=${encodeURIComponent(category)}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 12, background: '#fff', border: '1.5px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', textDecoration: 'none' }}
              >
                View all →
              </Link>
            </div>

            <motion.div
              className="vgrid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {similar.map((v, i) => (
                <motion.div key={v._id} variants={cardVariants} custom={i}>
                  <VendorCard vendor={v} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

    </div>
  )
}