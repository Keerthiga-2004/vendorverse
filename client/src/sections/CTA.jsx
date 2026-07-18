// src/components/sections/CTA.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './CTA.css'

export default function CTA() {
  const navigate = useNavigate()

  return (
    <section className="cta-sec">
      <div className="wrap">
        <motion.div
          className="cta-band"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* left */}
          <div>
            <div className="cta-badge">🚀 For Vendors</div>
            <h2>Got a local business?<br />Get discovered today.</h2>
            <p>
              List your shop on VendorVerse for free. Get a beautiful online
              presence, manage products, and reach customers right around the corner.
            </p>
          </div>

          {/* right buttons */}
          <div className="cta-btns">
            <button className="btn bwh blg" onClick={() => navigate('/signup')}>
              Register your shop →
            </button>
            <button className="btn bout blg" onClick={() => navigate('/explore')}>
              Browse marketplace
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}