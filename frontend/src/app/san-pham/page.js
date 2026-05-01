'use client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/Products/ProductCard';
import './products.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const LIMIT = 12;

export default function SanPhamPage() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API}/api/product/allproduct?page=${page}&limit=${LIMIT}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalProducts || 0);
      })
      .catch(() => setError('Không thể tải sản phẩm. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [page]);

  // Sort client-side
  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'new') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  // Normalize product for ProductCard (DB uses _id and images[])
  const normalize = (p) => ({
    ...p,
    id: p._id,
    image: p.images?.[0] ? `${API}/${p.images[0].replace(/\\/g, '/')}` : null,
  });

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <a href="/">Trang Chủ</a>
          <span className="breadcrumb-sep">›</span>
          <span>Sản Phẩm</span>
        </div>
      </div>

      <div className="products-page">
        <div className="container">
          <div className="products-header">
            <h1>Tất Cả Sản Phẩm</h1>
            <p>Khám phá bộ sưu tập đồng phục cao cấp đa dạng cho mọi ngành nghề{totalProducts > 0 && ` (${totalProducts} sản phẩm)`}</p>
          </div>

          {/* Sort Bar */}
          <div className="filter-bar">
            <div className="filter-tags" />
            <div className="sort-wrap">
              <label>Sắp xếp:</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="new">Mới nhất</option>
              </select>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>Đang tải sản phẩm...</div>
          )}
          {error && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#e74c3c' }}>{error}</div>
          )}

          {!loading && !error && sorted.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>Chưa có sản phẩm nào.</div>
          )}

          {!loading && !error && sorted.length > 0 && (
            <>
              <div className="products-grid">
                {sorted.map((p) => (
                  <ProductCard key={p._id} product={normalize(p)} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                  <button
                    className="page-btn"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ‹ Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`page-btn${page === n ? ' active' : ''}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
