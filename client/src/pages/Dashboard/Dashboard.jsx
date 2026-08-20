// src/pages/Dashboard/Dashboard.jsx

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

// ─── MOCK DATA ─────────────────────────────────────────────

const MOCK_VENDOR = {
  rating: 4.8,
  reviewCount: 23,
  isOpen: true,
}

const MOCK_PRODUCTS = [
  {
    _id: 'dp1',
    name: 'Masala Dosa',
    price: 60,
    category: 'Food',
    available: true,
  },
  {
    _id: 'dp2',
    name: 'Filter Coffee',
    price: 25,
    category: 'Food',
    available: true,
  },
  {
    _id: 'dp3',
    name: 'Thali Meals',
    price: 120,
    category: 'Food',
    available: true,
  },
  {
    _id: 'dp4',
    name: 'Cold Coffee',
    price: 45,
    category: 'Beverage',
    available: false,
  },
  {
    _id: 'dp5',
    name: 'Veg Puff',
    price: 30,
    category: 'Snacks',
    available: true,
  },
]

const MOCK_RECENT_REVIEWS = []

// ─── ANIMATION ─────────────────────────────────────────────

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

  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),

    products: (
      <>
        <path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z" />
        <path d="m3 8.5 9 5.5 9-5.5" />
        <path d="M12 14v7" />
      </>
    ),

    shop: (
      <>
        <path d="M4 10v10h16V10" />
        <path d="M3 10 5 4h14l2 6" />
        <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        <path d="M9 20v-5h6v5" />
      </>
    ),

    reviews: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.3-.65L4 20l1.65-4.15A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
        <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),

    logout: (
      <>
        <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" />
        <path d="m15 16 4-4-4-4" />
        <path d="M19 12H9" />
      </>
    ),

    box: (
      <>
        <path d="m21 8-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
        <path d="m7.5 5.5 9 5" />
      </>
    ),

    star: (
      <path d="m12 3 2.75 5.58 6.16.9-4.46 4.35 1.05 6.14L12 17.07l-5.5 2.9 1.05-6.14-4.46-4.35 6.16-.9L12 3Z" />
    ),

    check: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),

    food: (
      <>
        <path d="M6 3v8" />
        <path d="M4 3v5a2 2 0 0 0 4 0V3" />
        <path d="M6 10v11" />
        <path d="M15 3v18" />
        <path d="M15 3c3 1 4 3 4 6h-4" />
      </>
    ),

    beverage: (
      <>
        <path d="M5 4h14" />
        <path d="M7 4v7a5 5 0 0 0 10 0V4" />
        <path d="M9 21h6" />
        <path d="M12 16v5" />
      </>
    ),

    snack: (
      <>
        <path d="M5 5h14v14H5z" />
        <path d="M8 9h8M8 13h5M8 17h3" />
      </>
    ),

    defaultProduct: (
      <>
        <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
        <path d="M4 7.5 12 12l8-4.5" />
        <path d="M12 12v9" />
      </>
    ),
  }

  return <svg {...common}>{paths[type] || paths.defaultProduct}</svg>
}

// ─── SIDEBAR LOGO ───────────────────────────────────────────

function SidebarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient
          id="sb-lg1"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F72585" />
        </linearGradient>

        <linearGradient
          id="sb-lg2"
          x1="0"
          y1="40"
          x2="40"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFAB00" />
          <stop offset="100%" stopColor="#00C9B1" />
        </linearGradient>
      </defs>

      <path
        d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z"
        fill="rgba(124,58,237,.1)"
        stroke="url(#sb-lg1)"
        strokeWidth="1.8"
      />

      <path
        d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13"
        stroke="url(#sb-lg2)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="20"
        cy="20"
        r="2.8"
        fill="url(#sb-lg1)"
      />
    </svg>
  )
}

// ─── PRODUCT ICON ───────────────────────────────────────────

