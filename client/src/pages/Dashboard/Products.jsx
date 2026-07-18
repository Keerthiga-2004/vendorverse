// src/pages/Dashboard/Products.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './Products.css'

// ─── SIDEBAR (shared layout — exact from Dashboard.jsx) ───
function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="plg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#F72585" />
        </linearGradient>
        <linearGradient id="plg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAB00" /><stop offset="100%" stopColor="#00C9B1" />
        </linearGradient>
      </defs>
      <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="rgba(124,58,237,.1)" stroke="url(#plg1)" strokeWidth="1.8" />
      <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13" stroke="url(#plg2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.8" fill="url(#plg1)" />
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
const INIT_PRODUCTS = [
  { _id: 'p1', name: 'Masala Dosa',   emoji: '🥞', price: 60,  category: 'Food',     description: 'Crispy golden dosa with spiced potato filling.',  available: true  },
  { _id: 'p2', name: 'Filter Coffee', emoji: '☕', price: 25,  category: 'Beverage', description: 'Authentic South Indian filter coffee.',            available: true  },
  { _id: 'p3', name: 'Thali Meals',   emoji: '🍱', price: 120, category: 'Food',     description: 'Full South Indian thali with rice and sambar.',    available: true  },
  { _id: 'p4', name: 'Cold Coffee',   emoji: '🧊', price: 45,  category: 'Beverage', description: 'Creamy blended cold coffee with ice.',             available: false },
  { _id: 'p5', name: 'Veg Puff',      emoji: '🥟', price: 30,  category: 'Snacks',   description: 'Flaky puff pastry with spiced vegetable filling.', available: true  },
  { _id: 'p6', name: 'Idli Sambar',   emoji: '🍚', price: 50,  category: 'Food',     description: 'Soft idlis served with hot sambar and chutney.',   available: true  },
  { _id: 'p7', name: 'Banana Leaf Meals', emoji: '🍃', price: 150, category: 'Food', description: 'Traditional banana leaf served meals.',            available: false },
]

const CATEGORIES = ['All', 'Food', 'Beverage', 'Snacks', 'Other']
const CATEGORY_BG = { Food: '#FFF4EE', Beverage: '#EFF6FF', Snacks: '#FFF8E1', Other: '#F5F0FF' }

const BLANK_FORM = { name: '', emoji: '', price: '', category: 'Food', description: '', available: true }

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.38, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] } })
}

