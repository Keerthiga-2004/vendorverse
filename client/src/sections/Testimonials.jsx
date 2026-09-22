// src/sections/Testimonials.jsx
// ✅ CHANGED: removed fake "Sample Customer / Sample Vendor / Demo feedback" testimonials
// Replaced with honest feature highlights that make no fake claims about real users
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './Testimonials.css'

const HIGHLIGHTS = [
  {
    id: 1,
    quoteGrad: 'linear-gradient(135deg,#F72585,#8B5CF6)',
    icon: '📍',
    title: 'Browse local vendors',
    text: 'Search and filter vendors by category, location and availability. Find shops and services right in your neighbourhood.',
    avGrad: 'linear-gradient(135deg,#F72585,#8B5CF6)',
    initial: '📍',
    label: 'For customers',
    sublabel: 'Discovery',
  },
  {
    id: 2,
    quoteGrad: 'linear-gradient(135deg,#7C3AED,#00C9B1)',
    icon: '🏪',
    title: 'Manage your shop',
    text: 'Vendors get a full dashboard to manage their profile, products, reviews and customer messages — all in one place.',
    avGrad: 'linear-gradient(135deg,#00C9B1,#10B981)',
    initial: '🏪',
    label: 'For vendors',
    sublabel: 'Dashboard',
    highlighted: true,
  },
  {
    id: 3,
    quoteGrad: 'linear-gradient(135deg,#FFAB00,#F97316)',
    icon: '💬',
    title: 'Connect directly',
    text: 'Message vendors, leave reviews, save shops to your wishlist and get notified about replies — all without leaving the platform.',
    avGrad: 'linear-gradient(135deg,#FFAB00,#F97316)',
    initial: '💬',
    label: 'For everyone',
    sublabel: 'Community',
  },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Testimonials() {
  const navigate = useNavigate()

  return (
    <section className="testi-sec">
      <div className="wrap">

        <div className="testi-header">
          <div className="sec-ey">How it works</div>
          <div className="sec-h">Built for the whole neighbourhood</div>
        </div>

        <div className="tgrid">
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.id}
              className="tc"
              style={
                h.highlighted
                  ? { borderColor: 'var(--v)', background: 'linear-gradient(160deg,#F7F4FF,#fff)' }
                  : undefined
              }
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
            >
              {/* icon */}
              <div
                className="tc-q"
                style={{
                  background: h.quoteGrad,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: 32,
                }}
              >
                {h.icon}
              </div>

              {/* title */}
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)', marginBottom: 10, letterSpacing: -0.3 }}>
                {h.title}
              </div>

              {/* description */}
              <div className="tc-text">{h.text}</div>

              {/* label row */}
              <div className="tc-user">
                <div
                  className="tc-av"
                  style={{ background: h.avGrad, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {h.initial}
                </div>
                <div>
                  <div className="tc-name">{h.label}</div>
                  <div className="tc-role">{h.sublabel}</div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button
            className="btn bp blg"
            onClick={() => navigate('/explore')}
          >
            Explore vendors →
          </button>
        </div>

      </div>
    </section>
  )
}