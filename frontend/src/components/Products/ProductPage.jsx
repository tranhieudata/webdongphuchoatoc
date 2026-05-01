'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API}/${path.replace(/\\/g, '/')}`;
};

export default function ProductPage({ productSlug }) {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    if (!productSlug) return;
    setLoading(true);
    fetch(`${API}/api/product/slug/${productSlug}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((data) => {
        setProduct(data.product);
        setCategories(data.categories || []);
        setTags(data.tags || []);
        setMainImage(imgUrl(data.product?.images?.[0]));
      })
      .catch(() => setError('Không tìm thấy sản phẩm.'))
      .finally(() => setLoading(false));
  }, [productSlug]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>Đang tải sản phẩm...</div>
  );
  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#e74c3c' }}>
      <p>{error}</p>
      <Link href="/mau-ao" style={{ color: '#009944' }}>← Quay lại mẫu áo</Link>
    </div>
  );
  if (!product) return null;

  const images = (product.images || []).map(imgUrl);
  const categoryNames = categories.map((c) => c.categoryId?.name).filter(Boolean);
  const tagNames = (product.tags?.length ? product.tags : tags.map((t) => t.tagId?.name).filter(Boolean));

  return (
    <div style={{ padding: '24px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, fontSize: 14, color: '#666' }}>
          <Link href="/" style={{ color: '#009944' }}>Trang Chủ</Link>
          <span>/</span>
          <Link href="/mau-ao" style={{ color: '#009944' }}>Mẫu Áo</Link>
          {categoryNames[0] && <><span>/</span><span>{categoryNames[0]}</span></>}
          <span>/</span>
          <span style={{ color: '#333', fontWeight: 500 }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
          {/* Images */}
          <div>
            <div style={{ width: '100%', aspectRatio: '1', background: '#f5f5f5', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
              {mainImage ? (
                <img src={mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>👕</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    onClick={() => setMainImage(img)}
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: mainImage === img ? '2px solid #009944' : '2px solid transparent' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {categoryNames.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 600, color: '#009944', textTransform: 'uppercase', letterSpacing: 1 }}>{categoryNames.join(', ')}</span>
            )}
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: '8px 0 16px' }}>{product.name}</h1>

            {product.price > 0 && (
              <div style={{ fontSize: 24, fontWeight: 700, color: '#009944', marginBottom: 16 }}>
                {product.price.toLocaleString('vi-VN')}₫
              </div>
            )}

            {product.excerpt && (
              <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 16 }}>{product.excerpt}</p>
            )}

            {tagNames.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {tagNames.map((t, i) => (
                  <span key={i} style={{ padding: '3px 12px', background: '#e8f5ee', color: '#009944', borderRadius: 99, fontSize: 12, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              {product.status === 'active' ? (
                <span style={{ color: '#009944', fontWeight: 600 }}>✓ Còn hàng</span>
              ) : (
                <span style={{ color: '#e74c3c', fontWeight: 600 }}>✗ Tạm hết hàng</span>
              )}
            </div>

            <a
              href="https://zalo.me/0335003416"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#009944', color: '#fff', padding: '14px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}
            >
              Liên Hệ Ngay Qua Zalo 0335.003.416
            </a>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#666' }}>
              <span>🚚 Giao hàng hỏa tốc cho đơn trên 500.000₫</span>
              <span>↩️ Đổi trả 30 ngày nếu không hài lòng</span>
              <span>🔒 Thanh toán bảo mật</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 24 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {['desc', product.metaDescription ? 'info' : null].filter(Boolean).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: activeTab === tab ? '#009944' : '#f0f0f0', color: activeTab === tab ? '#fff' : '#555' }}
              >
                {tab === 'desc' ? 'Mô Tả Sản Phẩm' : 'Thông Tin Thêm'}
              </button>
            ))}
          </div>
          {activeTab === 'desc' && (
            <div style={{ lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line' }}>
              {product.description || 'Chưa có mô tả.'}
            </div>
          )}
          {activeTab === 'info' && product.metaDescription && (
            <p style={{ color: '#444', lineHeight: 1.8 }}>{product.metaDescription}</p>
          )}
        </div>
      </div>
    </div>
  );
}
