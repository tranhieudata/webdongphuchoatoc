import HeroBanner from '@/components/Hero/HeroBanner';
import CategoriesSection from '@/components/Categories/CategoriesSection';
import ProductGrid from '@/components/Products/ProductGrid';
import './home.css';

const API = process.env.NEXT_PUBLIC_API_URL 

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API}/api/product/allproduct?page=1&limit=8`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products || []).map((p) => ({
      ...p,
      id: p._id,
      slug: p.slug || p._id,
      image: p.images?.[0] ? `${API}/${p.images[0].replace(/\\/g, '/')}` : null,
    }));
  } catch {
    return [];
  }
}

const clients = [
  { name: 'VTV', logo: '📺' },
  { name: 'Toyota', logo: '🚗' },
  { name: 'FPT', logo: '💻' },
  { name: 'Vingroup', logo: '🏢' },
  { name: 'Viettel', logo: '📱' },
  { name: 'Grab', logo: '🛵' },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      <HeroBanner />

      
      <section className="collections-bar">
        <div className="container collections-bar-inner">
          <a href="/mau-ao/bst-pique-cafe" className="coll-item">
            <span className="coll-icon">☕</span>
            <span>BST Pique Cafe</span>
          </a>
          <a href="/mau-ao/dong-phuc-ao-gio" className="coll-item">
            <span className="coll-icon">🧥</span>
            <span>Áo Gió Nano Protect</span>
          </a>
          <a href="/mau-ao/dong-phuc-ao-so-mi" className="coll-item">
            <span className="coll-icon">👔</span>
            <span>Sơ Mi Essential</span>
          </a>
          <a href="/mau-ao/dong-phuc-hoc-sinh" className="coll-item">
            <span className="coll-icon">🎒</span>
            <span>Đồng Phục Học Sinh</span>
          </a>
          <a href="/mau-ao/dong-phuc-ao-polo" className="coll-item">
            <span className="coll-icon">🎽</span>
            <span>Áo Polo Minimal</span>
          </a>
        </div>
      </section>

      <CategoriesSection />

      <ProductGrid
        title="Bộ Sưu Tập Mới Nhất"
        products={featuredProducts}
        viewAllHref="/san-pham"
        cols={4}
      />

      {/* About / Factory Section */}
      <section className="about-section">
        <div className="container about-inner">
          <div className="about-video">
            <div className="video-placeholder">
              <div className="play-btn">▶</div>
              <p>Xưởng Đồng Phục Hỏa Tốc 1000m²</p>
            </div>
          </div>
          <div className="about-text">
            <span className="about-tag">Tại Sao Chọn Chúng Tôi</span>
            <h2>Hệ Thống Sản Xuất Hiện Đại, Chuyên Nghiệp</h2>
            <p>Đồng Phục Hỏa Tốc đã áp dụng tiêu chuẩn quản lý chất lượng ISO vào xây dựng hệ thống sản xuất. Xưởng may rộng 2000m², đầu tư máy móc hiện đại và quy trình kiểm soát chất lượng nghiêm ngặt từ khâu nguyên liệu đến thành phẩm.</p>
            <div className="about-stats">
              <div className="stat-item">
                <strong>10+</strong>
                <span>Năm kinh nghiệm</span>
              </div>
              <div className="stat-item">
                <strong>2000+</strong>
                <span>Khách hàng</span>
              </div>
              <div className="stat-item">
                <strong>1000m²</strong>
                <span>Xưởng sản xuất</span>
              </div>
              <div className="stat-item">
                <strong>100%</strong>
                <span>Hài lòng</span>
              </div>
            </div>
            <a href="/gioi-thieu" className="btn btn-primary">Tìm Hiểu Thêm</a>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="clients-section">
        <div className="container">
          <div className="section-header">
            <h2>Khách Hàng Nổi Bật</h2>
            <p>Đã được tin dùng bởi hàng nghìn doanh nghiệp lớn nhỏ trên toàn quốc</p>
          </div>
          <div className="clients-grid">
            {clients.map((c) => (
              <div key={c.name} className="client-item">
                <span className="client-logo">{c.logo}</span>
                <span className="client-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Cam Kết Của Chúng Tôi</h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🏭</span>
              <h3>Xưởng Sản Xuất Riêng</h3>
              <p>Xưởng may 1000m² với máy móc hiện đại, kiểm soát chất lượng toàn bộ quy trình</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🎨</span>
              <h3>Thiết Kế Miễn Phí</h3>
              <p>Đội ngũ thiết kế chuyên nghiệp, tư vấn và thiết kế mẫu miễn phí theo yêu cầu</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🚚</span>
              <h3>Giao Hàng Đúng Hẹn</h3>
              <p>Cam kết giao hàng đúng tiến độ, hỗ trợ ship toàn quốc nhanh chóng</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">💎</span>
              <h3>Chất Lượng Đảm Bảo</h3>
              <p>Sử dụng vải cao cấp, màu sắc bền đẹp, đường chỉ chắc chắn, bảo hành 12 tháng</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="news-preview">
        <div className="container">
          <div className="grid-header">
            <div className="section-header" style={{textAlign:'left'}}>
              <h2 style={{display:'inline-block'}}>Tin Tức & Chia Sẻ</h2>
            </div>
            <a href="/tin-tuc" className="view-all-link">Xem tất cả &rarr;</a>
          </div>
          <div className="news-grid">
            {[
              { title: 'Sản xuất 1000 áo đồng phục cho trường đại học Lâm Nghiệp', date: '25/04/2025', cat: 'Tin Tức' },
              { title: 'Top 5 mẫu đồng phục công ty được ưa chuộng nhất năm 2025', date: '20/04/2025', cat: 'Chia Sẻ' },
              { title: 'Cách chọn chất liệu vải đồng phục phù hợp với từng ngành nghề', date: '15/04/2025', cat: 'Kiến Thức' },
            ].map((n, i) => (
              <a key={i} href="/tin-tuc" className="news-item">
                <div className="news-img-placeholder">
                  <span>{['📰','📋','📝'][i]}</span>
                </div>
                <div className="news-content">
                  <span className="news-cat">{n.cat}</span>
                  <h3>{n.title}</h3>
                  <span className="news-date">{n.date}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
