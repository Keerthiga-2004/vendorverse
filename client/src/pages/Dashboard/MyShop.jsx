// src/pages/Dashboard/MyShop.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './MyShop.css'

// ─── ICON SYSTEM ───────────────────────────────────────────

function Icon({
  type,
  size = 20,
  strokeWidth = 1.8,
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  const icons = {
    user: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),

    category: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),

    phone: (
      <>
        <rect
          x="7"
          y="3"
          width="10"
          height="18"
          rx="2"
        />
        <path d="M10 6h4" />
        <path d="M11.5 18h1" />
      </>
    ),

    email: (
      <>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />
        <path d="m4 7 8 6 8-6" />
      </>
    ),

    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),

    edit: (
      <>
        <path d="m4 16-.7 4.7L8 20l11.2-11.2a2.2 2.2 0 0 0-3.1-3.1L4.9 16.9" />
        <path d="m14.8 6.2 3 3" />
      </>
    ),

    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),

    store: (
      <>
        <path d="M4 10v10h16V10" />
        <path d="M3 10 5 4h14l2 6" />
        <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        <path d="M9 20v-5h6v5" />
      </>
    ),

    coffee: (
      <>
        <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
        <path d="M16 10h2a3 3 0 0 1 0 6h-2" />
        <path d="M8 5c0-1 1-1 1-2" />
        <path d="M12 5c0-1 1-1 1-2" />
        <path d="M5 21h12" />
      </>
    ),
  }

  return (
    <svg {...common}>
      {icons[type] || icons.store}
    </svg>
  )
}

// ─── SIDEBAR LOGO ──────────────────────────────────────────

function SidebarLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 40 40"
      fill="none"
    >
      <defs>
        <linearGradient
          id="myshop-lg1"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="#7C3AED"
          />

          <stop
            offset="100%"
            stopColor="#F72585"
          />
        </linearGradient>

        <linearGradient
          id="myshop-lg2"
          x1="0"
          y1="40"
          x2="40"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="#FFAB00"
          />

          <stop
            offset="100%"
            stopColor="#00C9B1"
          />
        </linearGradient>
      </defs>

      <path
        d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z"
        fill="rgba(124,58,237,.1)"
        stroke="url(#myshop-lg1)"
        strokeWidth="1.8"
      />

      <path
        d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13"
        stroke="url(#myshop-lg2)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="20"
        cy="20"
        r="2.8"
        fill="url(#myshop-lg1)"
      />
    </svg>
  )
}

// ─── SIDEBAR ────────────────────────────────────────────────

function Sidebar({ active }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <aside className="sb">

      <div className="sb-logo">
        <div
          className="logo-link"
          onClick={() => navigate('/')}
        >
          <SidebarLogo />

          <span className="sb-logo-txt">
            Vendor<b>Verse</b>
          </span>
        </div>
      </div>

      <div className="sb-sec">
        <span className="sb-lbl">
          Main
        </span>

        <button
          className={`sb-a${
            active === 'overview'
              ? ' on'
              : ''
          }`}
          onClick={() =>
            navigate('/dashboard')
          }
        >
          <span className="sb-ic">
            <Icon
              type="dashboard"
              size={18}
            />
          </span>
          Overview
        </button>

        <button
          className={`sb-a${
            active === 'products'
              ? ' on'
              : ''
          }`}
          onClick={() =>
            navigate('/dashboard/products')
          }
        >
          <span className="sb-ic">
            <Icon
              type="products"
              size={18}
            />
          </span>
          Products
        </button>

        <button
          className={`sb-a${
            active === 'shop'
              ? ' on'
              : ''
          }`}
          onClick={() =>
            navigate('/dashboard/shop')
          }
        >
          <span className="sb-ic">
            <Icon
              type="store"
              size={18}
            />
          </span>
          My Shop
        </button>

        <button
          className={`sb-a${
            active === 'reviews'
              ? ' on'
              : ''
          }`}
          onClick={() =>
            navigate('/dashboard/reviews')
          }
        >
          <span className="sb-ic">
            <Icon
              type="reviews"
              size={18}
            />
          </span>
          Reviews
        </button>
      </div>

      <div
        className="sb-sec"
        style={{ marginTop: 8 }}
      >
        <span className="sb-lbl">
          Other
        </span>

        <button
          className="sb-a"
          onClick={() =>
            navigate('/explore')
          }
        >
          <span className="sb-ic">
            <Icon
              type="search"
              size={18}
            />
          </span>
          Explore
        </button>

        <button
          className="sb-a logout"
          onClick={logout}
        >
          <span className="sb-ic">
            <Icon
              type="logout"
              size={18}
            />
          </span>
          Logout
        </button>
      </div>

    </aside>
  )
}

