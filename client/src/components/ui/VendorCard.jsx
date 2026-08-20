// src/components/ui/VendorCard.jsx
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── CATEGORY ICON CONFIG ─────────────────────────────────
// Each category gets: a beautiful SVG icon + gradient bg + accent color
// Works even when vendor.emoji is empty/undefined from the API
const CATEGORY_ICONS = {
  'Food & Beverages': {
    bg: 'linear-gradient(135deg, #FFF4EE 0%, #FFE8D6 100%)',
    accent: '#F25C54',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FEE2D5" />
        <path d="M18 20c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#F25C54" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 20v12" stroke="#F25C54" strokeWidth="2" strokeLinecap="round"/>
        <rect x="28" y="16" width="6" height="4" rx="1" fill="#F25C54"/>
        <path d="M31 20v12" stroke="#F25C54" strokeWidth="2" strokeLinecap="round"/>
        <path d="M17 34h18" stroke="#F25C54" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="38" cy="22" r="3" fill="#FFAB00" opacity="0.8"/>
      </svg>
    ),
  },
  'Grocery': {
    bg: 'linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)',
    accent: '#10B981',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#D1FAE5" />
        <path d="M16 18h3l2.5 10h11l2-7H20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="23" cy="31" r="2" fill="#10B981"/>
        <circle cx="33" cy="31" r="2" fill="#10B981"/>
        <path d="M26 14c-2 0-3 1.5-3 3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M26 14c2 0 3 1.5 3 3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="26" cy="13" r="1.5" fill="#34D399"/>
      </svg>
    ),
  },
  'Tailoring': {
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    accent: '#7C3AED',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#EDE9FE" />
        <path d="M26 16l-6 8h12l-6-8z" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M20 24l-3 12h18l-3-12" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M23 24v5M29 24v5" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="26" cy="16" r="2" fill="#7C3AED"/>
        <circle cx="38" cy="18" r="3" fill="none" stroke="#7C3AED" strokeWidth="1.5"/>
        <path d="M36.5 16.5l3 3" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  'Beauty & Wellness': {
    bg: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    accent: '#F43F5E',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FFE4E6" />
        <path d="M26 15c-4 0-7 2.5-7 7 0 5 7 14 7 14s7-9 7-14c0-4.5-3-7-7-7z" fill="#F43F5E" opacity="0.2" stroke="#F43F5E" strokeWidth="2"/>
        <path d="M22 22c0-2.2 1.8-4 4-4" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="26" cy="22" r="3" fill="#F43F5E"/>
        <path d="M32 20l3-3M20 20l-3-3" stroke="#FB7185" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  'Electronics Repair': {
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    accent: '#F59E0B',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FEF3C7" />
        <rect x="17" y="20" width="18" height="13" rx="2" stroke="#F59E0B" strokeWidth="2"/>
        <path d="M22 20v-3M30 20v-3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 23h8M22 26h5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="34" cy="18" r="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M32.5 18h3M34 16.5v3" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  'Home Repair': {
    bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    accent: '#F97316',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FFEDD5" />
        <path d="M18 24l8-8 8 8v12H18V24z" stroke="#F97316" strokeWidth="2" strokeLinejoin="round"/>
        <rect x="23" y="28" width="6" height="8" rx="1" fill="#F97316" opacity="0.3" stroke="#F97316" strokeWidth="1.5"/>
        <path d="M14 24h24" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 17v-3h3v6" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  'Electrician': {
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    accent: '#8B5CF6',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#EDE9FE" />
        <path d="M28 15l-6 11h6l-4 11 10-13h-6l4-9h-4z" fill="#8B5CF6" opacity="0.25" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="38" cy="18" r="2.5" fill="#FBBF24"/>
        <circle cx="14" cy="32" r="2.5" fill="#FBBF24"/>
      </svg>
    ),
  },
  'Bakery': {
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    accent: '#059669',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#D1FAE5" />
        <path d="M18 30c0-4.4 3.6-8 8-8s8 3.6 8 8H18z" fill="#059669" opacity="0.2" stroke="#059669" strokeWidth="2"/>
        <rect x="16" y="30" width="20" height="6" rx="2" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="2"/>
        <path d="M22 22c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M26 18v-3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M23 26h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  'Local Services': {
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    accent: '#3B82F6',
    svg: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#DBEAFE" />
        <path d="M26 15c-5 0-9 4-9 9 0 6.5 9 13 9 13s9-6.5 9-13c0-5-4-9-9-9z" stroke="#3B82F6" strokeWidth="2" fill="#3B82F6" opacity="0.1"/>
        <circle cx="26" cy="24" r="4" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" strokeWidth="2"/>
        <circle cx="38" cy="20" r="2.5" fill="#60A5FA" opacity="0.7"/>
        <circle cx="14" cy="20" r="2.5" fill="#60A5FA" opacity="0.7"/>
      </svg>
    ),
  },
}

