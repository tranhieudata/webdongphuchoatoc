import Link from 'next/link';
import '../../styles/fabric.css';

const API = process.env.NEXT_PUBLIC_API_URL

async function getSizeCharts() {
  try {
    const res = await fetch(`${API}/api/size-chart?limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Bảng Size | Đồng Phục Hoạt Tốc',
  description: 'Bảng size đồng phục chuẩn xác từ S đến 5XL. Hướng dẫn đo kích thước và chọn size đồng phục phù hợp tại Đồng Phục Hoạt Tốc.',
};

export default async function BangSizePage() {
  const items = await getSizeCharts();

  return (
    <div className="fabric-page">
      {/* Hero */}
      <div className="fabric-hero">
        <div className="container">
          <nav className="fabric-breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>/</span>
            <span>Bảng Size</span>
          </nav>
          <h1>Bảng Size Đồng Phục</h1>
          <p>Hướng dẫn chọn size chính xác — từ S đến 5XL cho mọi loại đồng phục</p>
        </div>
      </div>

      <div className="container fabric-container">
        {/* Guide box */}
        <div className="size-guide-box">
          <h2>📏 Cách Đo Kích Thước</h2>
          <div className="size-guide-steps">
            <div className="size-guide-step">
              <span className="step-num">1</span>
              <div>
                <strong>Vòng Ngực</strong>
                <p>Đo vòng tròn lớn nhất của ngực, thước phải nằm ngang</p>
              </div>
            </div>
            <div className="size-guide-step">
              <span className="step-num">2</span>
              <div>
                <strong>Vòng Eo</strong>
                <p>Đo phần eo nhỏ nhất, thường là 2–3cm trên rốn</p>
              </div>
            </div>
            <div className="size-guide-step">
              <span className="step-num">3</span>
              <div>
                <strong>Chiều Cao</strong>
                <p>Đứng thẳng, đo từ đỉnh đầu đến gót chân</p>
              </div>
            </div>
            <div className="size-guide-step">
              <span className="step-num">4</span>
              <div>
                <strong>Cân Nặng</strong>
                <p>Kết hợp với chiều cao để chọn size chuẩn xác nhất</p>
              </div>
            </div>
          </div>
        </div>

        {/* Size charts */}
        {items.length === 0 ? (
          <div className="fabric-empty">
            <span>📐</span>
            <p>Chưa có bảng size nào. Vui lòng liên hệ để được tư vấn trực tiếp.</p>
            <a href="tel:0335003416" className="btn-primary-fabric" style={{ display: 'inline-block', marginTop: 16 }}>📞 Liên hệ tư vấn</a>
          </div>
        ) : (
          <div className="size-chart-list">
            {items.map((item) => (
              <div key={item._id} className="size-chart-item">
                <h2>{item.title}</h2>
                {item.description && <p className="size-chart-desc">{item.description}</p>}
                {item.images && item.images.length > 0 && (
                  <div className="size-chart-images">
                    {item.images.map((img, i) => (
                      <img
                        key={i}
                        src={`${API}${img}`}
                        alt={`${item.title} - bảng size ${i + 1}`}
                        loading="lazy"
                        className="size-chart-img"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="size-cta">
          <h3>Vẫn chưa chắc về size?</h3>
          <p>Liên hệ ngay với chúng tôi để được tư vấn và đo size miễn phí</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:0335003416" className="btn-primary-fabric">📞 Gọi: 0335 003 416</a>
            <a href="https://zalo.me/0335003416" target="_blank" rel="noopener noreferrer" className="btn-outline-fabric">Nhắn Zalo</a>
          </div>
        </div>
      </div>
    </div>
  );
}
