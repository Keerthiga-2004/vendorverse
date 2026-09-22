// src/pages/Dashboard/Dashboard.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './Dashboard.css'

// ─── ANIMATION ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
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

// ─── ICON SYSTEM ──────────────────────────────────────────
function Icon({ type, size = 20, strokeWidth = 1.8 }) {
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

    star: (
      <path d="m12 3 2.75 5.58 6.16.9-4.46 4.35 1.05 6.14L12 17.07l-5.5 2.9 1.05-6.14-4.46-4.35 6.16-.9L12 3Z" />
    ),

    check: (
      <path d="M20 6 9 17l-5-5" />
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

// ─── SIDEBAR LOGO ──────────────────────────────────────────
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

      <circle cx="20" cy="20" r="2.8" fill="url(#sb-lg1)" />
    </svg>
  )
}

// ─── PRODUCT ICON ──────────────────────────────────────────
function ProductIcon({ product }) {
  const normalized = String(product?.category || '').toLowerCase()

  let type = 'defaultProduct'

  if (
    normalized.includes('food') ||
    normalized.includes('bakery')
  ) {
    type = 'food'
  } else if (
    normalized.includes('beverage') ||
    normalized.includes('drink')
  ) {
    type = 'beverage'
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
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {product?.image ? (
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Icon type={type} size={18} />
      )}
    </span>
  )
}

