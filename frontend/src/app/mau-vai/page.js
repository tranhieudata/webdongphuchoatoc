import Link from 'next/link';
import '../../styles/fabric.css';

const API = process.env.URL_BACKEND || 'http://localhost:5000';

async function getFabricSamples() {
  try {
    const res = await fetch(`${API}/api/fabric-sample?limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Mẫu Vải | Đồng Phục Hoạt Tốc',
  description: 'Bộ sưu tập mẫu vải may đồng phục đa dạng: vải thun, vải kate, vải kaki, vải lưới... chất lượng cao tại Đồng Phục Hoạt Tốc.',
};

export default async function MauVaiPage() {
  const items = await getFabricSamples();

  return (
    <div className="fabric-page">
      {/* Hero */}
      <div className="fabric-hero">
        <div className="container">
          <nav className="fabric-breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>/</span>
            <span>Mẫu Vải</span>
          </nav>
          <h1>Bộ Sưu Tập Mẫu Vải</h1>
          <p>Đa dạng chất liệu vải cao cấp, phù hợp mọi loại đồng phục</p>
        </div>
      </div>

      <div className="container fabric-container">
        {items.length === 0 ? (
          <div className="fabric-empty">
            <span>🧵</span>
            <p>Chưa có mẫu vải nào. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="fabric-grid">
            {items.map((item) => (
              <Link href={`/mau-vai/${item.slug}`} key={item._id} className="fabric-card">
                <div className="fabric-card-img">
                  {item.images && item.images.length > 0 ? (
                    <img src={`${API}${item.images[0]}`} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="fabric-card-placeholder">🧵</div>
                  )}
                  {item.images && item.images.length > 1 && (
                    <span className="fabric-img-count">+{item.images.length - 1} ảnh</span>
                  )}
                </div>
                <div className="fabric-card-body">
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description.substring(0, 80)}{item.description.length > 80 ? '...' : ''}</p>}
                  <span className="fabric-view-btn">Xem Chi Tiết →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
