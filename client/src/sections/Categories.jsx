// src/components/sections/Categories.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Categories.css'

const CATS = [
  { emoji: '🍱', label: 'Food',        count: '48 vendors', cls: 'cf',  cat: 'Food & Beverages'   },
  { emoji: '🛒', label: 'Grocery',     count: '35 vendors', cls: 'cg',  cat: 'Grocery'             },
  { emoji: '✂️', label: 'Tailoring',   count: '22 vendors', cls: 'ct',  cat: 'Tailoring'           },
  { emoji: '💇', label: 'Beauty',      count: '31 vendors', cls: 'cb',  cat: 'Beauty & Wellness'   },
  { emoji: '🔌', label: 'Electronics', count: '18 vendors', cls: 'ce',  cat: 'Electronics Repair'  },
  { emoji: '🔨', label: 'Home Repair', count: '27 vendors', cls: 'ch',  cat: 'Home Repair'         },
  { emoji: '⚡', label: 'Electrician', count: '15 vendors', cls: 'cel', cat: 'Electrician'         },
  { emoji: '🥐', label: 'Bakery',      count: '20 vendors', cls: 'ck',  cat: 'Bakery'              },
  { emoji: '🏪', label: 'Local',       count: '42 vendors', cls: 'cl',  cat: 'Local Services'      },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}
const tileVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

export default function Categories() {
  const navigate = useNavigate()

  const handleClick = (cat) => {
    navigate(`/explore?cat=${encodeURIComponent(cat)}`)
  }

  return (
    <section className="categories-sec sec">
      <div className="wrap">
        {/* ── header row ── */}
        <div className="sec-row">
          <div>
            <div className="sec-ey">Browse by category</div>
            <div className="sec-h">Everything local, one place</div>
          </div>
          <button className="btn bg" onClick={() => navigate('/categories')}>
            All categories →
          </button>
        </div>

        {/* ── scrolling strip ── */}
        <motion.div
          className="cat-strip"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CATS.map((c) => (
            <motion.div
              key={c.cat}
              className={`cat-tile ${c.cls}`}
              variants={tileVariants}
              onClick={() => handleClick(c.cat)}
            >
              <span className="ct-em">{c.emoji}</span>
              <div className="ct-n">{c.label}</div>
              <div className="ct-c">{c.count}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}