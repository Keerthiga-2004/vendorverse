// src/utils/vendorData.js
// Single source of truth for mock vendor data (matches approved HTML exactly)

export const VENDORS = [
  { _id:'v1', shopName:"Ravi's Kitchen",       category:'Food & Beverages',   emoji:'🍱',  cardClass:'vf',  city:'Coimbatore', openingHours:'7AM–10PM', rating:4.9, reviewCount:142, isVerified:true,  isOpen:true,  description:'Authentic South Indian food made with love. Fresh ingredients every day.',          phone:'9876543210', address:'12 Gandhi Nagar'   },
  { _id:'v2', shopName:'Stitch Perfect',        category:'Tailoring',          emoji:'✂️', cardClass:'vt',  city:'Coimbatore', openingHours:'9AM–7PM',  rating:4.7, reviewCount:89,  isVerified:true,  isOpen:true,  description:'Custom stitching and alterations for all occasions. 20 years of experience.',         phone:'9876543211', address:'5 Market Street'    },
  { _id:'v3', shopName:'GlowUp Studio',         category:'Beauty & Wellness',  emoji:'💇', cardClass:'vb',  city:'Erode',       openingHours:'10AM–8PM', rating:4.8, reviewCount:201, isVerified:true,  isOpen:false, description:'Premium beauty treatments. Facials, hair care and wellness services.',                phone:'9876543212', address:'8 Rose Garden'      },
  { _id:'v4', shopName:'FixIt Electronics',     category:'Electronics Repair', emoji:'🔌',  cardClass:'ve',  city:'Chennai',     openingHours:'9AM–8PM',  rating:4.6, reviewCount:67,  isVerified:false, isOpen:true,  description:'Fast, reliable phone and laptop repairs with warranty on all jobs.',                   phone:'9876543213', address:'22 Tech Hub Lane'   },
  { _id:'v5', shopName:"Ammi's Bakery",         category:'Bakery',             emoji:'🥐',  cardClass:'vk',  city:'Coimbatore', openingHours:'6AM–9PM',  rating:4.9, reviewCount:312, isVerified:true,  isOpen:true,  description:'Freshly baked bread, cakes and pastries every morning without fail.',                  phone:'9876543214', address:'3 Flour Mill Road'  },
  { _id:'v6', shopName:'PowerLine Electricals', category:'Electrician',        emoji:'⚡',  cardClass:'vel', city:'Erode',       openingHours:'8AM–6PM',  rating:4.5, reviewCount:45,  isVerified:true,  isOpen:true,  description:'Certified electricians for all wiring, fitting and repair needs.',                     phone:'9876543215', address:'17 Industrial Area' },
  { _id:'v7', shopName:'Fresh Basket',          category:'Grocery',            emoji:'🛒',  cardClass:'vg',  city:'Chennai',     openingHours:'7AM–9PM',  rating:4.4, reviewCount:98,  isVerified:false, isOpen:true,  description:'Farm-fresh vegetables and groceries delivered daily.',                                 phone:'9876543216', address:'44 Market Road'     },
  { _id:'v8', shopName:'QuickFix Plumbing',     category:'Home Repair',        emoji:'🔨',  cardClass:'vh',  city:'Coimbatore', openingHours:'8AM–8PM',  rating:4.3, reviewCount:33,  isVerified:false, isOpen:false, description:'24/7 plumbing and home repair services. No job too small.',                            phone:'9876543217', address:'9 Service Lane'     },
  { _id:'v9', shopName:'Print Express',         category:'Local Services',     emoji:'🖨️', cardClass:'vl2', city:'Erode',       openingHours:'9AM–7PM',  rating:4.7, reviewCount:56,  isVerified:true,  isOpen:true,  description:'Printing, scanning, binding and stationery. All local needs.',                         phone:'9876543218', address:'1 College Road'     },
]

// Category → cover background gradient (exact ccMap from approved HTML)
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

