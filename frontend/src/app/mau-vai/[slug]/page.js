import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../../styles/fabric.css';

const API = process.env.NEXT_PUBLIC_API_URL

async function getFabricSample(slug) {
  try {
    const res = await fetch(`${API}/api/fabric-sample/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const item = await getFabricSample(params.slug);
  if (!item) return { title: 'Không tìm thấy' };
  return {
    title: `${item.title} | Mẫu Vải - Đồng Phục Hoạt Tốc`,
    description: item.description || `Mẫu vải ${item.title} tại Đồng Phục Hoạt Tốc`,
  };
}

export default async function FabricDetailPage({ params }) {
  const item = await getFabricSample(params.slug);
  if (!item) notFound();

  return (
    <div className="fabric-page">
      <div className="fabric-hero">
        <div className="container">
          <nav className="fabric-breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>/</span>
            <Link href="/mau-vai">Mẫu Vải</Link>
            <span>/</span>
            <span>{item.title}</span>
          </nav>
          <h1>{item.title}</h1>
        </div>
      </div>

      <div className="container fabric-container">
        <div className="fabric-detail">
          {/* Gallery */}
          {item.images && item.images.length > 0 && (
            <div className="fabric-gallery">
              {item.images.map((img, i) => (
                <div key={i} className="fabric-gallery-item">
                  <img src={`${API}${img}`} alt={`${item.title} - ảnh ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="fabric-detail-info">
            <h2>{item.title}</h2>
            {item.description && (
              <div className="fabric-description">
                <p>{item.description}</p>
              </div>
            )}
            <div className="fabric-cta">
              <a href="tel:0335003416" className="btn-primary-fabric">📞 Tư Vấn Ngay</a>
              <Link href="/mau-vai" className="btn-outline-fabric">← Xem Mẫu Khác</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
