// src/components/sections/FeaturedVendors.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import VendorCard from "../components/ui/Vendorcard.jsx";
import './FeaturedVendors.css'

/* same mock data as approved HTML */
const VENDORS = [
  { _id:'v1', shopName:"Ravi's Kitchen",      category:'Food & Beverages',  emoji:'🍱', cardClass:'vf',  city:'Coimbatore', openingHours:'7AM–10PM', rating:4.9, reviewCount:142, isVerified:true,  isOpen:true  },
  { _id:'v2', shopName:'Stitch Perfect',       category:'Tailoring',         emoji:'✂️', cardClass:'vt',  city:'Coimbatore', openingHours:'9AM–7PM',  rating:4.7, reviewCount:89,  isVerified:true,  isOpen:true  },
  { _id:'v3', shopName:'GlowUp Studio',        category:'Beauty & Wellness', emoji:'💇', cardClass:'vb',  city:'Erode',       openingHours:'10AM–8PM', rating:4.8, reviewCount:201, isVerified:true,  isOpen:false },
  { _id:'v4', shopName:'FixIt Electronics',    category:'Electronics Repair',emoji:'🔌', cardClass:'ve',  city:'Chennai',     openingHours:'9AM–8PM',  rating:4.6, reviewCount:67,  isVerified:false, isOpen:true  },
  { _id:'v5', shopName:"Ammi's Bakery",        category:'Bakery',            emoji:'🥐', cardClass:'vk',  city:'Coimbatore', openingHours:'6AM–9PM',  rating:4.9, reviewCount:312, isVerified:true,  isOpen:true  },
  { _id:'v6', shopName:'PowerLine Electricals',category:'Electrician',       emoji:'⚡', cardClass:'vel', city:'Erode',       openingHours:'8AM–6PM',  rating:4.5, reviewCount:45,  isVerified:true,  isOpen:true  },
]

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}
const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

export default function FeaturedVendors() {
  const navigate = useNavigate()

  return (
    <section className="featured-sec">
      <div className="wrap">
        {/* header row */}
        <div className="sec-row">
          <div>
            <div className="sec-ey">Featured vendors</div>
            <div className="sec-h">Trusted by thousands in your city</div>
          </div>
          <button className="btn bg" onClick={() => navigate('/explore')}>
            View all →
          </button>
        </div>

        {/* vendor grid */}
        <motion.div
          className="vgrid"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {VENDORS.map((v) => (
            <motion.div key={v._id} variants={cardVariants}>
              <VendorCard vendor={v} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}