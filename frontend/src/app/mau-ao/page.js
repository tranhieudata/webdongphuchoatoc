
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';


const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API}/${path.replace(/\\/g, '/')}`;
};

export default function MauAoPage() {
  const [tags, setTags] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch all tags
  useEffect(() => {
    fetch(`${API}/api/tag/all`)
      .then(r => r.json())
      .then(data => {
        setTags(Array.isArray(data) ? data : []);
      })
      .catch(() => setTags([]));
  }, []);

  // Fetch products based on selected tag
  useEffect(() => {
    setLoading(true);
    let url;
    
    if (selectedTag) {
      url = `${API}/api/product/tag/${selectedTag}/allproduct?page=${page}&limit=12`;
    } else {
      url = `${API}/api/product/allproduct?page=${page}&limit=12`;
    }

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        setProducts([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [selectedTag, page]);

  const handleTagClick = (tagSlug) => {
    setSelectedTag(selectedTag === tagSlug ? null : tagSlug);
    setPage(1);
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <img
        src="/assets/img/banner-03.png"
        alt="Mẫu Áo"
        style={{ width: "100%" }}
      />

      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 12px 0' }}>Mẫu Áo Đồng Phục</h1>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>Khám phá các mẫu áo đồng phục phong phú và đa dạng</p>
          </div>

          {/* Tags Filter */}
          {tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '32px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setPage(1);
                }}
                style={{
                  padding: '8px 16px',
                  border: !selectedTag ? '2px solid #FF6B35' : '2px solid #ddd',
                  background: !selectedTag ? '#FF6B35' : '#fff',
                  color: !selectedTag ? '#fff' : '#333',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: !selectedTag ? '600' : '500',
                  transition: 'all 0.3s'
                }}
              >
                Tất Cả
              </button>
              {tags.map(tag => (
                <button
                  key={tag._id}
                  onClick={() => handleTagClick(tag.slug)}
                  style={{
                    padding: '8px 16px',
                    border: selectedTag === tag.slug ? '2px solid #FF6B35' : '2px solid #ddd',
                    background: selectedTag === tag.slug ? '#FF6B35' : '#fff',
                    color: selectedTag === tag.slug ? '#fff' : '#333',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: selectedTag === tag.slug ? '600' : '500',
                    transition: 'all 0.3s'
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              Đang tải sản phẩm...
            </div>
          )}

          {!loading && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <p>Không tìm thấy sản phẩm nào.</p>
              <Link href="/san-pham" style={{ color: '#FF6B35' }}>← Xem tất cả sản phẩm</Link>
            </div>
          )}

          {!loading && products.length > 0 && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {products.map(p => (
                  <Link
                    key={p._id}
                    href={`/san-pham/${p.slug || p._id}/${p._id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'transform 0.3s',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,153,68,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #f0f9f4, #e8f5ee)',
                      height: '220px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {p.images?.[0] ? (
                        <img
                          src={imgUrl(p.images[0])}
                          alt={p.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '72px' }}>👕</div>
                      )}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#222',
                        margin: '0 0 8px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {p.name}
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        color: '#009944',
                        fontWeight: '700',
                        marginBottom: '12px'
                      }}>
                        {p.price ? `${p.price.toLocaleString('vi-VN')}₫` : 'Liên hệ giá'}
                      </div>
                      <button
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #FF6B35',
                          background: '#fff',
                          color: '#FF6B35',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Xem Chi Tiết
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '32px'
                }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      style={{
                        padding: '8px 14px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        background: n === page ? '#FF6B35' : '#fff',
                        color: n === page ? '#fff' : '#333',
                        fontWeight: n === page ? '700' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
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
          <div style={{
            background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
            borderLeft: '4px solid #FF6B35',
            padding: '32px',
            borderRadius: '8px',
            textAlign: 'center',
            marginTop: '60px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 12px 0' }}>
              Không tìm thấy mẫu ưng ý?
            </h2>
            <p style={{ fontSize: '15px', color: '#666', margin: '0 0 20px 0' }}>
              Đội ngũ thiết kế của chúng tôi sẵn sàng tạo ra mẫu đồng phục độc đáo theo yêu cầu riêng của bạn.
            </p>
            <Link
              href="/lien-he"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#FF6B35',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e85a24';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FF6B35';
              }}
            >
              Yêu Cầu Thiết Kế Riêng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
