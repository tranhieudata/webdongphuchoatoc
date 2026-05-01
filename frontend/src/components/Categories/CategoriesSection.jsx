import Link from 'next/link';
import './CategoriesSection.css';

const categories = [
  { name: 'Đồng Phục Công Ty', slug: 'dong-phuc-cong-ty', icon: '🏢', count: 120, color: '#009944' },
  { name: 'Áo Phông', slug: 'dong-phuc-ao-phong', icon: '👕', count: 85, color: '#3b82f6' },
  { name: 'Áo Sơ Mi', slug: 'dong-phuc-ao-so-mi', icon: '👔', count: 70, color: '#8b5cf6' },
  { name: 'Áo Gió', slug: 'dong-phuc-ao-gio', icon: '🧥', count: 55, color: '#f97316' },
  { name: 'Áo Polo', slug: 'dong-phuc-ao-polo', icon: '🎽', count: 90, color: '#ec4899' },
  { name: 'Đồng Phục Học Sinh', slug: 'dong-phuc-hoc-sinh', icon: '🎒', count: 65, color: '#14b8a6' },
];

export default function CategoriesSection() {
  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2>Danh Mục Sản Phẩm</h2>
          <p>Khám phá đa dạng các dòng đồng phục chất lượng cao</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/mau-ao/${cat.slug}`} className="cat-card">
              <div className="cat-icon" style={{ background: cat.color + '18', color: cat.color }}>
                <span>{cat.icon}</span>
              </div>
              <div className="cat-info">
                <h3>{cat.name}</h3>
                <span>{cat.count} mẫu</span>
              </div>
              <div className="cat-arrow" style={{ color: cat.color }}>›</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
