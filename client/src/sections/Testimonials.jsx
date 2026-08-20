// src/components/sections/Testimonials.jsx
import { motion } from 'framer-motion'
import './Testimonials.css'

const TESTIMONIALS = [
  {
    id: 1,
    quoteGrad: 'linear-gradient(135deg,#F72585,#8B5CF6)',
    text: 'VendorVerse makes it easier to discover local shops and explore their services in one place.',
    avGrad: 'linear-gradient(135deg,#F72585,#8B5CF6)',
    initial: 'S',
    name: 'Sample Customer',
    role: 'Demo feedback',
  },
  {
    id: 2,
    quoteGrad: 'linear-gradient(135deg,#7C3AED,#00C9B1)',
    text: 'The vendor dashboard provides a simple way to manage shop information and products.',
    avGrad: 'linear-gradient(135deg,#00C9B1,#10B981)',
    initial: 'V',
    name: 'Sample Vendor',
    role: 'Demo feedback',
    highlighted: true,
  },
  {
    id: 3,
    quoteGrad: 'linear-gradient(135deg,#FFAB00,#F97316)',
    text: 'I like being able to view vendor details and connect directly with local businesses.',
    avGrad: 'linear-gradient(135deg,#FFAB00,#F97316)',
    initial: 'S',
    name: 'Sample User',
    role: 'Demo feedback',
  },
]

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: (i) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function Testimonials() {
  return (
    <section className="testi-sec">
      <div className="wrap">

        {/* header */}
        <div className="testi-header">
          <div className="sec-ey">
            Sample Feedback
          </div>

          <div className="sec-h">
            What users can experience
          </div>
        </div>

        {/* grid */}
        <div className="tgrid">

          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              className="tc"
              style={
                t.highlighted
                  ? {
                      borderColor: 'var(--v)',
                      background:
                        'linear-gradient(160deg,#F7F4FF,#fff)',
                    }
                  : undefined
              }
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
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
              <div className="tc-stars">
                ★★★★★
              </div>

              {/* feedback text */}
              <div className="tc-text">
                {t.text}
              </div>

              {/* user */}
              <div className="tc-user">

                <div
                  className="tc-av"
                  style={{
                    background: t.avGrad,
                  }}
                >
                  {t.initial}
                </div>

                <div>
                  <div className="tc-name">
                    {t.name}
                  </div>

                  <div className="tc-role">
                    {t.role}
                  </div>
                </div>

              </div>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}