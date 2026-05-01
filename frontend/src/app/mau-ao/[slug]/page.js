'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import './collection.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API}/${path.replace(/\\/g, '/')}`;
};

export default function MauAoPage({ params }) {
  const { slug } = use(params);
  
  const [tag, setTag] = useState(null);
  const [products, setProducts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all tags for sidebar
  useEffect(() => {
    fetch(`${API}/api/tag/all`)
      .then(r => r.json())
      .then(data => setAllTags(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Fetch products by tag slug
  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API}/api/product/tag/${slug}/allproduct?page=${page}&limit=12`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => setError('Không tìm thấy tag này.'))
      .finally(() => setLoading(false));
  }, [slug, page]);

  // Fetch tag info separately for the name
  useEffect(() => {
    fetch(`${API}/api/tag/all`)
      .then(r => r.json())
      .then(data => {
        const found = (Array.isArray(data) ? data : []).find(t => t.slug === slug);
        if (found) setTag(found);
      })
      .catch(() => {});
  }, [slug]);

  const tagName = tag?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link href="/">Trang Chủ</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Mẫu Áo</span>
          <span className="breadcrumb-sep">›</span>
          <span>{tagName}</span>
        </div>
      </div>

      <div className="collection-page">
        <div className="container">
          {/* Tag tabs */}
          <div className="collection-tabs">
            {allTags.slice(0, 8).map(t => (
              <Link
                key={t._id}
                href={`/mau-ao/${t.slug}`}
                className={`col-tab ${t.slug === slug ? 'active' : ''}`}
              >
                {t.name}
              </Link>
            ))}
          </div>

          <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
            <h2>Bộ Sưu Tập {tagName}</h2>
            {!loading && !error && <p>{products.length} sản phẩm</p>}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              Đang tải sản phẩm...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#e74c3c' }}>
              <p>{error}</p>
              <Link href="/san-pham" style={{ color: '#FF6B35' }}>← Xem tất cả sản phẩm</Link>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              Chưa có sản phẩm trong tag này.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="collection-grid">
                {products.map(p => (
                  <Link
                    key={p._id}
                    href={`/san-pham/${p.slug || p._id}/${p._id}`}
                    className="collection-card"
                  >
                    {p.images?.[0] ? (
                      <div className="col-card-img">
                        <img src={imgUrl(p.images[0])} alt={p.name} />
                      </div>
                    ) : (
                      <div className="col-card-img">👕</div>
                    )}
                    <div className="col-card-info">
                      <h3>{p.name}</h3>
                      {p.price ? (
                        <span>{p.price.toLocaleString('vi-VN')}₫</span>
                      ) : (
                        <span style={{ color: '#888', fontSize: 13 }}>Liên hệ báo giá</span>
                      )}
                      <button className="btn btn-outline col-btn">Xem Mẫu</button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      style={{
                        padding: '8px 14px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        background: n === page ? '#FF6B35' : '#fff',
                        color: n === page ? '#fff' : '#333',
                        fontWeight: n === page ? 700 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* CTA Banner */}
          {!loading && !error && (
            <div className="collection-cta">
              <h2>Không tìm thấy mẫu ưng ý?</h2>
              <p>Đội ngũ thiết kế của chúng tôi sẵn sàng tạo ra mẫu đồng phục độc đáo theo yêu cầu riêng của bạn.</p>
              <Link href="/lien-he" className="btn btn-primary">Yêu Cầu Thiết Kế Riêng</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
