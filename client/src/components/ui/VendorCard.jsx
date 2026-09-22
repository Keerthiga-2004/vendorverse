// src/components/ui/VendorCard.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────
// CATEGORY ICONS
// ─────────────────────────────────────────────────────────

const CATEGORY_ICONS = {
  'Food & Beverages': {
    bg: 'linear-gradient(135deg, #FFF4EE 0%, #FFE8D6 100%)',
    accent: '#F25C54',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FEE2D5" />
        <path d="M18 20c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#F25C54" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 20v12" stroke="#F25C54" strokeWidth="2" strokeLinecap="round" />
        <rect x="28" y="16" width="6" height="4" rx="1" fill="#F25C54" />
        <path d="M31 20v12" stroke="#F25C54" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 34h18" stroke="#F25C54" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="22" r="3" fill="#FFAB00" opacity="0.8" />
      </svg>
    ),
  },

  Grocery: {
    bg: 'linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)',
    accent: '#10B981',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#D1FAE5" />
        <path d="M16 18h3l2.5 10h11l2-7H20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23" cy="31" r="2" fill="#10B981" />
        <circle cx="33" cy="31" r="2" fill="#10B981" />
        <path d="M26 14c-2 0-3 1.5-3 3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 14c2 0 3 1.5 3 3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="26" cy="13" r="1.5" fill="#34D399" />
      </svg>
    ),
  },

  Tailoring: {
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    accent: '#7C3AED',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#EDE9FE" />
        <path d="M26 16l-6 8h12l-6-8z" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />
        <path d="M20 24l-3 12h18l-3-12" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />
        <path d="M23 24v5M29 24v5" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="26" cy="16" r="2" fill="#7C3AED" />
      </svg>
    ),
  },

  'Beauty & Wellness': {
    bg: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    accent: '#F43F5E',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FFE4E6" />
        <path
          d="M26 15c-4 0-7 2.5-7 7 0 5 7 14 7 14s7-9 7-14c0-4.5-3-7-7-7z"
          fill="#F43F5E"
          opacity="0.2"
          stroke="#F43F5E"
          strokeWidth="2"
        />
        <circle cx="26" cy="22" r="3" fill="#F43F5E" />
      </svg>
    ),
  },

  'Electronics Repair': {
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    accent: '#F59E0B',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FEF3C7" />
        <rect x="17" y="20" width="18" height="13" rx="2" stroke="#F59E0B" strokeWidth="2" />
        <path d="M22 20v-3M30 20v-3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 23h8M22 26h5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },

  'Home Repair': {
    bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    accent: '#F97316',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FFEDD5" />
        <path d="M18 24l8-8 8 8v12H18V24z" stroke="#F97316" strokeWidth="2" strokeLinejoin="round" />
        <rect x="23" y="28" width="6" height="8" rx="1" fill="#F97316" opacity="0.3" />
      </svg>
    ),
  },

  Electrician: {
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    accent: '#8B5CF6',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#EDE9FE" />
        <path
          d="M28 15l-6 11h6l-4 11 10-13h-6l4-9h-4z"
          fill="#8B5CF6"
          opacity="0.25"
          stroke="#8B5CF6"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  Bakery: {
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    accent: '#059669',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#D1FAE5" />
        <path
          d="M18 30c0-4.4 3.6-8 8-8s8 3.6 8 8H18z"
          fill="#059669"
          opacity="0.2"
          stroke="#059669"
          strokeWidth="2"
        />
        <rect x="16" y="30" width="20" height="6" rx="2" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="2" />
      </svg>
    ),
  },

  'Local Services': {
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    accent: '#3B82F6',
    svg: (
      <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#DBEAFE" />
        <path
          d="M26 15c-5 0-9 4-9 9 0 6.5 9 13 9 13s9-6.5 9-13c0-5-4-9-9-9z"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="#3B82F6"
          opacity="0.1"
        />
        <circle cx="26" cy="24" r="4" fill="#3B82F6" opacity="0.25" />
      </svg>
    ),
  },
}

const DEFAULT_ICON = {
  bg: 'linear-gradient(135deg, #F4F3FF 0%, #EDE9FE 100%)',
  accent: '#5B3FF8',
  svg: (
    <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="22" fill="#EDE9FE" />
      <rect x="16" y="22" width="20" height="14" rx="2" stroke="#5B3FF8" strokeWidth="2" />
      <path d="M20 22v-3a6 6 0 0 1 12 0v3" stroke="#5B3FF8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="29" r="2.5" fill="#5B3FF8" />
    </svg>
  ),
}

