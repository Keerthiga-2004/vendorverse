// src/components/sections/WhyChooseUs.jsx
import { motion } from 'framer-motion'
import './WhyChooseUs.css'

const CARDS = [
  {
    span: true,
    bg:       'linear-gradient(135deg,#F5F0FF,#FFF0F6)',
    blobBg:   'var(--v)',
    icBg:     'var(--vl)',
    icon:     '📍',
    title:    'Hyperlocal discovery',
    desc:     'Find vendors within walking distance using precise geo-location. Shops you can actually reach in minutes.',
    extra:    true,   // shows the big 0.3 km avg
  },
  {
    span: false,
    bg:       'linear-gradient(135deg,#F0FDF9,#E6FAF8)',
    blobBg:   'var(--green)',
    icBg:     'var(--greenl)',
    icon:     '✅',
    title:    'Verified vendors',
    desc:     "Every vendor is reviewed and verified. Shop with confidence knowing they're legit.",
  },
  {
    span: false,
    bg:       'linear-gradient(135deg,#FFF0F0,#FFF8E1)',
    blobBg:   'var(--coral)',
    icBg:     'var(--corall)',
    icon:     '⭐',
    title:    'Real reviews',
    desc:     'Honest ratings from your actual neighbours. Know before you go.',
  },
  {
    span: false,
    bg:       'linear-gradient(135deg,#FFF0F6,#F5F0FF)',
    blobBg:   'var(--pink)',
    icBg:     'var(--pinkl)',
    icon:     '🏪',
    title:    'Vendor dashboard',
    desc:     'Manage products, profile and reputation from one powerful dashboard.',
  },
  {
    span: false,
    bg:       'linear-gradient(135deg,#FFF8E1,#FFF3E0)',
    blobBg:   'var(--amber)',
    icBg:     'var(--amberl)',
    icon:     '⚡',
    title:    'Instant connect',
    desc:     'See contact details, hours, location. Connect directly — no middleman.',
  },
  {
    span: false,
    bg:       'linear-gradient(135deg,#E6FAF8,#F0FDF9)',
    blobBg:   'var(--teal)',
    icBg:     'var(--teall)',
    icon:     '💚',
    title:    'Support local',
    desc:     'Every discovery supports a real business in your community.',
  },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function WhyChooseUs() {
  return (
    <section className="why-sec">
      <div className="wrap">
        {/* header */}
        <div className="why-header">
          <div className="sec-ey">Why VendorVerse</div>
          <div className="sec-h">Built for your neighbourhood</div>
          <p>The platform that truly connects local vendors with the people who need them.</p>
        </div>

        {/* bento grid */}
        <div className="bento">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              className={`bento-c${c.span ? ' sp2' : ''}`}
              style={{ background: c.bg }}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={i}
            >
              {/* decorative blob */}
              <div className="bento-blob" style={{ background: c.blobBg }} />

              {/* icon */}
              <div className="bento-ic" style={{ background: c.icBg }}>
                {c.icon}
              </div>

              <h3>{c.title}</h3>
              <p>{c.desc}</p>

              {/* big number only on span card */}
              {c.extra && (
                <div
                  className="bento-big"
                  style={{
                    background: 'linear-gradient(135deg,#7C3AED,#F72585)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  0.3<span> km avg</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}