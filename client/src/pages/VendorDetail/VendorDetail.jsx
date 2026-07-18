// src/pages/VendorDetail/VendorDetail.jsx
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import VendorCard from '../../components/ui/VendorCard'
import { VENDORS, CATEGORY_BG, PRODUCTS, REVIEWS } from '../../utils/vendorData'
import './VendorDetail.css'

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
  })
}
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

export default function VendorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const vendor = VENDORS.find(v => v._id === id)

  if (!vendor) {
    return (
      <div className="wrap" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="empty">
          <div className="empty-em">🔍</div>
          <h3>Vendor not found</h3>
          <p>This vendor may have been removed or doesn't exist.</p>
          <button className="btn bp" style={{ marginTop: 20 }} onClick={() => navigate('/explore')}>
            ← Back to explore
          </button>
        </div>
      </div>
    )
  }

  const {
    shopName, category, emoji, city, openingHours,
    rating, reviewCount, isVerified, isOpen,
    description, address, phone,
  } = vendor

  const products = PRODUCTS[id] || []
  const reviews  = REVIEWS[id]  || []
  const coverBg  = CATEGORY_BG[category] || 'var(--bg)'

  const whatsappLink = `https://wa.me/91${phone}?text=${encodeURIComponent(`Hi ${shopName}, I found you on VendorVerse!`)}`
  const directionsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${city}`)}`

  // similar vendors = same category, excluding this one
  const similar = VENDORS.filter(v => v.category === category && v._id !== id).slice(0, 3)

  return (
    <div className="page-vendor-detail" style={{ paddingTop: 68 }}>

      {/* ── HERO BANNER (exact from approved HTML) ── */}
      <div className="vd-hero" style={{ background: coverBg }}>
        <div style={{
          fontSize: 100,
          filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.18))',
          position: 'relative', zIndex: 1
        }}>
          {emoji}
        </div>
        <div className="vd-ov" />
        <div className="vd-ct">
          <div className="wrap">
            {isVerified && (
              <div className="badge bg2" style={{ marginBottom: 10 }}>✅ Verified vendor</div>
            )}
            <div className="vd-name">{shopName}</div>
            <div className="vd-meta">
              <span>📂 {category}</span>
              <span>⭐ {rating} ({reviewCount} reviews)</span>
              <span>📍 {address}, {city}</span>
              <span>🕐 {openingHours}</span>
              <span className={`vc-status ${isOpen ? 'open' : 'closed'}`} style={{ position: 'static' }}>
                {isOpen ? '● Open now' : '● Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY: MAIN + SIDEBAR (exact from approved HTML) ── */}
      <div className="wrap">
        <div className="vd-body">

          {/* MAIN COLUMN */}
          <div>
            {/* About */}
            <div className="vd-card">
              <div className="vd-card-t">About this shop</div>
              <p style={{ color: 'var(--ink2)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
                {description}
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'var(--ink2)' }}>📞 {phone}</span>
                <span style={{ fontSize: 13, color: 'var(--ink2)' }}>📍 {address}</span>
              </div>
            </div>

            {/* Products & Services */}
            <div className="vd-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="vd-card-t" style={{ margin: 0 }}>Products & Services</div>
                <span className="badge bv">{products.length} items</span>
              </div>
              {products.length > 0 ? (
                <div className="pgrid">
                  {products.map(p => (
                    <div key={p._id} className="pc">
                      <div className="pc-img" style={{ background: coverBg }}>{p.emoji}</div>
                      <div className="pc-body">
                        <div className="pc-n">{p.name}</div>
                        <div className="pc-d">{p.description}</div>
                        <div className="pc-ft">
                          <div>
                            <div className="pc-p">₹{p.price}</div>
                            <div className="pc-u">{p.unit}</div>
                          </div>
                          <span className={`badge ${p.available ? 'bg2' : 'bc2'}`}>
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
                </div>
              )}
            </div>

            {/* Customer Reviews */}
            <div className="vd-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="vd-card-t" style={{ margin: 0 }}>Customer Reviews</div>
                {user ? (
                  <button className="btn bp bsm">Write review</button>
                ) : (
                  <button className="btn bg bsm" onClick={() => navigate('/login')}>Login to review</button>
                )}
              </div>
              {reviews.length > 0 ? (
                reviews.map(r => (
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
                <div className="empty" style={{ padding: 30 }}>
                  <div className="empty-em">💬</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first to review!</p>
                </div>
              )}
            </div>

            <button className="btn bg" onClick={() => navigate('/explore')} style={{ marginBottom: 40 }}>
              ← Back to explore
            </button>
          </div>

          {/* SIDEBAR */}
          <div>
            {/* Contact card */}
            <div className="contact-card">
              <div className="cc-t">Contact vendor</div>

              <div className="cc-actions">
                <a href={`tel:${phone}`} className="btn bp blg" style={{ width: '100%' }}>
                  📞 Call now
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp blg"
                  style={{ width: '100%' }}
                >
                  💬 WhatsApp
                </a>
                <a
                  href={directionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-directions blg"
                  style={{ width: '100%' }}
                >
                  🧭 Directions
                </a>
              </div>

              <div className="cc-row"><div className="cc-ic">📍</div><span>{address}, {city}</span></div>
              <div className="cc-row"><div className="cc-ic">🕐</div><span>{openingHours}</span></div>
              <div className="cc-row"><div className="cc-ic">📞</div><span>{phone}</span></div>
            </div>

            {/* Rating card */}
            <div className="contact-card">
              <div className="cc-t">Rating</div>
              <div className="rating-box">
                <div className="rating-n">{rating}</div>
                <div className="rating-s">{'★'.repeat(Math.round(rating || 0))}</div>
                <div className="rating-c">{reviewCount} reviews</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── SIMILAR VENDORS (additive — new section) ── */}
      {similar.length > 0 && (
        <section className="similar-sec">
          <div className="wrap">
            <div className="sec-row">
              <div>
                <div className="sec-ey">You might also like</div>
                <div className="sec-h">More {category} near you</div>
              </div>
              <Link to={`/explore?cat=${encodeURIComponent(category)}`} className="btn bg">
                View all →
              </Link>
            </div>

            <motion.div
              className="vgrid"
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