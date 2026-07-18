// src/components/ui/VendorCard.jsx
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VendorCard({ vendor }) {
  const cardRef = useRef(null)
  const navigate = useNavigate()
  const user = null

  const { _id, shopName, category, emoji, cardClass, city, openingHours,
    rating, reviewCount, isVerified, isOpen } = vendor

  // 3D tilt — exact from approved HTML attachTilt()
  const handleMouseMove = (e) => {
    const el = cardRef.current
    const card = el.querySelector('.vc')
    if (!card) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 11}deg) translateZ(12px) scale(1.03)`
  }
  const handleMouseLeave = () => {
    const card = cardRef.current?.querySelector('.vc')
    if (card) card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0) scale(1)'
  }

  const stars = '★'.repeat(Math.round(rating || 0)).padEnd(5, '☆')

  return (
    <div
      className={`vc-wrap`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/vendor/${_id}`)}
    >
      <div className={`vc ${cardClass || 'vl2'}`}>
        <span className="vc-top-bar" />
        <div className="vc-cover">
          <span className="vc-em">{emoji || '🏪'}</span>
          {isVerified && (
            <div className="vc-verified">
              ✅ <span style={{ color: '#059669' }}>Verified</span>
            </div>
          )}
          <div className={`vc-status ${isOpen ? 'open' : 'closed'}`}>
            {isOpen ? '● Open' : '● Closed'}
          </div>
        </div>
        <div className="vc-body">
          <div className="vc-cat">{category}</div>
          <div className="vc-name">{shopName}</div>
          <div className="vc-loc">📍 {city} · 🕐 {openingHours}</div>
          <div className="vc-row">
            <div className="vc-stars">
              <span className="vc-sn">{stars}</span>
              <span className="vc-rn" style={{ marginLeft: 5 }}>{rating}</span>
              <span className="vc-rc" style={{ marginLeft: 4 }}>({reviewCount})</span>
            </div>
          </div>
        </div>
        <div className="vc-foot">
          <button
            className="btn bg bsm"
            style={{ flex: 1 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/vendor/${_id}`) }}
          >
            View shop →
          </button>
         <button
  className="btn bsm"
  style={{
    background: '#FCE7F3',
    color: '#DB2777',
    border: 'none',
    fontWeight: 700
  }}
  onClick={(e) => {
    e.stopPropagation()
    alert('Saved! 💜')
  }}
>
  💜
</button>                      
        </div>
      </div>
    </div>
  )
}