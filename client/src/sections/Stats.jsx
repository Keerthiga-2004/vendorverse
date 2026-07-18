// src/components/sections/Stats.jsx
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import './Stats.css'

const STATS = [
  { value: '2,400+', grad: 'linear-gradient(135deg,#A78BFA,#fff)', label: 'Vendors listed'  },
  { value: '18,000+',grad: 'linear-gradient(135deg,#6EE7B7,#fff)', label: 'Happy customers' },
  { value: '120+',   grad: 'linear-gradient(135deg,#FCD34D,#fff)', label: 'Cities covered'  },
  { value: '4.8 ⭐', grad: 'linear-gradient(135deg,#FDA4AF,#fff)', label: 'Average rating'  },
  { value: '99%',    grad: 'linear-gradient(135deg,#93C5FD,#fff)', label: 'Uptime'           },
]

const numVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function Stats() {
  return (
    <div className="stats-band">
      <div className="wrap stats-inner">
        {STATS.map((s, i) => (
          <Fragment key={s.label}>
            <motion.div
             className="si"
              variants={numVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              custom={i}
            >
              <div
                className="si-n"
                style={{
                  background: s.grad,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
                </div>
                <div className="si-l">{s.label}</div>
            </motion.div>
            {i < STATS.length - 1 && <div key={`div-${i}`} className="si-div" />}
          </Fragment>
        ))}
      </div>
    </div>
  )
}