// ─── FALLBACK (when category doesn't match) ───────────────
const DEFAULT_ICON = {
  bg: 'linear-gradient(135deg, #F4F3FF 0%, #EDE9FE 100%)',
  accent: '#5B3FF8',
  svg: (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="#EDE9FE" />
      <rect x="16" y="22" width="20" height="14" rx="2" stroke="#5B3FF8" strokeWidth="2"/>
      <path d="M20 22v-3a6 6 0 0 1 12 0v3" stroke="#5B3FF8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="26" cy="29" r="2.5" fill="#5B3FF8"/>
      <path d="M26 31.5v2" stroke="#5B3FF8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

// ─── VENDOR CARD ──────────────────────────────────────────
export default function VendorCard({ vendor }) {
  const cardRef = useRef(null)
  const navigate = useNavigate()

  const {
    _id,
    shopName    = 'Local Business',
    category    = '',
    city        = '',
    openingHours= '',
    rating      = 0,
    reviewCount = 0,
    isVerified  = false,
    isOpen      = false,
  } = vendor || {}

  // Pick icon config by category, fall back to default
  const iconCfg = CATEGORY_ICONS[category] || DEFAULT_ICON

  // 3D tilt on mouse move
  const handleMouseMove = (e) => {
    const el   = cardRef.current
    const card = el?.querySelector('.vc')
    if (!card) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5
    card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 9}deg) translateZ(10px) scale(1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current?.querySelector('.vc')
    if (card) card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0) scale(1)'
  }

  // Rating star display
  const ratingDisplay = rating ? Number(rating).toFixed(1) : null

  return (
    <div
      ref={cardRef}
      className="vc-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/vendor/${_id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="vc" style={{ borderRadius: 20, overflow: 'hidden', background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(91,63,248,0.08)', transition: 'box-shadow 0.3s, border-color 0.3s', transformStyle: 'preserve-3d', willChange: 'transform' }}>

        {/* ── colour accent bar ── */}
        <div style={{
          height: 4,
          background: iconCfg.accent,
          opacity: 0.85,
        }} />

        {/* ── icon cover ── */}
        <div style={{
          height: 148,
          background: iconCfg.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* soft circle behind icon */}
          <div style={{
            position: 'absolute',
            width: 90, height: 90,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            filter: 'blur(6px)',
          }} />

          {/* SVG icon */}
          <div style={{
            position: 'relative', zIndex: 1,
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
          }}
            className="vc-cover-icon"
          >
            {iconCfg.svg}
          </div>

          {/* verified badge */}
          {isVerified && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(4px)',
              borderRadius: 100, padding: '3px 9px',
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4,
              color: '#059669', boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            }}>
              ✓ Verified
            </div>
          )}

          {/* open/closed pill */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            borderRadius: 100, padding: '3px 10px',
            fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 4,
            background: isOpen ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: isOpen ? '#059669' : '#DC2626',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isOpen ? '#10B981' : '#EF4444',
              display: 'inline-block',
            }} />
            {isOpen ? 'Open' : 'Closed'}
          </div>
        </div>

        {/* ── card body ── */}
        <div style={{ padding: '14px 16px 12px' }}>
          {/* category label */}
          <div style={{
            fontSize: 10, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.7px',
            color: iconCfg.accent, marginBottom: 4,
          }}>
            {category || 'Local Business'}
          </div>

          {/* shop name */}
          <div style={{
            fontSize: 16, fontWeight: 700,
            color: '#0F0D1A', letterSpacing: '-0.3px',
            marginBottom: 5, lineHeight: 1.3,
          }}>
            {shopName}
          </div>

          {/* location + hours */}
          <div style={{
            fontSize: 12, color: '#9B93B8',
            display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 10, flexWrap: 'wrap',
          }}>
            {city ? (
              <>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {city}
                </span>
                {openingHours && <span style={{ color: '#C4BEDD' }}>·</span>}
              </>
            ) : null}
            {openingHours && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {openingHours}
              </span>
            )}
            {!city && !openingHours && (
              <span>Location not set</span>
            )}
          </div>

          {/* rating row */}
          {ratingDisplay && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              marginBottom: 6,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F0D1A' }}>{ratingDisplay}</span>
              {reviewCount > 0 && (
                <span style={{ fontSize: 12, color: '#9B93B8' }}>({reviewCount} reviews)</span>
              )}
            </div>
          )}
        </div>

        {/* ── card footer ── */}
        <div style={{
          padding: '10px 16px 14px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', gap: 8,
        }}>
          <button
            style={{
              flex: 1, padding: '9px 0',
              background: '#fff',
              border: '1.5px solid rgba(0,0,0,0.1)',
              borderRadius: 10, fontSize: 13, fontWeight: 700,
              color: '#0F0D1A', cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}
            onClick={(e) => { e.stopPropagation(); navigate(`/vendor/${_id}`) }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = iconCfg.accent; e.currentTarget.style.color = iconCfg.accent }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#0F0D1A' }}
          >
            View shop
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <button
            style={{
              width: 38, height: 38,
              background: '#FFF0F6',
              border: '1.5px solid rgba(244,63,94,0.15)',
              borderRadius: 10, fontSize: 15,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s', flexShrink: 0,
            }}
            onClick={(e) => {
              e.stopPropagation()
              e.currentTarget.style.background = '#F43F5E'
              e.currentTarget.style.color = '#fff'
              setTimeout(() => {
                e.currentTarget.style.background = '#FFF0F6'
                e.currentTarget.style.color = ''
              }, 600)
            }}
            title="Save vendor"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

      </div>

      {/* hover icon scale — injected via style tag to avoid CSS file dependency */}
      <style>{`
        .vc-wrap:hover .vc { box-shadow: 0 16px 48px rgba(91,63,248,0.16) !important; border-color: rgba(91,63,248,0.2) !important; }
        .vc-wrap:hover .vc-cover-icon { transform: scale(1.12) rotate(-4deg); }
      `}</style>
    </div>
  )
}