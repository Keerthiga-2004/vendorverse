// ─── MOCK DATA (used as fallback when API is offline) ─────
export const MOCK_VENDORS = [
  { _id:'v1', shopName:"Ravi's Kitchen", category:'Food & Beverages', description:'Authentic South Indian food made with love. Fresh ingredients every day.', phone:'9876543210', address:'12 Gandhi Nagar', city:'Coimbatore', rating:4.9, reviewCount:142, isVerified:true, isOpen:true, openingHours:'7AM–10PM', emoji:'🍱', cardClass:'vf' },
  { _id:'v2', shopName:'Stitch Perfect', category:'Tailoring', description:'Custom stitching and alterations for all occasions. 20 years of experience.', phone:'9876543211', address:'5 Market Street', city:'Coimbatore', rating:4.7, reviewCount:89, isVerified:true, isOpen:true, openingHours:'9AM–7PM', emoji:'✂️', cardClass:'vt' },
  { _id:'v3', shopName:'GlowUp Studio', category:'Beauty & Wellness', description:'Premium beauty treatments. Facials, hair care and wellness services.', phone:'9876543212', address:'8 Rose Garden', city:'Erode', rating:4.8, reviewCount:201, isVerified:true, isOpen:false, openingHours:'10AM–8PM', emoji:'💇', cardClass:'vb' },
  { _id:'v4', shopName:'FixIt Electronics', category:'Electronics Repair', description:'Fast, reliable phone and laptop repairs with warranty on all jobs.', phone:'9876543213', address:'22 Tech Hub Lane', city:'Chennai', rating:4.6, reviewCount:67, isVerified:false, isOpen:true, openingHours:'9AM–8PM', emoji:'🔌', cardClass:'ve' },
  { _id:'v5', shopName:"Ammi's Bakery", category:'Bakery', description:'Freshly baked bread, cakes and pastries every morning without fail.', phone:'9876543214', address:'3 Flour Mill Road', city:'Coimbatore', rating:4.9, reviewCount:312, isVerified:true, isOpen:true, openingHours:'6AM–9PM', emoji:'🥐', cardClass:'vk' },
  { _id:'v6', shopName:'PowerLine Electricals', category:'Electrician', description:'Certified electricians for all wiring, fitting and repair needs.', phone:'9876543215', address:'17 Industrial Area', city:'Erode', rating:4.5, reviewCount:45, isVerified:true, isOpen:true, openingHours:'8AM–6PM', emoji:'⚡', cardClass:'vel' },
  { _id:'v7', shopName:'Fresh Basket', category:'Grocery', description:'Farm-fresh vegetables and groceries delivered daily.', phone:'9876543216', address:'44 Market Road', city:'Chennai', rating:4.4, reviewCount:98, isVerified:false, isOpen:true, openingHours:'7AM–9PM', emoji:'🛒', cardClass:'vg' },
  { _id:'v8', shopName:'QuickFix Plumbing', category:'Home Repair', description:'24/7 plumbing and home repair services. No job too small.', phone:'9876543217', address:'9 Service Lane', city:'Coimbatore', rating:4.3, reviewCount:33, isVerified:false, isOpen:false, openingHours:'8AM–8PM', emoji:'🔨', cardClass:'vh' },
  { _id:'v9', shopName:'Print Express', category:'Local Services', description:'Printing, scanning, binding and stationery. All local needs.', phone:'9876543218', address:'1 College Road', city:'Erode', rating:4.7, reviewCount:56, isVerified:true, isOpen:true, openingHours:'9AM–7PM', emoji:'🖨️', cardClass:'vl2' },
];

