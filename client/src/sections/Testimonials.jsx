// src/components/sections/Testimonials.jsx
import { motion } from 'framer-motion'
import './Testimonials.css'

const TESTIMONIALS = [
  {
    id: 1,
    quoteGrad: 'linear-gradient(135deg,#F72585,#8B5CF6)',
    text: 'VendorVerse changed how I find local shops. I discovered my neighbourhood tailor who does incredible work!',
    avGrad: 'linear-gradient(135deg,#F72585,#8B5CF6)',
    initial: 'P',
    name: 'Priya Sharma',
    role: 'Customer · Chennai',
  },
  {
    id: 2,
    quoteGrad: 'linear-gradient(135deg,#7C3AED,#00C9B1)',
    text: 'Since listing my bakery on VendorVerse, my orders tripled! Dashboard is easy and customers love seeing my menu.',
    avGrad: 'linear-gradient(135deg,#00C9B1,#10B981)',
    initial: 'R',
    name: 'Ravi Kumar',
    role: 'Vendor · Coimbatore',
    highlighted: true,
  },
  {
    id: 3,
    quoteGrad: 'linear-gradient(135deg,#FFAB00,#F97316)',
    text: 'VendorVerse gave me a professional online presence as an electrician. I now get 10+ inquiries weekly!',
    avGrad: 'linear-gradient(135deg,#FFAB00,#F97316)',
    initial: 'M',
    name: 'Mohammed Irfan',
    role: 'Vendor · Erode',
  },
]

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function Testimonials() {
  return (
    <section className="testi-sec">
      <div className="wrap">
        {/* header */}
        <div className="testi-header">
          <div className="sec-ey">Testimonials</div>
          <div className="sec-h">Loved by vendors &amp; customers</div>
        </div>

        {/* grid */}
        <div className="tgrid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              className="tc"
              style={
                t.highlighted
                  ? { borderColor: 'var(--v)', background: 'linear-gradient(160deg,#F7F4FF,#fff)' }
                  : undefined
              }
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
            >
              {/* quote mark */}
              <div
                className="tc-q"
                style={{
                  background: t.quoteGrad,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                "
              </div>

              {/* stars */}
              <div className="tc-stars">★★★★★</div>

              {/* review text */}
              <div className="tc-text">{t.text}</div>

              {/* user */}
              <div className="tc-user">
                <div className="tc-av" style={{ background: t.avGrad }}>
                  {t.initial}
                </div>
                <div>
                  <div className="tc-name">{t.name}</div>
                  <div className="tc-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}