// src/sections/FeaturedVendors.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VendorCard from '../components/ui/VendorCard'
import api from '../services/api'
import './FeaturedVendors.css'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden:   { opacity: 0, y: 32 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function FeaturedVendors() {
  const navigate = useNavigate()

  // ✅ CHANGED: real vendors from API instead of hardcoded VENDORS array
  const [vendors,  setVendors]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { data } = await api.get('/users/vendors?sort=rating')
        // Show up to 6 highest-rated vendors
        setVendors(data.slice(0, 6))
      } catch {
        setVendors([])
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()
  }, [])

  // If still loading or no vendors exist — don't render the section at all
  // This avoids an empty section heading with nothing under it
  if (loading) return null
  if (vendors.length === 0) return null

  return (
    <section className="featured-sec">
      <div className="wrap">

        {/* header row */}
        <div className="sec-row">
          <div>
            <div className="sec-ey">Featured vendors</div>
            <div className="sec-h">Explore local vendors</div>
          </div>
          <button className="btn bg" onClick={() => navigate('/explore')}>
            View all →
          </button>
        </div>

        {/* vendor grid — real MongoDB data */}
        <motion.div
          className="vgrid"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {vendors.map(v => (
            <motion.div key={v._id} variants={cardVariants}>
              <VendorCard vendor={v} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}