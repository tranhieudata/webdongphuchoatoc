import Link from 'next/link';
import './news.css';

const API = process.env.URL_BACKEND || 'http://localhost:5000';
const POSTS_PER_PAGE = 12;

async function getPosts(page = 1) {
  try {
    const res = await fetch(
      `${API}/api/news?page=${page}&limit=${POSTS_PER_PAGE}&status=published`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { posts: [], totalPages: 0 };
    const data = await res.json();
    return { posts: data.posts || [], totalPages: data.totalPages || 1 };
  } catch {
    return { posts: [], totalPages: 0 };
  }
}

export async function generateMetadata({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  
  let title = 'Tin Tức | Đồng Phục Hoạt Tốc';
  let description = 'Cập nhật tin tức mới nhất về đồng phục, xu hướng thời trang và hoạt động của Đồng Phục Hoạt Tốc.';
  
  if (page > 1) {
    title = `Tin Tức - Trang ${page} | Đồng Phục Hoạt Tốc`;
    description = `${description} (Trang ${page})`;
  }

  return {
    title,
    description,
    robots: page === 1 ? 'index, follow' : 'index, follow',
    canonical: page === 1 
      ? 'https://dongphuchoatoc.vn/tin-tuc'
      : `https://dongphuchoatoc.vn/tin-tuc?page=${page}`
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default async function TinTucPage({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;
  const { posts, totalPages } = await getPosts(page);

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link href="/">Trang Chủ</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href="/tin-tuc">Tin Tức</Link>
          {page > 1 && (
            <>
              <span className="breadcrumb-sep">›</span>
              <span>Trang {page}</span>
            </>
          )}
        </div>
      </div>

      <div className="news-page">
        <div className="container">
          <div className="section-header">
            <h2>Tin Tức & Chia Sẻ</h2>
            <p>Cập nhật những tin tức mới nhất về đồng phục, xu hướng thời trang và hoạt động của Hoạt Tốc</p>
          </div>

          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📰</div>
              <p>Chưa có bài viết nào. Vui lòng quay lại sau.</p>
            </div>
          ) : (
            <>
              <div className="news-list">
                {posts.map(post => (
                  <Link key={post._id} href={`/tin-tuc/${post.slug}`} className="news-card">
                    <div className="news-card-img">
                      {post.featuredImage
                        ? <img src={`${API}${post.featuredImage}`} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span>📰</span>
                      }
                    </div>
                    <div className="news-card-content">
                      <span className="news-cat-badge">{post.tags?.[0] || 'Tin Tức'}</span>
                      <h2>{post.title}</h2>
                      {post.metaDescription && <p>{post.metaDescription}</p>}
                      <div className="news-meta">
                        <span>📅 {formatDate(post.createdAt)}</span>
                        <span>👁 {post.views || 0} lượt xem</span>
                        <span className="read-more">Đọc thêm →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="news-pagination">
                  <div className="pagination-info">
                    Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
                  </div>
                  
                  <div className="pagination-buttons">
                    {page > 1 && (
                      <Link href={page === 2 ? '/tin-tuc' : `/tin-tuc?page=${page - 1}`} className="pg-btn pg-prev">
                        ← Trang Trước
                      </Link>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(n => {
                        // Show: first, last, current, and neighbors
                        if (n === 1 || n === totalPages) return true;
                        if (Math.abs(n - page) <= 1) return true;
                        return false;
                      })
                      .map((n, idx, arr) => {
                        const result = [];
                        // Show "..." if gap before this number
                        if (idx > 0 && arr[idx - 1] !== n - 1) {
                          result.push(
                            <span key={`dots-${n}`} className="pg-dots">...</span>
                          );
                        }
                        result.push(
                          n === page ? (
                            <span key={n} className="pg-btn pg-current">{n}</span>
                          ) : (
                            <Link
                              key={n}
                              href={n === 1 ? '/tin-tuc' : `/tin-tuc?page=${n}`}
                              className="pg-btn"
                            >
                              {n}
                            </Link>
                          )
                        );
                        return result;
                      })}
                    
                    {page < totalPages && (
                      <Link href={`/tin-tuc?page=${page + 1}`} className="pg-btn pg-next">
                        Trang Sau →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* SEO: rel=prev/next links */}
      {page > 1 && (
        <link rel="prev" href={page === 2 ? 'https://dongphuchoatoc.vn/tin-tuc' : `https://dongphuchoatoc.vn/tin-tuc?page=${page - 1}`} />
      )}
      {page < totalPages && (
        <link rel="next" href={`https://dongphuchoatoc.vn/tin-tuc?page=${page + 1}`} />
      )}
    </>
  );
}
