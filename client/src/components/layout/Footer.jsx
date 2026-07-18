// src/components/layout/Footer.jsx
import { useNavigate } from 'react-router-dom'
import {
  FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope
} from 'react-icons/fa'
import './Footer.css'

const SOCIAL_LINKS = [
  { icon: <FaInstagram />, label: 'Instagram', href: '#' },
  { icon: <FaFacebookF />, label: 'Facebook',  href: '#' },
  { icon: <FaTwitter />,   label: 'Twitter',   href: '#' },
  { icon: <FaLinkedinIn />,label: 'LinkedIn',  href: '#' },
]

export default function Footer() {
  const navigate = useNavigate()

  const catFilter = (cat) => navigate(`/explore?cat=${encodeURIComponent(cat)}`)

  return (
    <footer>
      <div className="wrap">
        <div className="foot-g">

          {/* ── BRAND ── */}
          <div className="foot-brand">
            <a className="logo" onClick={() => navigate('/')}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <defs>
                  <linearGradient id="flg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#F72585" />
                  </linearGradient>
                  <linearGradient id="flg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFAB00" />
                    <stop offset="50%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#00C9B1" />
                  </linearGradient>
                </defs>
                <path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="rgba(167,139,250,.15)" stroke="url(#flg1)" strokeWidth="1.8" />
                <path d="M13 13 L19.5 26 L20 24.5 L20.5 26 L27 13" stroke="url(#flg2)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="3" fill="url(#flg1)" />
              </svg>
              <span className="logo-txt" style={{ color: '#fff' }}>
                Vendor<b style={{ color: '#A78BFA' }}>Verse</b>
              </span>
            </a>
            <p>Digitally empowering local vendors. Connecting neighbourhoods, one discovery at a time.</p>

            {/* social icons */}
            <div className="foot-social">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} className="foot-social-link" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── MARKETPLACE ── */}
          <div className="foot-col">
            <h4>Marketplace</h4>
            <a onClick={() => navigate('/explore')}>Explore vendors</a>
            <a onClick={() => navigate('/categories')}>Categories</a>
            <a onClick={() => catFilter('Food & Beverages')}>Food & Beverages</a>
            <a onClick={() => catFilter('Beauty & Wellness')}>Beauty</a>
          </div>

          {/* ── FOR VENDORS ── */}
          <div className="foot-col">
            <h4>For vendors</h4>
            <a onClick={() => navigate('/signup')}>Register your shop</a>
            <a onClick={() => navigate('/dashboard')}>Dashboard</a>
            <a>Vendor guide</a>
            <a>Pricing</a>
          </div>

          {/* ── COMPANY ── */}
          <div className="foot-col">
            <h4>Company</h4>
            <a>About us</a>
            <a>Blog</a>
            <a>Careers</a>
            <a>Privacy</a>
          </div>

          {/* ── CONTACT ── */}
          <div className="foot-col">
            <h4>Contact</h4>
            <div className="foot-contact-item">
              <span className="foot-contact-ic"><FaMapMarkerAlt /></span>
              <span>Coimbatore, Tamil Nadu, India</span>
            </div>
            <div className="foot-contact-item">
              <span className="foot-contact-ic"><FaPhoneAlt /></span>
              <span>+91 98765 43210</span>
            </div>
            <div className="foot-contact-item">
              <span className="foot-contact-ic"><FaEnvelope /></span>
              <span>hello@vendorverse.in</span>
            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="foot-bot">
          <p>© 2025 VendorVerse. Built with ❤️ for local India.</p>
          <p>MERN Stack · MongoDB · Express · React · Node</p>
        </div>
      </div>
    </footer>
  )
}