export default function VendorCard({
  vendor,
  wishlistedIds = [],
}) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    _id,
    shopName = 'Local Business',
    category = '',
    city = '',
    openingHours = '',
    rating = 0,
    reviewCount = 0,
    isVerified = false,
    isOpen = false,
  } = vendor || {}

  const iconCfg = CATEGORY_ICONS[category] || DEFAULT_ICON

  const [saved, setSaved] = useState(
    () => wishlistedIds.includes(_id)
  )

  const [toggling, setToggling] = useState(false)

  const handleWishlist = async (e) => {
    e.stopPropagation()

    if (!user) {
      toast.error('Please sign in to save vendors')
      navigate('/login')
      return
    }

    if (user.role === 'vendor') {
      toast.error('Vendors cannot save other vendors')
      return
    }

    if (toggling) return

    try {
      setToggling(true)

      const { data } = await api.post(
        `/users/wishlist/${_id}`
      )

      setSaved(data.saved)

      toast.success(
        data.saved
          ? 'Saved to wishlist 💜'
          : 'Removed from wishlist'
      )
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to update wishlist'
      )
    } finally {
      setToggling(false)
    }
  }

  const ratingDisplay = rating
    ? Number(rating).toFixed(1)
    : null

  return (
    <div
      className="vc-wrap"
      onClick={() => navigate(`/vendor/${_id}`)}
      style={{
        width: '100%',
        cursor: 'pointer',
      }}
    >
      <div
        className="vc"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#FFFFFF',
          color: '#17151F',
          border: '1px solid rgba(15, 13, 26, 0.08)',
          boxShadow: '0 4px 14px rgba(15, 13, 26, 0.06)',
          position: 'relative',

          // IMPORTANT: permanently disable movement
          transform: 'none',
          scale: 1,
          rotate: 0,

          // Only shadow can transition
          transition: 'box-shadow 0.18s ease',
        }}
      >
        {/* Accent */}
        <div
          style={{
            height: 4,
            width: '100%',
            background: iconCfg.accent,
          }}
        />

        {/* Cover */}
        <div
          style={{
            height: 148,
            background: iconCfg.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.45)',
              position: 'absolute',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {iconCfg.svg}
          </div>

          {isVerified && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#FFFFFF',
                borderRadius: 999,
                padding: '5px 9px',
                fontSize: 10,
                fontWeight: 700,
                color: '#059669',
              }}
            >
              ✓ Verified
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              padding: '5px 9px',
              borderRadius: 999,
              background: isOpen
                ? 'rgba(16,185,129,.12)'
                : 'rgba(239,68,68,.12)',
              color: isOpen ? '#059669' : '#DC2626',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isOpen ? '#10B981' : '#EF4444',
              }}
            />
            {isOpen ? 'Open' : 'Closed'}
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '15px 16px 13px',
            background: '#FFFFFF',
            minHeight: 128,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '.6px',
              color: iconCfg.accent,
              marginBottom: 5,
            }}
          >
            {category || 'Local Business'}
          </div>

          <div
            style={{
              fontSize: 16,
              lineHeight: 1.3,
              fontWeight: 700,
              color: '#17151F',
              marginBottom: 7,
            }}
          >
            {shopName}
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#777184',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {city && <span>⌖ {city}</span>}

            {city && openingHours && (
              <span style={{ color: '#C7C3CE' }}>•</span>
            )}

            {openingHours && (
              <span>◷ {openingHours}</span>
            )}

            {!city && !openingHours && (
              <span>Location not set</span>
            )}
          </div>

          {ratingDisplay && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginTop: 9,
              }}
            >
              <span style={{ color: '#F59E0B' }}>★</span>

              <strong
                style={{
                  fontSize: 13,
                  color: '#17151F',
                }}
              >
                {ratingDisplay}
              </strong>

              {reviewCount > 0 && (
                <span
                  style={{
                    fontSize: 12,
                    color: '#777184',
                  }}
                >
                  ({reviewCount} reviews)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 16px 14px',
            borderTop: '1px solid rgba(15,13,26,.07)',
            display: 'flex',
            gap: 8,
            background: '#FFFFFF',
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/vendor/${_id}`)
            }}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 9,
              background: '#FFFFFF',
              border: '1px solid rgba(15,13,26,.12)',
              color: '#17151F',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'border-color .15s ease, color .15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = iconCfg.accent
              e.currentTarget.style.color = iconCfg.accent
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                'rgba(15,13,26,.12)'
              e.currentTarget.style.color = '#17151F'
            }}
          >
            View shop →
          </button>

          <button
            type="button"
            onClick={handleWishlist}
            disabled={toggling}
            title={
              saved
                ? 'Remove from wishlist'
                : 'Save to wishlist'
            }
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 9,
              border: `1px solid ${
                saved
                  ? '#F43F5E'
                  : 'rgba(244,63,94,.16)'
              }`,
              background: saved ? '#F43F5E' : '#FFF1F5',
              color: saved ? '#FFFFFF' : '#F43F5E',
              cursor: toggling ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: toggling ? .65 : 1,
              transition: 'background .15s ease',
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill={saved ? '#FFFFFF' : 'none'}
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}