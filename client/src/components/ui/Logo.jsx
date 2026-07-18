// src/components/ui/Logo.jsx
export default function Logo({ size = 38, textColor = 'var(--ink)', accentColor = null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#F72585" />
          </linearGradient>
          <linearGradient id="lg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFAB00" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#00C9B1" />
          </linearGradient>
        </defs>
        <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z"
          fill="rgba(124,58,237,.1)" stroke="url(#lg1)" strokeWidth="1.8" />
        <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13"
          stroke="url(#lg2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="url(#lg1)" />
        <circle cx="29" cy="13" r="2.2" fill="#FFAB00" opacity="0.9" />
        <circle cx="11" cy="27" r="1.8" fill="#10B981" opacity="0.9" />
        <circle cx="29" cy="27" r="1.8" fill="#F72585" opacity="0.9" />
      </svg>
      <span style={{
        fontSize: size > 32 ? '20px' : '15px',
        fontWeight: 800,
        color: textColor,
        letterSpacing: '-1px',
        lineHeight: 1
      }}>
        Vendor
        <b style={{
          background: accentColor || 'linear-gradient(135deg,#7C3AED,#F72585)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Verse</b>
      </span>
    </div>
  )
}