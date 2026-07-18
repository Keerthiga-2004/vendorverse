// src/pages/Explore/Explore.jsx
import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import VendorCard from '../../components/ui/VendorCard'
import { VENDORS, EXPLORE_CATEGORIES } from '../../utils/vendorData'
import './Explore.css'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}
const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('cat') || '')
  const [sort, setSort] = useState('newest')
  const debounceRef = useRef(null)

  // keep URL in sync (so links from Hero/Categories pages work)
  useEffect(() => {
    const params = {}
    if (search) params.q = search
    if (category) params.cat = category
    setSearchParams(params, { replace: true })
  }, [search, category]) // eslint-disable-line react-hooks/exhaustive-deps

  // re-sync local state if user navigates here again with new query params
  useEffect(() => {
    setSearch(searchParams.get('q') || '')
    setCategory(searchParams.get('cat') || '')
  }, [searchParams])

  const handleSearchInput = (e) => {
    const val = e.target.value
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(val), 250)
  }

  const filtered = useMemo(() => {
    let list = [...VENDORS]

    if (category) {
      list = list.filter(v => v.category === category)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(v =>
        v.shopName.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q)
      )
    }
    if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }
    return list
  }, [search, category, sort])

  return (
    <div className="page-explore">

      {/* ── TOP BAND ── */}
      <div className="ex-top">
        <div className="wrap">
          <div className="badge bv" style={{ marginBottom: 12 }}>🔍 Marketplace</div>
          <h1>Explore Vendors</h1>
          <p style={{ color: 'var(--ink2)', fontSize: 15 }}>
            Discover trusted local vendors in your neighbourhood
          </p>

          <div className="ex-ctrl">
            <div className="sbox">
              <span>🔍</span>
              <input
                defaultValue={search}
                placeholder="Search by name, category, service…"
                onChange={handleSearchInput}
              />
            </div>
            <select
              className="inp"
              style={{ width: 200 }}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {EXPLORE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.value}</option>
              ))}
            </select>
            <select
              className="inp"
              style={{ width: 160 }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {/* ── QUICK FILTER CHIPS ── */}
          <div className="ex-chips">
            <div
              className={`ex-chip${category === '' ? ' active' : ''}`}
              onClick={() => setCategory('')}
            >
              All vendors
            </div>
            {EXPLORE_CATEGORIES.map(c => (
              <div
                key={c.value}
                className={`ex-chip${category === c.value ? ' active' : ''}`}
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

          {/* sidebar */}
          <div className="fp">
            <div className="fp-sec">
              <div className="fp-title">Categories</div>
              <div
                className={`fp-item${category === '' ? ' on' : ''}`}
                onClick={() => setCategory('')}
              >
                <input type="radio" name="fc" checked={category === ''} readOnly /> All vendors
              </div>
              {EXPLORE_CATEGORIES.map(c => (
                <div
                  key={c.value}
                  className={`fp-item${category === c.value ? ' on' : ''}`}
                  onClick={() => setCategory(c.value)}
                >
                  <input type="radio" name="fc" checked={category === c.value} readOnly /> {c.emoji} {c.label}
                </div>
              ))}
            </div>
            <div className="fp-sec">
              <div className="fp-title">Sort</div>
              <div
                className={`fp-item${sort === 'newest' ? ' on' : ''}`}
                onClick={() => setSort('newest')}
              >
                <input type="radio" name="fs" checked={sort === 'newest'} readOnly /> Newest first
              </div>
              <div
                className={`fp-item${sort === 'rating' ? ' on' : ''}`}
                onClick={() => setSort('rating')}
              >
                <input type="radio" name="fs" checked={sort === 'rating'} readOnly /> Top rated
              </div>
            </div>
          </div>

          {/* results */}
          <div>
            <div className="ex-count">
              {filtered.length
                ? `Showing ${filtered.length} vendor${filtered.length !== 1 ? 's' : ''}`
                : ''}
            </div>

            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key="grid"
                  className="vgrid"
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filtered.map(v => (
                    <motion.div key={v._id} variants={cardVariants}>
                      <VendorCard vendor={v} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="empty-em">🔍</div>
                  <h3>No vendors found</h3>
                  <p>Try adjusting your search or filters</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}