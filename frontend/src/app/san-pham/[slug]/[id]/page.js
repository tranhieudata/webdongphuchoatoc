'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import './product-detail.css';

const API = process.env.NEXT_PUBLIC_API_URL
const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API}/${path.replace(/\\/g, '/')}`;
};

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/product/id/${id}`)
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

    // Fetch related products
    fetch(`${API}/api/product/allproduct?page=1&limit=5`)
      .then((r) => r.json())
      .then((data) => {
        const others = (data.products || []).filter((p) => p._id !== id).slice(0, 4);
        setRelated(others);
      })
      .catch(() => {});
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>Đang tải sản phẩm...</div>
  );
  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#e74c3c' }}>
      <p>{error}</p>
      <Link href="/san-pham" style={{ color: '#009944' }}>← Quay lại danh sách sản phẩm</Link>
    </div>
  );

  const images = (product.images || []).map(imgUrl);
  const categoryNames = categories.map((c) => c.categoryId?.name).filter(Boolean);
  const tagNames = (product.tags?.length ? product.tags : tags.map((t) => t.tagId?.name).filter(Boolean));

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">Trang Chủ</Link>
          <span>/</span>
          <Link href="/san-pham">Sản Phẩm</Link>
          {categoryNames[0] && (
            <>
              <span>/</span>
              <span>{categoryNames[0]}</span>
            </>
          )}
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="product-detail-layout">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              {mainImage ? (
                <img src={mainImage} alt={product.name} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '1', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>👕</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-images">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className={mainImage === img ? 'active' : ''}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              {categoryNames.length > 0 && (
                <span className="category">{categoryNames.join(', ')}</span>
              )}
              <h1 className="product-title">{product.name}</h1>
            </div>

            {/* Price */}
            <div className="product-price-section">
              <span className="current-price">{product.price?.toLocaleString('vi-VN')}₫</span>
            </div>

            {/* Excerpt */}
            {product.excerpt && (
              <p className="product-description">{product.excerpt}</p>
            )}

            {/* Tags */}
            {tagNames.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '12px 0' }}>
                {tagNames.map((t, i) => (
                  <span key={i} style={{ padding: '3px 12px', background: '#e8f5ee', color: '#009944', borderRadius: 99, fontSize: 12, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            )}

            {/* Status */}
            <div className="stock-info" style={{ margin: '16px 0 8px' }}>
              {product.status === 'active' ? (
                <span className="in-stock">✓ Còn hàng</span>
              ) : (
                <span className="out-of-stock">✗ Tạm hết hàng</span>
              )}
            </div>

            {/* Actions */}
            <div className="product-actions">
              <a
                href={`https://zalo.me/0335003416`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-contact-zalo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                  <circle cx="24" cy="24" r="24" fill="#fff"/>
                  <path fill="#0068FF" d="M24 5C13.5 5 5 12.8 5 22.4c0 5.7 2.9 10.8 7.5 14.1l-1 6.1 6.7-3.3c2.1.6 4.4 1 6.8 1 10.5 0 19-7.8 19-17.4C44 12.8 34.5 5 24 5z"/>
                  <path fill="#fff" d="M33 28.2c-.3-.6-1.5-2.8-1.5-2.8-.2-.3-.1-.6.1-.8 1.4-1.3 2.2-2.7 2.4-4.2.4-3-1.4-5.8-4.6-7.2-2.8-1.3-6.4-1.2-9.1.2-2.9 1.5-4.4 4.1-4 6.8.4 2.7 2.6 4.8 6 5.6.9.2 1.8.3 2.7.3.7 0 1.5-.1 2.2-.2l3.9 2.1-.9-3.7.1-.1c.4-.3 2.7-1.7 2.7-1.7s.3-.3 0-.3z"/>
                  <path fill="#0068FF" d="M20 21h4l-4 4.8h4.2M27 21v4.8" stroke="#0068FF" strokeWidth="0.5"/>
                </svg>
                Liên Hệ Ngay Qua Zalo 0335.003.416
              </a>
            </div>
            
            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item"><span>🚚 Giao hàng hỏa tốc</span><p>Cho đơn hàng trên 500.000₫</p></div>
              <div className="info-item"><span>↩️ Đổi trả 30 ngày</span><p>Nếu không hài lòng</p></div>
              <div className="info-item"><span>🔒 Thanh toán an toàn</span><p>Bảo mật thông tin khách hàng</p></div>
            </div>
          </div>
        </div>

        {/* Tabs: Description */}
        <div className="product-details-section">
          <div className="details-tabs">
            <button className={`tab-btn${activeTab === 'desc' ? ' active' : ''}`} onClick={() => setActiveTab('desc')}>Mô Tả Sản Phẩm</button>
            {product.metaDescription && (
              <button className={`tab-btn${activeTab === 'info' ? ' active' : ''}`} onClick={() => setActiveTab('info')}>Thông Tin Thêm</button>
            )}
          </div>

          {activeTab === 'desc' && (
            <div className="tab-content active">
              <div style={{ lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line' }}>
                {product.description || 'Chưa có mô tả.'}
              </div>
            </div>
          )}
          {activeTab === 'info' && product.metaDescription && (
            <div className="tab-content active">
              <p style={{ color: '#444', lineHeight: 1.8 }}>{product.metaDescription}</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-products">
            <h2 className="section-title">Sản Phẩm Liên Quan</h2>
            <div className="related-grid">
              {related.map((p) => (
                <Link key={p._id} href={`/san-pham/${p.slug || p._id}/${p._id}`} className="related-card">
                  {p.images?.[0] ? (
                    <img src={imgUrl(p.images[0])} alt={p.name} />
                  ) : (
                    <div style={{ height: 180, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👕</div>
                  )}
                  <h3>{p.name}</h3>
                  <p className="price">{p.price?.toLocaleString('vi-VN')}₫</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