// ─── STAR DISPLAY ──────────────────────────────────────────
function StarRating({ rating = 0 }) {
  const rounded = Math.round(Number(rating) || 0)

  return (
    <span
      style={{
        color: '#F59E0B',
        fontSize: 13,
        letterSpacing: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {'★'.repeat(rounded)}
      {'☆'.repeat(5 - rounded)}
    </span>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)

  const firstName = user?.name?.split(' ')[0] || 'Vendor'

  // ─── FETCH REAL VENDOR PROFILE ─────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile')
        setProfile(data)
      } catch (err) {
        console.error(
          'Dashboard: failed to load profile',
          err.message
        )
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [])

  // ─── FETCH REAL PRODUCTS ───────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products/vendor')

        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(
          'Dashboard: failed to load products',
          err.message
        )
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  // ─── FETCH REAL REVIEWS ────────────────────────────────
  useEffect(() => {
    if (!user?._id) {
      setLoadingReviews(false)
      return
    }

    const fetchReviews = async () => {
      try {
        const { data } = await api.get(
          `/reviews/${user._id}`
        )

        setReviews(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(
          'Dashboard: failed to load reviews',
          err.message
        )
        setReviews([])
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [user?._id])

  // ─── RECENT PRODUCTS ───────────────────────────────────
  const recentProducts = products.slice(0, 5)

  // ─── RECENT REVIEWS ────────────────────────────────────
  const recentReviews = reviews.slice(0, 3)

  // ─── KPI VALUES ────────────────────────────────────────
  const kpiProducts =
    loadingProducts ? '…' : products.length

  const kpiRating =
    loadingProfile
      ? '…'
      : profile?.rating > 0
        ? Number(profile.rating).toFixed(1)
        : '—'

  const kpiReviews =
    loadingProfile
      ? '…'
      : (profile?.reviewCount ?? reviews.length)

  const kpiIsOpen =
    loadingProfile
      ? null
      : (profile?.isOpen ?? false)

  return (
    <div className="dash-wrap">

      {/* ═══════════════ SIDEBAR ═══════════════ */}
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
            onClick={() => navigate('/dashboard/products')}
          >
            <span className="sb-ic">
              <Icon type="products" size={18} />
            </span>
            Products
          </button>

          <button
            className="sb-a"
            onClick={() => navigate('/dashboard/shop')}
          >
            <span className="sb-ic">
              <Icon type="shop" size={18} />
            </span>
            My Shop
          </button>

          <button
            className="sb-a"
            onClick={() => navigate('/dashboard/reviews')}
          >
            <span className="sb-ic">
              <Icon type="reviews" size={18} />
            </span>
            Reviews
          </button>

          <button
            className="sb-a"
            onClick={() => navigate('/dashboard/analytics')}
          >
            <span className="sb-ic">
              📈
            </span>
            Analytics
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

      {/* ═══════════════ MAIN ═══════════════ */}
      <main className="dmain">

        {/* HEADER */}
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
              Welcome back, {firstName}! Here's your shop overview.
            </div>
          </div>

          <button
            className="btn bp bsm"
            onClick={() => navigate('/dashboard/products')}
          >
            + Add product
          </button>
        </motion.div>

        {/* ═══ KPI CARDS ═══ */}
        <motion.div
          className="kpis"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >

          {/* PRODUCTS */}
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
              {kpiProducts}
            </div>

            <div className="kpi-tr">
              In your shop
            </div>

          </div>

          {/* RATING */}
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
              {kpiRating}
            </div>

            <div className="kpi-tr">
              Customer score
            </div>

          </div>

          {/* REVIEWS */}
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
              {kpiReviews}
            </div>

            <div className="kpi-tr">
              Total feedback
            </div>

          </div>

          {/* STATUS */}
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

              {kpiIsOpen === null ? (
                <span style={{ color: 'var(--ink3)' }}>
                  …
                </span>
              ) : kpiIsOpen ? (
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

              {kpiIsOpen !== null && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--v)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: 0,
                  }}
                  onClick={() =>
                    navigate('/dashboard/shop')
                  }
                >
                  Change in My Shop →
                </button>
              )}

            </div>

          </div>

        </motion.div>

        {/* ═══ RECENT PRODUCTS ═══ */}
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

          {loadingProducts ? (

            <div style={{ padding: '24px 0' }}>

              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '2.5fr 1fr 1fr 1fr',
                    gap: 12,
                    padding: '14px 0',
                    borderBottom:
                      '1px solid var(--border)',
                    alignItems: 'center',
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                    }}
                  >

                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: '#EDE9FE',
                      }}
                    />

                    <div
                      style={{
                        width: 100,
                        height: 12,
                        borderRadius: 6,
                        background: '#EDE9FE',
                      }}
                    />

                  </div>

                  <div
                    style={{
                      width: 40,
                      height: 12,
                      borderRadius: 6,
                      background: '#EDE9FE',
                    }}
                  />

                  <div
                    style={{
                      width: 60,
                      height: 12,
                      borderRadius: 6,
                      background: '#EDE9FE',
                    }}
                  />

                  <div
                    style={{
                      width: 30,
                      height: 12,
                      borderRadius: 6,
                      background: '#EDE9FE',
                    }}
                  />

                </div>
              ))}

            </div>

          ) : recentProducts.length > 0 ? (

            <div>

              <div className="pt-head">
                <div>Product</div>
                <div>Price</div>
                <div>Category</div>
                <div>Available</div>
                <div />
              </div>

              {recentProducts.map((p) => (

                <div
                  key={p._id}
                  className="pt-row"
                >

                  <div className="pt-n">

                    <ProductIcon product={p} />

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
                          color: 'var(--ink3)',
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
                        p.available ? 'bg2' : 'bc2'
                      }`}
                      style={{ fontSize: 10 }}
                    >
                      {p.available ? 'Yes' : 'No'}
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
                <Icon type="products" size={26} />
              </span>

              <h3>
                No products yet
              </h3>

              <p>
                Start by adding a product to your shop.
              </p>

            </div>

          )}

        </motion.div>

        {/* ═══ RECENT REVIEWS — REAL DATA ═══ */}
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

          {loadingReviews ? (

            <div
              style={{
                padding: '32px 0',
                textAlign: 'center',
                color: 'var(--ink3)',
                fontSize: 13,
              }}
            >
              Loading reviews…
            </div>

          ) : recentReviews.length > 0 ? (

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >

              {recentReviews.map((review) => {

                const customerName =
                  review.customer?.name ||
                  'Customer'

                return (
                  <div
                    key={review._id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      padding: '16px 0',
                      borderBottom:
                        '1px solid var(--border)',
                    }}
                  >

                    <div
                      style={{
                        width: 38,
                        height: 38,
                        minWidth: 38,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          'var(--vl)',
                        color:
                          'var(--v)',
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      {customerName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            'space-between',
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >

                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--ink)',
                            fontSize: 13,
                          }}
                        >
                          {customerName}
                        </div>

                        <StarRating
                          rating={review.rating}
                        />

                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          color: 'var(--ink2)',
                          fontSize: 13,
                          lineHeight: 1.55,
                        }}
                      >
                        {review.comment ||
                          'No comment provided.'}
                      </div>

                      {review.createdAt && (
                        <div
                          style={{
                            marginTop: 5,
                            fontSize: 11,
                            color: 'var(--ink3)',
                          }}
                        >
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </div>
                      )}

                    </div>

                  </div>
                )
              })}

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
                Customer reviews will appear here once customers review your shop.
              </p>

              <button
                className="btn bg bsm"
                style={{ marginTop: 10 }}
                onClick={() =>
                  navigate('/dashboard/reviews')
                }
              >
                View reviews
              </button>

            </div>

          )}

        </motion.div>

      </main>
    </div>
  )
}