export default function Products() {
  const [products, setProducts] = useState(INIT_PRODUCTS)
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [availFilter, setAvailFilter] = useState('All')

  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)   // null = add mode
  const [form, setForm]             = useState(BLANK_FORM)

  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── filtered list ──────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      const matchCat    = catFilter === 'All' || p.category === catFilter
      const matchAvail  = availFilter === 'All' || (availFilter === 'Available' ? p.available : !p.available)
      return matchSearch && matchCat && matchAvail
    })
  }, [products, search, catFilter, availFilter])

  // ── modal helpers ──────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null)
    setForm(BLANK_FORM)
    setShowModal(true)
  }
  const openEdit = (p) => {
    setEditTarget(p._id)
    setForm({ name: p.name, emoji: p.emoji, price: String(p.price), category: p.category, description: p.description, available: p.available })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditTarget(null); setForm(BLANK_FORM) }

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return
    if (editTarget) {
      setProducts(ps => ps.map(p => p._id === editTarget ? { ...p, ...form, price: Number(form.price) } : p))
    } else {
      const newP = { _id: 'p' + Date.now(), ...form, price: Number(form.price) }
      setProducts(ps => [newP, ...ps])
    }
    closeModal()
  }

  const handleDelete = () => {
    setProducts(ps => ps.filter(p => p._id !== deleteTarget._id))
    setDeleteTarget(null)
  }

  const toggleAvail = (id) => {
    setProducts(ps => ps.map(p => p._id === id ? { ...p, available: !p.available } : p))
  }

  return (
    <div className="prod-wrap">
      <Sidebar active="products" />

      <main className="prod-main">
        {/* ── Header ── */}
        <motion.div className="prod-hd" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div>
            <div className="prod-title">Products</div>
            <div className="prod-sub">Manage your product listings</div>
          </div>
          <button className="btn bp bsm" onClick={openAdd}>+ Add product</button>
        </motion.div>

        {/* ── Controls ── */}
        <motion.div className="prod-controls" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <div className="prod-search">
            <span>🔍</span>
            <input
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="prod-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="prod-select" value={availFilter} onChange={e => setAvailFilter(e.target.value)}>
            <option>All</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
        </motion.div>

        <div className="prod-count">Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}</div>

        {/* ── Table ── */}
        <motion.div className="prod-card" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          {filtered.length > 0 ? (
            <div className="prod-table">
              <div className="prod-thead">
                <div>Image</div>
                <div>Product</div>
                <div>Price</div>
                <div>Category</div>
                <div>Available</div>
                <div>Actions</div>
              </div>

              <AnimatePresence>
                {filtered.map((p, i) => (
                  <motion.div
                    key={p._id}
                    className="prod-row"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  >
                    {/* emoji */}
                    <div className="prod-img-cell" style={{ background: CATEGORY_BG[p.category] || '#F5F0FF' }}>
                      {p.emoji || '📦'}
                    </div>

                    {/* name + desc */}
                    <div className="prod-name-cell">
                      <div className="name">{p.name}</div>
                      {p.description && <div className="desc">{p.description.slice(0, 48)}{p.description.length > 48 ? '…' : ''}</div>}
                    </div>

                    {/* price */}
                    <div className="prod-price">₹{p.price}</div>

                    {/* category */}
                    <div>
                      <span className="badge bv" style={{ fontSize: 10 }}>{p.category}</span>
                    </div>

                    {/* availability toggle */}
                    <div>
                      <label className="tog">
                        <input type="checkbox" checked={p.available} onChange={() => toggleAvail(p._id)} />
                        <span className="tog-sl" />
                      </label>
                    </div>

                    {/* actions */}
                    <div className="prod-actions">
                      <button className="act-btn edit" onClick={() => openEdit(p)}>Edit</button>
                      <button className="act-btn del"  onClick={() => setDeleteTarget(p)}>Delete</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="prod-empty">
              <div className="prod-empty-em">📦</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="pm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pm-modal" initial={{ y: 24, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 16, opacity: 0 }}>
              <div className="pm-hd">
                <div className="pm-title">{editTarget ? 'Edit product' : 'Add product'}</div>
                <button className="pm-close" onClick={closeModal}>✕</button>
              </div>

              <div className="pm-2col">
                <div className="pm-field">
                  <label className="pm-label">Product name *</label>
                  <input className="pm-input" placeholder="e.g. Masala Dosa" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="pm-field">
                  <label className="pm-label">Price (₹) *</label>
                  <input className="pm-input" type="number" min="0" placeholder="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
              </div>

              <div className="pm-2col">
                <div className="pm-field">
                  <label className="pm-label">Category</label>
                  <select className="pm-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pm-field">
                  <label className="pm-label">Emoji icon</label>
                  <input className="pm-input" placeholder="🍱" maxLength={2} value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
                </div>
              </div>

              <div className="pm-field">
                <label className="pm-label">Description</label>
                <textarea className="pm-input" placeholder="Describe this product…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="pm-field" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label className="tog">
                  <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />
                  <span className="tog-sl" />
                </label>
                <span style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 600 }}>Available to customers</span>
              </div>

              <div className="pm-foot">
                <button className="btn bg bsm" onClick={closeModal}>Cancel</button>
                <button className="btn bp bsm" onClick={handleSave}>{editTarget ? 'Save changes' : 'Add product'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="pm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pm-modal del-modal" initial={{ y: 24, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 16, opacity: 0 }}>
              <div className="del-icon">🗑️</div>
              <div className="del-title">Delete product?</div>
              <div className="del-desc">
                Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>? This action cannot be undone.
              </div>
              <div className="del-foot">
                <button className="btn bg bsm" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="btn bc bsm" onClick={handleDelete}>Yes, delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}