// Mock products per vendor (exact PRODS from approved HTML, extended to cover every vendor)
export const PRODUCTS = {
  v1: [
    { _id:'p1', name:'Masala Dosa',  price:60,  unit:'per item',  emoji:'🥞', description:'Crispy golden dosa with spiced potato filling.', available:true },
    { _id:'p2', name:'Filter Coffee',price:25,  unit:'per cup',   emoji:'☕', description:'Authentic South Indian filter coffee.',           available:true },
    { _id:'p3', name:'Thali Meals',  price:120, unit:'per plate', emoji:'🍱', description:'Full South Indian thali with rice and sambar.',   available:true },
  ],
  v2: [
    { _id:'p4', name:'Salwar Stitching', price:450, unit:'per piece', emoji:'👗', description:'Custom salwar kameez in 3 days.', available:true },
    { _id:'p5', name:'Alteration',       price:150, unit:'per piece', emoji:'👖', description:'Hem, waist, length adjustment.',   available:true },
  ],
  v3: [
    { _id:'p6', name:'Full Facial', price:800, unit:'per session', emoji:'✨', description:'Deep cleansing facial.',           available:true },
    { _id:'p7', name:'Hair Spa',    price:600, unit:'per session', emoji:'💆', description:'Nourishing hair spa treatment.',   available:true },
  ],
  v4: [
    { _id:'p11', name:'Phone Screen Repair', price:899, unit:'per repair', emoji:'📱', description:'Cracked screen replacement with 90-day warranty.', available:true  },
    { _id:'p12', name:'Laptop Servicing',    price:599, unit:'per service',emoji:'💻', description:'Full diagnostic, cleaning and software tune-up.',  available:true  },
    { _id:'p13', name:'Battery Replacement', price:1299,unit:'per repair', emoji:'🔋', description:'Genuine battery replacement for phones and laptops.', available:false },
  ],
  v5: [
    { _id:'p8',  name:'Bread Loaf',    price:45,  unit:'per loaf', emoji:'🍞', description:'Freshly baked white bread.',          available:true },
    { _id:'p9',  name:'Birthday Cake', price:650, unit:'per kg',   emoji:'🎂', description:'Custom cakes. Order 1 day ahead.',     available:true },
    { _id:'p10', name:'Croissant',     price:35,  unit:'per piece',emoji:'🥐', description:'Buttery flaky croissants.',            available:true },
  ],
  v6: [
    { _id:'p14', name:'House Wiring',        price:2500, unit:'per visit',  emoji:'🔌', description:'Complete home wiring inspection and fitting.', available:true },
    { _id:'p15', name:'Fan & Light Fitting', price:299,  unit:'per item',   emoji:'💡', description:'Ceiling fan and light fixture installation.',  available:true },
    { _id:'p16', name:'Emergency Repair',    price:499,  unit:'per visit',  emoji:'⚡', description:'Same-day urgent electrical fault fixing.',     available:true },
  ],
  v7: [
    { _id:'p17', name:'Vegetable Basket', price:299, unit:'per basket', emoji:'🥦', description:'Mixed seasonal vegetables, farm fresh.',      available:true },
    { _id:'p18', name:'Fruit Box',        price:399, unit:'per box',    emoji:'🍎', description:'Assorted seasonal fruits, hand-picked daily.', available:true },
    { _id:'p19', name:'Daily Essentials',  price:549, unit:'per pack',  emoji:'🛒', description:'Rice, dal, oil and household staples bundle.', available:true },
  ],
  v8: [
    { _id:'p20', name:'Tap Repair',       price:199, unit:'per visit', emoji:'🚰', description:'Leaky tap and faucet fixing.',          available:true  },
    { _id:'p21', name:'Pipe Installation',price:899, unit:'per job',   emoji:'🔧', description:'New pipeline fitting for kitchen/bath.', available:false },
  ],
  v9: [
    { _id:'p22', name:'Document Printing', price:2,   unit:'per page',  emoji:'🖨️', description:'B&W and colour printing, A4 and A3.',   available:true },
    { _id:'p23', name:'Spiral Binding',    price:40,   unit:'per book',  emoji:'📔', description:'Spiral and comb binding for reports.',   available:true },
    { _id:'p24', name:'Photocopy Service', price:1,    unit:'per page',  emoji:'📄', description:'Fast photocopying, bulk discounts available.', available:true },
  ],
}

// Mock reviews per vendor (exact REVS from approved HTML, extended to cover every vendor)
export const REVIEWS = {
  v1: [
    { _id:'r1', name:'Priya S', rating:5, comment:'Best dosa in town! Fresh every time.', date:'2024-12-01', color:'#F72585' },
    { _id:'r2', name:'Arun M',  rating:5, comment:'Filter coffee is absolutely divine.',  date:'2024-11-28', color:'#7C3AED' },
  ],
  v2: [
    { _id:'r4', name:'Kavitha R', rating:5, comment:'Perfect fit every single time. Highly recommend!', date:'2024-12-05', color:'#10B981' },
    { _id:'r5', name:'Suresh M',  rating:4, comment:'Good quality stitching, slightly slower than promised.', date:'2024-11-30', color:'#F59E0B' },
  ],
  v3: [
    { _id:'r6', name:'Anitha K', rating:5, comment:'My skin has never felt better. Amazing facials!', date:'2024-12-02', color:'#EC4899' },
  ],
  v4: [
    { _id:'r7', name:'Vignesh T', rating:4, comment:'Fixed my screen quickly, fair pricing.', date:'2024-11-25', color:'#3B82F6' },
  ],
  v5: [
    { _id:'r3', name:'Rekha', rating:5, comment:"Best cakes ever! Birthday was a huge hit.", date:'2024-12-03', color:'#10B981' },
  ],
  v6: [
    { _id:'r8', name:'Murugan S', rating:5, comment:'Came same day for an emergency, very professional.', date:'2024-12-04', color:'#FFAB00' },
  ],
  v7: [
    { _id:'r9', name:'Lakshmi P', rating:4, comment:'Vegetables are always fresh, delivery is quick.', date:'2024-11-29', color:'#10B981' },
  ],
  v8: [
    { _id:'r10', name:'Dinesh K', rating:4, comment:'Fixed the leak fast, reasonable price.', date:'2024-11-27', color:'#00C9B1' },
  ],
  v9: [
    { _id:'r11', name:'Meena V', rating:5, comment:'Great quality prints and super fast service.', date:'2024-12-06', color:'#7C3AED' },
  ],
}

// Categories used across Explore page chips + sidebar (exact from approved HTML)
export const EXPLORE_CATEGORIES = [
  { value: 'Food & Beverages',   emoji: '🍱', label: 'Food'        },
  { value: 'Grocery',            emoji: '🛒', label: 'Grocery'     },
  { value: 'Tailoring',          emoji: '✂️', label: 'Tailoring'   },
  { value: 'Beauty & Wellness',  emoji: '💇', label: 'Beauty'      },
  { value: 'Electronics Repair', emoji: '🔌', label: 'Electronics' },
  { value: 'Home Repair',        emoji: '🔨', label: 'Home Repair' },
  { value: 'Electrician',        emoji: '⚡', label: 'Electrician' },
  { value: 'Bakery',             emoji: '🥐', label: 'Bakery'      },
  { value: 'Local Services',     emoji: '🏪', label: 'Local'       },
]