// ─── MOCK SHOP ──────────────────────────────────────────────

const INIT_SHOP = {
  shopName: 'sai cafe',
  ownerName: 'Sai Kumar',
  category: 'Food & Beverages',
  address: 'church street 123',
  city: 'Chennai',
  phone: '1234567890',
  email: 'kiki1234@gmail.com',
  openingHours: '8am–9pm',
  description:
    'A welcoming local cafe serving fresh food and beverages for the neighbourhood.',
  isOpen: true,
}

// ─── ANIMATION ──────────────────────────────────────────────

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      delay: i * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

// ─── MAIN ──────────────────────────────────────────────────

export default function MyShop() {
  const [shop, setShop] =
    useState(INIT_SHOP)

  const [showModal, setShowModal] =
    useState(false)

  const [form, setForm] =
    useState(INIT_SHOP)

  const openEdit = () => {
    setForm({
      ...shop,
    })

    setShowModal(true)
  }

  const closeEdit = () => {
    setShowModal(false)
  }

  const handleSave = () => {
    setShop({
      ...form,
    })

    closeEdit()
  }

  const INFO = [
    {
      label: 'Owner Name',
      value: shop.ownerName,
      icon: 'user',
    },

    {
      label: 'Category',
      value: shop.category,
      icon: 'category',
    },

    {
      label: 'Phone',
      value: shop.phone,
      icon: 'phone',
    },

    {
      label: 'Email',
      value: shop.email,
      icon: 'email',
    },

    {
      label: 'Address',
      value: `${shop.address}, ${shop.city}`,
      icon: 'location',
    },

    {
      label: 'Opening Hours',
      value: shop.openingHours,
      icon: 'clock',
    },
  ]

  return (
    <div className="shop-wrap">

      <Sidebar active="shop" />

      <main className="shop-main">

        {/* HEADER */}

        <motion.div
          className="shop-hd"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div>
            <div className="shop-title">
              My Shop
            </div>

            <div className="shop-sub">
              Manage your vendor profile
            </div>
          </div>

          <button
            className="btn bp bsm"
            onClick={openEdit}
          >
            <span
              style={{
                display: 'inline-flex',
                marginRight: 6,
                verticalAlign: 'middle',
              }}
            >
              <Icon
                type="edit"
                size={14}
                strokeWidth={2}
              />
            </span>

            Edit profile
          </button>
        </motion.div>

        {/* PROFILE CARD */}

        <motion.div
          className="shop-profile-card"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >

          {/* PROFESSIONAL COVER */}

          <div
            className="shop-cover"
            style={{
              background:
                'linear-gradient(135deg, #FFF7ED 0%, #F5F0FF 52%, #FDF2F8 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >

            {/* decorative shapes */}

            <div
              style={{
                position: 'absolute',
                width: 230,
                height: 230,
                borderRadius: '50%',
                background:
                  'rgba(124,58,237,.08)',
                top: -100,
                right: 80,
              }}
            />

            <div
              style={{
                position: 'absolute',
                width: 170,
                height: 170,
                borderRadius: '50%',
                background:
                  'rgba(247,37,133,.07)',
                bottom: -90,
                left: 90,
              }}
            />

            {/* storefront illustration */}

            <div
              style={{
                position: 'relative',
                zIndex: 2,
                width: 118,
                height: 92,
                borderRadius: 18,
                background:
                  'rgba(255,255,255,.82)',
                border:
                  '1px solid rgba(124,58,237,.10)',
                boxShadow:
                  '0 16px 40px rgba(76,29,149,.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Icon
                  type="coffee"
                  size={38}
                  strokeWidth={1.55}
                />

                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '1.4px',
                    color: '#6D28D9',
                    textTransform: 'uppercase',
                  }}
                >
                  Local Cafe
                </span>
              </div>
            </div>

            <div className="shop-cover-overlay" />

          </div>

          <div className="shop-profile-inner">

            {/* SHOP LOGO + NAME */}

            <div className="shop-logo-row">

              <div
                className="shop-logo"
                style={{
                  background:
                    'linear-gradient(135deg,#7C3AED,#F72585)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    '0 10px 24px rgba(124,58,237,.22)',
                  border:
                    '4px solid #fff',
                }}
              >
                <Icon
                  type="store"
                  size={30}
                  strokeWidth={1.65}
                />
              </div>

              <div className="shop-name-block">

                <div className="name">
                  {shop.shopName}
                </div>

                <div className="cat">
                  {shop.category}
                </div>

              </div>

              <div
                style={{
                  marginLeft: 'auto',
                }}
              >
                <span
                  className={`shop-status ${
                    shop.isOpen
                      ? 'open'
                      : 'closed'
                  }`}
                >
                  {shop.isOpen
                    ? '● Open now'
                    : '● Closed'}
                </span>
              </div>

            </div>

            {/* INFO GRID */}

            <div className="shop-info-grid">

              {INFO.map((item) => (
                <div
                  key={item.label}
                  className="shop-info-item"
                >

                  <div className="shop-info-lbl">
                    {item.label}
                  </div>

                  <div className="shop-info-val">

                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          'linear-gradient(135deg,#F5F0FF,#FFF0F6)',
                        color: '#7C3AED',
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        type={item.icon}
                        size={14}
                        strokeWidth={1.8}
                      />
                    </span>

                    {item.value}

                  </div>

                </div>
              ))}

            </div>

          </div>

        </motion.div>

        {/* ABOUT */}

        <motion.div
          className="shop-desc-card"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="shop-desc-title">
            About this shop
          </div>

          <div className="shop-desc-text">
            {shop.description}
          </div>
        </motion.div>

      </main>

      {/* EDIT MODAL */}

      <AnimatePresence>

        {showModal && (
          <motion.div
            className="sm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="sm-modal"
              initial={{
                y: 24,
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                y: 16,
                opacity: 0,
              }}
            >

              <div className="sm-hd">

                <div className="sm-title">
                  Edit shop profile
                </div>

                <button
                  className="sm-close"
                  onClick={closeEdit}
                >
                  <Icon
                    type="close"
                    size={17}
                  />
                </button>

              </div>

              <div className="sm-2col">

                <div className="sm-field">
                  <label className="sm-label">
                    Shop name
                  </label>

                  <input
                    className="sm-input"
                    value={form.shopName}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        shopName:
                          e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="sm-field">
                  <label className="sm-label">
                    Owner name
                  </label>

                  <input
                    className="sm-input"
                    value={form.ownerName}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        ownerName:
                          e.target.value,
                      }))
                    }
                  />
                </div>

              </div>

              <div className="sm-2col">

                <div className="sm-field">
                  <label className="sm-label">
                    Category
                  </label>

                  <select
                    className="sm-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category:
                          e.target.value,
                      }))
                    }
                  >
                    {[
                      'Food & Beverages',
                      'Grocery',
                      'Tailoring',
                      'Beauty & Wellness',
                      'Electronics Repair',
                      'Home Repair',
                      'Electrician',
                      'Bakery',
                      'Local Services',
                    ].map((c) => (
                      <option
                        key={c}
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="sm-field">

                <label className="sm-label">
                  Address
                </label>

                <input
                  className="sm-input"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      address:
                        e.target.value,
                    }))
                  }
                />

              </div>

              <div className="sm-2col">

                <div className="sm-field">

                  <label className="sm-label">
                    City
                  </label>

                  <input
                    className="sm-input"
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        city:
                          e.target.value,
                      }))
                    }
                  />

                </div>

                <div className="sm-field">

                  <label className="sm-label">
                    Phone
                  </label>

                  <input
                    className="sm-input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        phone:
                          e.target.value,
                      }))
                    }
                  />

                </div>

              </div>

              <div className="sm-2col">

                <div className="sm-field">

                  <label className="sm-label">
                    Email
                  </label>

                  <input
                    className="sm-input"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        email:
                          e.target.value,
                      }))
                    }
                  />

                </div>

                <div className="sm-field">

                  <label className="sm-label">
                    Opening hours
                  </label>

                  <input
                    className="sm-input"
                    value={
                      form.openingHours
                    }
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        openingHours:
                          e.target.value,
                      }))
                    }
                  />

                </div>

              </div>

              <div className="sm-field">

                <label className="sm-label">
                  Description
                </label>

                <textarea
                  className="sm-input"
                  rows={4}
                  value={
                    form.description
                  }
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description:
                        e.target.value,
                    }))
                  }
                />

              </div>

              <div
                className="sm-field"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >

                <label className="tog">

                  <input
                    type="checkbox"
                    checked={form.isOpen}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        isOpen:
                          e.target.checked,
                      }))
                    }
                  />

                  <span className="tog-sl" />

                </label>

                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--ink2)',
                    fontWeight: 600,
                  }}
                >
                  Shop is currently open
                </span>

              </div>

              <div className="sm-foot">

                <button
                  className="btn bg bsm"
                  onClick={closeEdit}
                >
                  Cancel
                </button>

                <button
                  className="btn bp bsm"
                  onClick={handleSave}
                >
                  Save changes
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  )
}