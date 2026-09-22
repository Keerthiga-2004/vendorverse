// src/utils/vendorData.js
//
// This file contains only legitimate UI constants:
// - EXPLORE_CATEGORIES: used by Explore.jsx sidebar and chip filters
// - CATEGORY_BG: colour map used by VendorCard and VendorDetail for cover gradients
//
// ✅ All mock vendor arrays (VENDORS v1–v9), fake products (PRODUCTS),
//    and fake reviews (REVIEWS) have been removed.
//    All pages now fetch real data from the MongoDB API.

// ─── EXPLORE CATEGORIES ───────────────────────────────────
// Used by Explore.jsx for sidebar filter and chip row.
// These are category names that match the `category` field on vendor documents.
export const EXPLORE_CATEGORIES = [
  { value: 'Food & Beverages',   label: 'Food',        emoji: '🍱' },
  { value: 'Grocery',            label: 'Grocery',     emoji: '🛒' },
  { value: 'Tailoring',          label: 'Tailoring',   emoji: '✂️' },
  { value: 'Beauty & Wellness',  label: 'Beauty',      emoji: '💇' },
  { value: 'Electronics Repair', label: 'Electronics', emoji: '🔌' },
  { value: 'Home Repair',        label: 'Home Repair', emoji: '🔨' },
  { value: 'Electrician',        label: 'Electrician', emoji: '⚡' },
  { value: 'Bakery',             label: 'Bakery',      emoji: '🥐' },
  { value: 'Local Services',     label: 'Local',       emoji: '🏪' },
]

// ─── CATEGORY BACKGROUND GRADIENTS ────────────────────────
// Used by VendorCard and VendorDetail for the cover area colour.
// Maps the vendor's `category` field to a soft gradient.
export const CATEGORY_BG = {
  'Food & Beverages':   'linear-gradient(135deg,#FFF4EE,#FFF0F0)',
  'Grocery':            'linear-gradient(135deg,#F0FDF9,#E6FAF8)',
  'Tailoring':          'linear-gradient(135deg,#F5F0FF,#EDE9FE)',
  'Beauty & Wellness':  'linear-gradient(135deg,#FFF0F6,#F5F3FF)',
  'Electronics Repair': 'linear-gradient(135deg,#FFF8E1,#FFF3E0)',
  'Home Repair':        'linear-gradient(135deg,#FFF3E0,#FFF0F0)',
  'Electrician':        'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
  'Bakery':             'linear-gradient(135deg,#E6FAF8,#ECFDF5)',
  'Local Services':     'linear-gradient(135deg,#EFF6FF,#F5F0FF)',
}