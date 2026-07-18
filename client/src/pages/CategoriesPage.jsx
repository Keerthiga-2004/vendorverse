import { useNavigate } from 'react-router-dom';
import './CategoriesPage.css';

const CATS = [
  {
    emoji: '🍱',
    name: 'Food & Beverages',
    desc: 'Street food, restaurants, home chefs'
  },
  {
    emoji: '🛒',
    name: 'Grocery',
    desc: 'Local stores, fresh produce'
  },
  {
    emoji: '✂️',
    name: 'Tailoring',
    desc: 'Custom stitching, alterations'
  },
  {
    emoji: '💇',
    name: 'Beauty & Wellness',
    desc: 'Salons, spas, parlours'
  },
  {
    emoji: '🔌',
    name: 'Electronics Repair',
    desc: 'Phones, laptops, appliances'
  },
  {
    emoji: '🔨',
    name: 'Home Repair',
    desc: 'Plumbing, carpentry, painting'
  },
  {
    emoji: '⚡',
    name: 'Electrician',
    desc: 'Wiring, fitting, repairs'
  },
  {
    emoji: '🥐',
    name: 'Bakery',
    desc: 'Fresh bakes, cakes, pastries'
  },
  {
    emoji: '🏪',
    name: 'Local Services',
    desc: 'Printing, laundry, courier'
  }
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <section className="categories-page">
      <div className="wrap">

        <div className="cp-head">
          <div className="cp-ey">ALL CATEGORIES</div>
          <h1>Browse everything local</h1>
          <p>
            Find any service or product from our wide range of local vendors
          </p>
        </div>

        <div className="cp-grid">
          {CATS.map((c) => (
            <div
              key={c.name}
              className="cp-card"
              onClick={() =>
                navigate(`/explore?cat=${encodeURIComponent(c.name)}`)
              }
            >
              <div className="cp-em">{c.emoji}</div>
              <h3>{c.name}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}