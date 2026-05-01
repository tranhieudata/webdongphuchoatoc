'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import './category.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API}/${path.replace(/\\/g, '/')}`;
};

export default function DanhMucPage({ params }) {
  const { slug } = use(params);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all categories for sidebar
  useEffect(() => {
    fetch(`${API}/api/category/all`)
      .then(r => r.json())
      .then(data => setAllCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Fetch products by category slug
  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API}/api/product/category/${slug}/allproduct?page=${page}&limit=12`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        // Try to get category name from first product's category data or fallback to slug
        if (data.category) setCategory(data.category);
      })
      .catch(() => setError('Không tìm thấy danh mục này.'))
      .finally(() => setLoading(false));
  }, [slug, page]);

  // Fetch category info separately for the name
  useEffect(() => {
    fetch(`${API}/api/category/all`)
      .then(r => r.json())
      .then(data => {
        const found = (Array.isArray(data) ? data : []).find(c => c.slug === slug);
        if (found) setCategory(found);
      })
      .catch(() => {});
  }, [slug]);

  const title = category?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link href="/">Trang Chủ</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href="/san-pham">Sản Phẩm</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{title}</span>
        </div>
      </div>

      <div className="cat-page">
        <div className="container">
          <div className="section-header">
            <h2>{title}</h2>
            {!loading && !error && <p>{products.length} sản phẩm trong danh mục này</p>}
          </div>

          <div className="cat-layout">
            {/* Sidebar danh mục */}
            <aside className="cat-filter">
              <div className="filter-block">
                <h4>Danh Mục</h4>
                <ul>
                  {allCategories.map(c => (
                    <li key={c._id}>
                      <Link
                        href={`/danh-muc/${c.slug}`}
                        className={c.slug === slug ? 'active' : ''}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Sản phẩm */}
            <div className="cat-products">
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
                  Chưa có sản phẩm trong danh mục này.
                </div>
              )}
              {!loading && !error && products.length > 0 && (
                <>
                  <div className="cat-products-grid">
                    {products.map(p => (
                      <Link
                        key={p._id}
                        href={`/san-pham/${p.slug || p._id}/${p._id}`}
                        className="cat-product-card"
                      >
                        {p.images?.[0] ? (
                          <div className="cat-prod-img">
                            <img src={imgUrl(p.images[0])} alt={p.name} />
                          </div>
                        ) : (
                          <div className="cat-prod-img">👕</div>
                        )}
                        <div className="cat-prod-info">
                          <h3>{p.name}</h3>
                          {p.price ? (
                            <strong>{p.price.toLocaleString('vi-VN')}₫</strong>
                          ) : (
                            <strong style={{ color: '#888', fontSize: 13 }}>Liên hệ báo giá</strong>
                          )}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

