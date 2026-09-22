// src/pages/Wishlist/Wishlist.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import VendorCard from '../../components/ui/VendorCard'
import api from '../../services/api'
import toast from 'react-hot-toast'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function Wishlist() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [vendors,  setVendors]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchWishlist()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get('/users/wishlist')
      setVendors(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Failed to load your wishlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // When heart is toggled from a card inside Wishlist page, remove it from the list
  const handleRemove = async (vendorId) => {
    try {
      await api.post(`/users/wishlist/${vendorId}`)
      setVendors(prev => prev.filter(v => v._id !== vendorId))
      toast.success('Removed from wishlist')
    } catch {
      toast.error('Failed to remove vendor')
    }
  }

  // Wishlist page IDs — passed to VendorCard so hearts are pre-filled
  const wishlistedIds = vendors.map(v => v._id)

  return (
    <div style={{ paddingTop: 68 }}>

      {/* HEADER BAND */}
      <div style={{
        padding: '60px 0 40px',
        background: 'linear-gradient(155deg, #F7F4FF, #FFF0F6, #F7F4FF)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#F43F5E" stroke="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, color: 'var(--ink)', margin: 0 }}>
                My Wishlist
              </h1>
            </div>
            <p style={{ color: 'var(--ink2)', fontSize: 15, margin: 0 }}>
              {loading ? '' : `${vendors.length} saved vendor${vendors.length !== 1 ? 's' : ''}`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="wrap" style={{ padding: '40px 24px 80px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--v)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--ink3)', fontSize: 14 }}>Loading your saved vendors…</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{error}</div>
            <button className="btn bp bsm" onClick={fetchWishlist}>Try again</button>
          </div>
        ) : vendors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💜</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', marginBottom: 10 }}>
              No saved vendors yet
            </div>
            <p style={{ fontSize: 15, color: 'var(--ink2)', marginBottom: 28, lineHeight: 1.6, maxWidth: 340, margin: '0 auto 28px' }}>
              Tap the heart on any vendor card to save them here for quick access later.
            </p>
            <button className="btn bp blg" onClick={() => navigate('/explore')}>
              Explore vendors →
            </button>
          </div>
        ) : (
          <motion.div
            className="vgrid"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {vendors.map(v => (
              <motion.div key={v._id} variants={cardVariants}>
                <VendorCard
                  vendor={v}
                  wishlistedIds={wishlistedIds}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  )
}