// src/pages/Dashboard/MyShop.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './MyShop.css'

// ─── SIDEBAR (shared) ─────────────────────────────────────
function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="slg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#F72585" />
        </linearGradient>
        <linearGradient id="slg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAB00" /><stop offset="100%" stopColor="#00C9B1" />
        </linearGradient>
      </defs>
      <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="rgba(124,58,237,.1)" stroke="url(#slg1)" strokeWidth="1.8" />
      <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13" stroke="url(#slg2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.8" fill="url(#slg1)" />
    </svg>
  )
}

function Sidebar({ active }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="logo-link" onClick={() => navigate('/')}>
          <SidebarLogo />
          <span className="sb-logo-txt">Vendor<b>Verse</b></span>
        </div>
      </div>
      <div className="sb-sec">
        <span className="sb-lbl">Main</span>
        <button className={`sb-a${active === 'overview' ? ' on' : ''}`} onClick={() => navigate('/dashboard')}><span className="sb-ic">📊</span>Overview</button>
        <button className={`sb-a${active === 'products' ? ' on' : ''}`} onClick={() => navigate('/dashboard/products')}><span className="sb-ic">📦</span>Products</button>
        <button className={`sb-a${active === 'shop' ? ' on' : ''}`} onClick={() => navigate('/dashboard/shop')}><span className="sb-ic">🏪</span>My Shop</button>
        <button className={`sb-a${active === 'reviews' ? ' on' : ''}`} onClick={() => navigate('/dashboard/reviews')}><span className="sb-ic">⭐</span>Reviews</button>
      </div>
      <div className="sb-sec" style={{ marginTop: 8 }}>
        <span className="sb-lbl">Other</span>
        <button className="sb-a" onClick={() => navigate('/explore')}><span className="sb-ic">🔍</span>Explore</button>
        <button className="sb-a logout" onClick={logout}><span className="sb-ic">🚪</span>Logout</button>
      </div>
    </aside>
  )
}

// ─── MOCK DATA ────────────────────────────────────────────
const INIT_SHOP = {
  shopName:     "Ravi's Kitchen",
  ownerName:    'Ravi Kumar',
  category:     'Food & Beverages',
  address:      '12 Gandhi Nagar, RS Puram',
  city:         'Coimbatore',
  phone:        '+91 98765 43210',
  email:        'ravi@raviskitchen.in',
  openingHours: '7:00 AM – 10:00 PM',
  description:  'Authentic South Indian food made with love and the freshest ingredients every day. Specialising in traditional Coimbatore-style cuisine — from crispy dosas and fluffy idlis to wholesome thali meals. Serving our community for over 15 years.',
  isOpen:       true,
  emoji:        '🍱',
  coverGradient:'linear-gradient(135deg, #FFF4EE, #FFF0F0)',
}

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.42, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] } })
}

export default function MyShop() {
  const [shop, setShop]         = useState(INIT_SHOP)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(INIT_SHOP)

  const openEdit  = () => { setForm({ ...shop }); setShowModal(true) }
  const closeEdit = () => setShowModal(false)
  const handleSave = () => { setShop({ ...form }); closeEdit() }

  const INFO = [
    { label: 'Owner Name',    value: shop.ownerName,    icon: '👤' },
    { label: 'Category',      value: shop.category,     icon: '📂' },
    { label: 'Phone',         value: shop.phone,         icon: '📞' },
    { label: 'Email',         value: shop.email,         icon: '📧' },
    { label: 'Address',       value: `${shop.address}, ${shop.city}`, icon: '📍' },
    { label: 'Opening Hours', value: shop.openingHours,  icon: '🕐' },
  ]

  return (
    <div className="shop-wrap">
      <Sidebar active="shop" />

      <main className="shop-main">
        {/* ── Header ── */}
        <motion.div className="shop-hd" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div>
            <div className="shop-title">My Shop</div>
            <div className="shop-sub">Manage your vendor profile</div>
          </div>
          <button className="btn bp bsm" onClick={openEdit}>✏️ Edit profile</button>
        </motion.div>

        {/* ── Cover + Profile Card ── */}
        <motion.div className="shop-profile-card" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          {/* cover image */}
          <div className="shop-cover" style={{ background: shop.coverGradient }}>
            <span style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.15))' }}>
              {shop.emoji}
            </span>
            <div className="shop-cover-overlay" />
          </div>

          <div className="shop-profile-inner">
            {/* logo row */}
            <div className="shop-logo-row">
              <div className="shop-logo">{shop.emoji}</div>
              <div className="shop-name-block">
                <div className="name">{shop.shopName}</div>
                <div className="cat">{shop.category}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className={`shop-status ${shop.isOpen ? 'open' : 'closed'}`}>
                  {shop.isOpen ? '● Open now' : '● Closed'}
                </span>
              </div>
            </div>

            {/* info grid */}
            <div className="shop-info-grid">
              {INFO.map(item => (
                <div key={item.label} className="shop-info-item">
                  <div className="shop-info-lbl">{item.label}</div>
                  <div className="shop-info-val"><span>{item.icon}</span>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Description Card ── */}
        <motion.div className="shop-desc-card" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <div className="shop-desc-title">About this shop</div>
          <div className="shop-desc-text">{shop.description}</div>
        </motion.div>
      </main>

      {/* ── Edit Profile Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="sm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="sm-modal" initial={{ y: 24, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 16, opacity: 0 }}>
              <div className="sm-hd">
                <div className="sm-title">Edit shop profile</div>
                <button className="sm-close" onClick={closeEdit}>✕</button>
              </div>

              <div className="sm-2col">
                <div className="sm-field">
                  <label className="sm-label">Shop name</label>
                  <input className="sm-input" value={form.shopName} onChange={e => setForm(f => ({ ...f, shopName: e.target.value }))} />
                </div>
                <div className="sm-field">
                  <label className="sm-label">Owner name</label>
                  <input className="sm-input" value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} />
                </div>
              </div>

              <div className="sm-2col">
                <div className="sm-field">
                  <label className="sm-label">Category</label>
                  <select className="sm-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {['Food & Beverages','Grocery','Tailoring','Beauty & Wellness','Electronics Repair','Home Repair','Electrician','Bakery','Local Services'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm-field">
                  <label className="sm-label">Shop emoji</label>
                  <input className="sm-input" maxLength={2} value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
                </div>
              </div>

              <div className="sm-field">
                <label className="sm-label">Address</label>
                <input className="sm-input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>

              <div className="sm-2col">
                <div className="sm-field">
                  <label className="sm-label">City</label>
                  <input className="sm-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div className="sm-field">
                  <label className="sm-label">Phone</label>
                  <input className="sm-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>

              <div className="sm-2col">
                <div className="sm-field">
                  <label className="sm-label">Email</label>
                  <input className="sm-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="sm-field">
                  <label className="sm-label">Opening hours</label>
                  <input className="sm-input" value={form.openingHours} onChange={e => setForm(f => ({ ...f, openingHours: e.target.value }))} />
                </div>
              </div>

              <div className="sm-field">
                <label className="sm-label">Description</label>
                <textarea className="sm-input" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="sm-field" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label className="tog">
                  <input type="checkbox" checked={form.isOpen} onChange={e => setForm(f => ({ ...f, isOpen: e.target.checked }))} />
                  <span className="tog-sl" />
                </label>
                <span style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 600 }}>Shop is currently open</span>
              </div>

              <div className="sm-foot">
                <button className="btn bg bsm" onClick={closeEdit}>Cancel</button>
                <button className="btn bp bsm" onClick={handleSave}>Save changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}