function ProductIcon({ category }) {
  const normalized = String(category || '').toLowerCase()

  let type = 'defaultProduct'

  if (
    normalized.includes('food') ||
    normalized.includes('bakery') ||
    normalized.includes('snack')
  ) {
    type = 'food'
  } else if (
    normalized.includes('beverage') ||
    normalized.includes('drink')
  ) {
    type = 'beverage'
  } else if (
    normalized.includes('snack')
  ) {
    type = 'snack'
  }

  return (
    <span
      style={{
        width: 38,
        height: 38,
        minWidth: 38,
        borderRadius: 11,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #F5F0FF 0%, #FFF0F6 100%)',
        color: '#7C3AED',
        border: '1px solid rgba(124,58,237,.10)',
        boxShadow: '0 4px 12px rgba(124,58,237,.08)',
      }}
    >
      <Icon type={type} size={18} />
    </span>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const firstName =
    user?.name?.split(' ')[0] || 'Vendor'

  const recentProducts = MOCK_PRODUCTS.slice(0, 5)

  return (
    <div className="dash-wrap">

      {/* ═══════════════════ SIDEBAR ═══════════════════ */}

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

          <button className="sb-a on">
            <span className="sb-ic">
              <Icon type="dashboard" size={18} />
            </span>
            Overview
          </button>

          <button
            className="sb-a"
            onClick={() =>
              navigate('/dashboard/products')
            }
          >
            <span className="sb-ic">
              <Icon type="products" size={18} />
            </span>
            Products
          </button>

          <button
            className="sb-a"
            onClick={() =>
              navigate('/dashboard/shop')
            }
          >
            <span className="sb-ic">
              <Icon type="shop" size={18} />
            </span>
            My Shop
          </button>

          <button
            className="sb-a"
            onClick={() =>
              navigate('/dashboard/reviews')
            }
          >
            <span className="sb-ic">
              <Icon type="reviews" size={18} />
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
            onClick={() => navigate('/explore')}
          >
            <span className="sb-ic">
              <Icon type="search" size={18} />
            </span>
            Explore
          </button>

          <button
            className="sb-a logout"
            onClick={logout}
          >
            <span className="sb-ic">
              <Icon type="logout" size={18} />
            </span>
            Logout
          </button>
        </div>
      </aside>

      {/* ═══════════════════ MAIN ═══════════════════ */}

      <main className="dmain">

        {/* Header */}

        <motion.div
          className="dash-hd"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div>
            <div className="dash-title">
              Dashboard
            </div>

            <div className="dash-sub">
              Welcome back, {firstName}! Here's your
              shop overview.
            </div>
          </div>

          <button
            className="btn bp bsm"
            onClick={() =>
              navigate('/dashboard/products')
            }
          >
            + Add product
          </button>
        </motion.div>

        {/* KPI CARDS */}

        <motion.div
          className="kpis"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >

          {/* Products */}

          <div className="kpi">
            <div
              className="kpi-blob"
              style={{ background: 'var(--v)' }}
            />

            <div
              className="kpi-ic"
              style={{ background: 'var(--vl)' }}
            >
              <Icon type="products" size={20} />
            </div>

            <div className="kpi-lbl">
              Products
            </div>

            <div className="kpi-n">
              {MOCK_PRODUCTS.length}
            </div>

            <div className="kpi-tr">
              ↑ In your shop
            </div>
          </div>

          {/* Rating */}

          <div className="kpi">
            <div
              className="kpi-blob"
              style={{ background: 'var(--amber)' }}
            />

            <div
              className="kpi-ic"
              style={{ background: 'var(--amberl)' }}
            >
              <Icon type="star" size={20} />
            </div>

            <div className="kpi-lbl">
              Avg Rating
            </div>

            <div className="kpi-n">
              {MOCK_VENDOR.rating || '—'}
            </div>

            <div className="kpi-tr">
              Customer score
            </div>
          </div>

          {/* Reviews */}

          <div className="kpi">
            <div
              className="kpi-blob"
              style={{ background: 'var(--green)' }}
            />

            <div
              className="kpi-ic"
              style={{ background: 'var(--greenl)' }}
            >
              <Icon type="reviews" size={20} />
            </div>

            <div className="kpi-lbl">
              Reviews
            </div>

            <div className="kpi-n">
              {MOCK_VENDOR.reviewCount}
            </div>

            <div className="kpi-tr">
              Total feedback
            </div>
          </div>

          {/* Status */}

          <div className="kpi">
            <div
              className="kpi-blob"
              style={{ background: 'var(--teal)' }}
            />

            <div
              className="kpi-ic"
              style={{ background: 'var(--teall)' }}
            >
              <Icon type="check" size={20} />
            </div>

            <div className="kpi-lbl">
              Status
            </div>

            <div className="kpi-n kpi-n-sm">
              {MOCK_VENDOR.isOpen ? (
                <span style={{ color: 'var(--green)' }}>
                  Open
                </span>
              ) : (
                <span style={{ color: 'var(--coral)' }}>
                  Closed
                </span>
              )}
            </div>

            <div className="kpi-tr">
              Shop visibility
            </div>
          </div>

        </motion.div>

        {/* ═══════════════════ RECENT PRODUCTS ═══════════════════ */}

        <motion.div
          className="dcard"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="dcard-hd">
            <div className="dcard-t">
              Recent products
            </div>

            <button
              className="btn bg bsm"
              onClick={() =>
                navigate('/dashboard/products')
              }
            >
              Manage all →
            </button>
          </div>

          {recentProducts.length > 0 ? (
            <div>

              <div className="pt-head">
                <div>Product</div>
                <div>Price</div>
                <div>Category</div>
                <div>Available</div>
                <div></div>
              </div>

              {recentProducts.map((p) => (
                <div
                  key={p._id}
                  className="pt-row"
                >

                  <div className="pt-n">

                    {/* Professional product thumbnail */}

                    <ProductIcon
                      category={p.category}
                    />

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: 'var(--ink)',
                        }}
                      >
                        {p.name}
                      </span>

                      <span
                        style={{
                          fontSize: 11,
                          color: 'var(--muted)',
                        }}
                      >
                        {p.category}
                      </span>
                    </div>

                  </div>

                  <div className="pt-p">
                    ₹{p.price}
                  </div>

                  <div
                    style={{
                      color: 'var(--ink2)',
                      fontSize: 13,
                    }}
                  >
                    {p.category}
                  </div>

                  <div>
                    <span
                      className={`badge ${
                        p.available
                          ? 'bg2'
                          : 'bc2'
                      }`}
                      style={{
                        fontSize: 10,
                      }}
                    >
                      {p.available
                        ? 'Yes'
                        : 'No'}
                    </span>
                  </div>

                  <div />

                </div>
              ))}

            </div>
          ) : (
            <div className="empty">

              <span
                className="empty-em"
                style={{
                  display: 'inline-flex',
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                  background:
                    'linear-gradient(135deg,#F5F0FF,#FFF0F6)',
                  color: '#7C3AED',
                }}
              >
                <Icon
                  type="products"
                  size={26}
                />
              </span>

              <h3>
                No products yet
              </h3>

              <p>
                Start by adding a product
                to your shop.
              </p>

            </div>
          )}
        </motion.div>

        {/* ═══════════════════ RECENT REVIEWS ═══════════════════ */}

        <motion.div
          className="dcard"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="dcard-hd">

            <div className="dcard-t">
              Recent reviews
            </div>

            <button
              className="btn bg bsm"
              onClick={() =>
                navigate('/dashboard/reviews')
              }
            >
              View all →
            </button>

          </div>

          {MOCK_RECENT_REVIEWS.length > 0 ? (
            MOCK_RECENT_REVIEWS.map((r) => (
              <div
                key={r._id}
                className="rev-item"
              >
                <div className="rev-hd">

                  <div
                    className="rev-av"
                    style={{
                      background:
                        r.color || '#7C3AED',
                    }}
                  >
                    {r.name[0]}
                  </div>

                  <div>
                    <div className="rev-name">
                      {r.name}
                    </div>

                    <div className="rev-dt">
                      {new Date(
                        r.date
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="rev-str">
                    {'★'.repeat(r.rating)}
                  </div>

                </div>

                <div className="rev-text">
                  {r.comment}
                </div>
              </div>
            ))
          ) : (
            <div className="empty">

              <span
                className="empty-em"
                style={{
                  display: 'inline-flex',
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                  background:
                    'linear-gradient(135deg,#FFF8E1,#FFF0F6)',
                  color: '#F59E0B',
                }}
              >
                <Icon
                  type="star"
                  size={25}
                />
              </span>

              <h3>
                No reviews yet
              </h3>

              <p>
                Customer reviews will
                appear here.
              </p>

            </div>
          )}

        </motion.div>

      </main>
    </div>
  )
}