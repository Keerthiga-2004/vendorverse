// src/pages/Explore/Explore.jsx

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import VendorCard from '../../components/ui/VendorCard'
import { EXPLORE_CATEGORIES } from '../../utils/vendorData'
import api from '../../services/api'
import './Explore.css'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── State ────────────────────────────────────────────────
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('cat') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [sort, setSort] = useState('newest')

  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // All cities from vendors — for city filter dropdown
  const [allCities, setAllCities] = useState([])

  // ✅ ADDED: customer coordinates for Near Me
  const [customerCoords, setCustomerCoords] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const debounceRef = useRef(null)
  const isFirstMount = useRef(true)

  // ── Fetch from server with params ────────────────────────
  const fetchVendors = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)

      const query = new URLSearchParams()

      if (params.search && params.search.trim()) {
        query.set('search', params.search.trim())
      }

      if (params.category && params.category.trim()) {
        query.set('category', params.category.trim())
      }

      if (params.city && params.city.trim()) {
        query.set('city', params.city.trim())
      }

      if (params.sort && params.sort !== 'newest') {
        query.set('sort', params.sort)
      }

      // ✅ ADDED: pass customer coordinates for distance sorting
      if (
        params.sort === 'distance' &&
        params.lat != null &&
        params.lng != null
      ) {
        query.set('lat', params.lat)
        query.set('lng', params.lng)
      }

      const { data } = await api.get(
        `/users/vendors?${query.toString()}`
      )

      setVendors(Array.isArray(data) ? data : [])

      // Build cities list from first full load (no filters)
      if (!params.search && !params.category && !params.city) {
        const cities = [
          ...new Set(
            data
              .map(v => v.city?.trim())
              .filter(Boolean)
          ),
        ].sort()

        setAllCities(cities)
      }
    } catch (err) {
      console.error('Fetch vendors error:', err)
      setError('Failed to load vendors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    fetchVendors({
      search,
      category,
      city,
      sort,
      ...(sort === 'distance' && customerCoords
        ? customerCoords
        : {}),
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Re-fetch when category / city / sort changes ─────────
  // (not search — that's debounced separately)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    fetchVendors({
      search,
      category,
      city,
      sort,
      ...(sort === 'distance' && customerCoords
        ? customerCoords
        : {}),
    })
  }, [category, city, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keep URL in sync ─────────────────────────────────────
  useEffect(() => {
    const params = {}

    if (search) params.q = search
    if (category) params.cat = category
    if (city) params.city = city

    setSearchParams(params, { replace: true })
  }, [search, category, city]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Re-sync state from URL ───────────────────────────────
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const cat = searchParams.get('cat') || ''
    const c = searchParams.get('city') || ''

    setSearch(q)
    setCategory(cat)
    setCity(c)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Debounced search ─────────────────────────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value

    setSearch(val)

    clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      fetchVendors({
        search: val,
        category,
        city,
        sort,
        ...(sort === 'distance' && customerCoords
          ? customerCoords
          : {}),
      })
    }, 350)
  }

  // ── Clear all filters ────────────────────────────────────
  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setCity('')
    setSort('newest')
    setCustomerCoords(null)

    fetchVendors({})
  }

  // ── Near Me / Geolocation ───────────────────────────────
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      // eslint-disable-next-line no-undef
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setLocationLoading(true)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }

        setCustomerCoords(coords)

        fetchVendors({
          search,
          category,
          city,
          sort: 'distance',
          ...coords,
        })

        setLocationLoading(false)
      },
      () => {
        // eslint-disable-next-line no-undef
        toast.error(
          'Could not get your location. Please allow location access.'
        )

        setLocationLoading(false)
      }
    )
  }

  const hasActiveFilters =
    search ||
    category ||
    city ||
    sort !== 'newest'

  return (
    <div className="page-explore">

      {/* ── TOP BAND ── */}
      <div className="ex-top">
        <div className="wrap">

          <div
            className="badge bv"
            style={{ marginBottom: 12 }}
          >
            🔍 Marketplace
          </div>

          <h1>Explore Vendors</h1>

          <p
            style={{
              color: 'var(--ink2)',
              fontSize: 15,
            }}
          >
            Discover trusted local vendors in your neighbourhood
          </p>

          <div className="ex-ctrl">

            {/* Search */}
            <div className="sbox">
              <span>🔍</span>

              <input
                value={search}
                placeholder="Search by name, city, description…"
                onChange={handleSearchChange}
              />

              {search && (
                <button
                  onClick={() => {
                    setSearch('')

                    fetchVendors({
                      search: '',
                      category,
                      city,
                      sort,
                      ...(sort === 'distance' && customerCoords
                        ? customerCoords
                        : {}),
                    })
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0 12px',
                    cursor: 'pointer',
                    color: 'var(--ink3)',
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category */}
            <select
              className="inp"
              style={{ width: 200 }}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">All categories</option>

              {EXPLORE_CATEGORIES.map(c => (
                <option
                  key={c.value}
                  value={c.value}
                >
                  {c.value}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="inp"
              style={{ width: 160 }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="rating">Top rated</option>
              <option value="distance">Near me</option>
            </select>

            {/* Use my location */}
            {sort === 'distance' && (
              <button
                className="btn bg bsm"
                style={{
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                }}
                disabled={locationLoading}
                onClick={handleUseMyLocation}
              >
                {locationLoading
                  ? 'Getting location…'
                  : '📍 Use my location'}
              </button>
            )}

          </div>

          {/* ── QUICK FILTER CHIPS ── */}
          <div className="ex-chips">

            <div
              className={`ex-chip${
                category === '' ? ' active' : ''
              }`}
              onClick={() => setCategory('')}
            >
              All vendors
            </div>

            {EXPLORE_CATEGORIES.map(c => (
              <div
                key={c.value}
                className={`ex-chip${
                  category === c.value ? ' active' : ''
                }`}
                onClick={() => setCategory(c.value)}
              >
                {c.emoji} {c.label}
              </div>
            ))}

          </div>

        </div>
      </div>

      {/* ── BODY: SIDEBAR + GRID ── */}
      <div className="wrap">
        <div className="ex-body">

          {/* ── Sidebar ── */}
          <div className="fp">

            {/* Clear filters button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  width: '100%',
                  marginBottom: 16,
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: 'var(--corall)',
                  color: 'var(--coral)',
                  border: '1.5px solid rgba(242,92,84,.2)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ✕ Clear all filters
              </button>
            )}

            {/* Categories */}
            <div className="fp-sec">

              <div className="fp-title">
                Categories
              </div>

              <div
                className={`fp-item${
                  category === '' ? ' on' : ''
                }`}
                onClick={() => setCategory('')}
              >
                <input
                  type="radio"
                  name="fc"
                  checked={category === ''}
                  readOnly
                />{' '}
                All vendors
              </div>

              {EXPLORE_CATEGORIES.map(c => (
                <div
                  key={c.value}
                  className={`fp-item${
                    category === c.value ? ' on' : ''
                  }`}
                  onClick={() => setCategory(c.value)}
                >
                  <input
                    type="radio"
                    name="fc"
                    checked={category === c.value}
                    readOnly
                  />

                  {c.emoji} {c.label}
                </div>
              ))}

            </div>

            {/* City filter */}
            {allCities.length > 0 && (
              <div className="fp-sec">

                <div className="fp-title">
                  City
                </div>

                <div
                  className={`fp-item${
                    city === '' ? ' on' : ''
                  }`}
                  onClick={() => setCity('')}
                >
                  <input
                    type="radio"
                    name="fci"
                    checked={city === ''}
                    readOnly
                  />{' '}
                  All cities
                </div>

                {allCities.map(c => (
                  <div
                    key={c}
                    className={`fp-item${
                      city === c ? ' on' : ''
                    }`}
                    onClick={() => setCity(c)}
                  >
                    <input
                      type="radio"
                      name="fci"
                      checked={city === c}
                      readOnly
                    />

                    📍 {c}
                  </div>
                ))}

              </div>
            )}

            {/* Sort */}
            <div className="fp-sec">

              <div className="fp-title">
                Sort
              </div>

              <div
                className={`fp-item${
                  sort === 'newest' ? ' on' : ''
                }`}
                onClick={() => setSort('newest')}
              >
                <input
                  type="radio"
                  name="fs"
                  checked={sort === 'newest'}
                  readOnly
                />{' '}
                Newest first
              </div>

              <div
                className={`fp-item${
                  sort === 'rating' ? ' on' : ''
                }`}
                onClick={() => setSort('rating')}
              >
                <input
                  type="radio"
                  name="fs"
                  checked={sort === 'rating'}
                  readOnly
                />{' '}
                Top rated
              </div>

              {/* ✅ ADDED: Near me sidebar option */}
              <div
                className={`fp-item${
                  sort === 'distance' ? ' on' : ''
                }`}
                onClick={() => setSort('distance')}
              >
                <input
                  type="radio"
                  name="fs"
                  checked={sort === 'distance'}
                  readOnly
                />{' '}
                📍 Near me
              </div>

            </div>

          </div>

          {/* ── Results ── */}
          <div>

            {/* Result count + active filter summary */}
            <div
              className="ex-count"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >

              <span>
                {loading
                  ? 'Searching…'
                  : `Showing ${vendors.length} vendor${
                      vendors.length !== 1 ? 's' : ''
                    }${
                      hasActiveFilters
                        ? ' for your filters'
                        : ''
                    }`}
              </span>

              {/* Active filter tags */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                }}
              >

                {category && (
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'var(--vl)',
                      color: 'var(--v)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    {category}

                    <button
                      onClick={() => setCategory('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--v)',
                        fontWeight: 700,
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  </span>
                )}

                {city && (
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'var(--teall)',
                      color: 'var(--teal)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    📍 {city}

                    <button
                      onClick={() => setCity('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--teal)',
                        fontWeight: 700,
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  </span>
                )}

                {sort === 'distance' && (
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'var(--vl)',
                      color: 'var(--v)',
                    }}
                  >
                    📍 Near me
                  </span>
                )}

              </div>

            </div>

            <AnimatePresence mode="wait">

              {loading ? (

                /* Loading */
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      border: '3px solid var(--border)',
                      borderTopColor: 'var(--v)',
                      borderRadius: '50%',
                      animation: 'spin .7s linear infinite',
                      margin: '0 auto 16px',
                    }}
                  />

                  <p
                    style={{
                      color: 'var(--ink3)',
                      fontSize: 14,
                    }}
                  >
                    Finding vendors…
                  </p>
                </motion.div>

              ) : error ? (

                /* Error */
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="empty"
                >
                  <div className="empty-em">
                    ⚠️
                  </div>

                  <h3>Something went wrong</h3>

                  <p>{error}</p>

                  <button
                    className="btn bp bsm"
                    style={{ marginTop: 16 }}
                    onClick={() =>
                      fetchVendors({
                        search,
                        category,
                        city,
                        sort,
                        ...(sort === 'distance' &&
                        customerCoords
                          ? customerCoords
                          : {}),
                      })
                    }
                  >
                    Try again
                  </button>
                </motion.div>

              ) : vendors.length > 0 ? (

                /* Vendors */
                <motion.div
                  key="grid"
                  className="vgrid"
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {vendors.map((v, index) => (
                    <motion.div
                      key={v._id || index}
                      variants={cardVariants}
                    >
                      <VendorCard vendor={v} />

                      {/* Distance badge */}
                      {sort === 'distance' &&
                        v.distanceKm != null && (
                          <div
                            style={{
                              textAlign: 'center',
                              marginTop: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              color: 'var(--v)',
                            }}
                          >
                            📍 {v.distanceKm} km away
                          </div>
                        )}

                      {/* Vendor has no location */}
                      {sort === 'distance' &&
                        v.distanceKm == null && (
                          <div
                            style={{
                              textAlign: 'center',
                              marginTop: 6,
                              fontSize: 11,
                              color: 'var(--ink4)',
                            }}
                          >
                            Location not set
                          </div>
                        )}

                    </motion.div>
                  ))}
                </motion.div>

              ) : (

                /* Empty */
                <motion.div
                  key="empty"
                  className="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="empty-em">
                    🔍
                  </div>

                  <h3>No vendors found</h3>

                  <p>
                    {hasActiveFilters
                      ? 'Try adjusting your search or filters'
                      : 'No vendors have registered yet'}
                  </p>

                  {hasActiveFilters && (
                    <button
                      className="btn bg bsm"
                      style={{ marginTop: 16 }}
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  )}

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        </div>
      </div>
    </div>
  )
}