export const MOCK_PRODUCTS = {
  v1: [
    { _id:'p1', name:'Masala Dosa', price:60, category:'Food', description:'Crispy golden dosa with spiced potato filling.', emoji:'🥞', isAvailable:true, unit:'per item' },
    { _id:'p2', name:'Filter Coffee', price:25, category:'Food', description:'Authentic South Indian filter coffee.', emoji:'☕', isAvailable:true, unit:'per cup' },
    { _id:'p3', name:'Thali Meals', price:120, category:'Food', description:'Full South Indian thali with rice and sambar.', emoji:'🍱', isAvailable:true, unit:'per plate' },
  ],
  v2: [
    { _id:'p4', name:'Salwar Stitching', price:450, category:'Clothing', description:'Custom salwar kameez in 3 days.', emoji:'👗', isAvailable:true, unit:'per piece' },
    { _id:'p5', name:'Alteration', price:150, category:'Clothing', description:'Hem, waist, length adjustment.', emoji:'👖', isAvailable:true, unit:'per piece' },
  ],
  v3: [
    { _id:'p6', name:'Full Facial', price:800, category:'Beauty', description:'Deep cleansing facial.', emoji:'✨', isAvailable:true, unit:'per session' },
    { _id:'p7', name:'Hair Spa', price:600, category:'Beauty', description:'Nourishing hair spa treatment.', emoji:'💆', isAvailable:true, unit:'per session' },
  ],
  v5: [
    { _id:'p8', name:'Bread Loaf', price:45, category:'Bakery', description:'Freshly baked white bread.', emoji:'🍞', isAvailable:true, unit:'per loaf' },
    { _id:'p9', name:'Birthday Cake', price:650, category:'Bakery', description:'Custom cakes. Order 1 day ahead.', emoji:'🎂', isAvailable:true, unit:'per kg' },
    { _id:'p10', name:'Croissant', price:35, category:'Bakery', description:'Buttery flaky croissants.', emoji:'🥐', isAvailable:true, unit:'per piece' },
  ],
};

export const MOCK_REVIEWS = {
  v1: [
    { _id:'r1', userId:{ name:'Priya S' }, rating:5, comment:'Best dosa in town! Fresh every time.', createdAt:'2024-12-01', color:'#F72585' },
    { _id:'r2', userId:{ name:'Arun M' }, rating:5, comment:'Filter coffee is absolutely divine.', createdAt:'2024-11-28', color:'#7C3AED' },
  ],
  v5: [
    { _id:'r3', userId:{ name:'Rekha' }, rating:5, comment:"Best cakes ever! Birthday was a huge hit.", createdAt:'2024-12-03', color:'#10B981' },
  ],
};

export const CATEGORIES = [
  { id:'food',     label:'Food & Beverages', emoji:'🍱', count:'48', cls:'cf', catValue:'Food & Beverages' },
  { id:'grocery',  label:'Grocery',          emoji:'🛒', count:'35', cls:'cg', catValue:'Grocery' },
  { id:'tailor',   label:'Tailoring',        emoji:'✂️', count:'22', cls:'ct2', catValue:'Tailoring' },
  { id:'beauty',   label:'Beauty',           emoji:'💇', count:'31', cls:'cb', catValue:'Beauty & Wellness' },
  { id:'elec',     label:'Electronics',      emoji:'🔌', count:'18', cls:'ce', catValue:'Electronics Repair' },
  { id:'home',     label:'Home Repair',      emoji:'🔨', count:'27', cls:'ch', catValue:'Home Repair' },
  { id:'electric', label:'Electrician',      emoji:'⚡', count:'15', cls:'cel', catValue:'Electrician' },
  { id:'bakery',   label:'Bakery',           emoji:'🥐', count:'20', cls:'ck', catValue:'Bakery' },
  { id:'local',    label:'Local',            emoji:'🏪', count:'42', cls:'cl', catValue:'Local Services' },
];

export const CATEGORY_BG = {
  'Food & Beverages':  'linear-gradient(135deg,#FFF4EE,#FFF0F0)',
  'Grocery':           'linear-gradient(135deg,#F0FDF9,#E6FAF8)',
  'Tailoring':         'linear-gradient(135deg,#F5F0FF,#EDE9FE)',
  'Beauty & Wellness': 'linear-gradient(135deg,#FFF0F6,#F5F3FF)',
  'Electronics Repair':'linear-gradient(135deg,#FFF8E1,#FFF3E0)',
  'Home Repair':       'linear-gradient(135deg,#FFF3E0,#FFF0F0)',
  'Electrician':       'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
  'Bakery':            'linear-gradient(135deg,#E6FAF8,#ECFDF5)',
  'Local Services':    'linear-gradient(135deg,#EFF6FF,#F5F0FF)',
};