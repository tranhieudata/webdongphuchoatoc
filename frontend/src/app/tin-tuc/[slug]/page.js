import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../news.css';

const API = process.env.NEXT_PUBLIC_API_URL

async function getPost(slug) {
  try {
    const res = await fetch(`${API}/api/news/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getRelated() {
  try {
    const res = await fetch(`${API}/api/news?limit=4&status=published`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Không tìm thấy' };
  return {
    title: `${post.title} | Đồng Phục Hoạt Tốc`,
    description: post.metaDescription || post.title,
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default async function NewsDetailPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const related = (await getRelated()).filter(p => p.slug !== params.slug).slice(0, 3);

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link href="/">Trang Chủ</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href="/tin-tuc">Tin Tức</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{post.title}</span>
        </div>
      </div>

      <div className="article-page">
        <div className="container">
          <div className="article-layout">
            {/* Main content */}
            <article className="article-main">
              {post.tags?.length > 0 && (
                <div className="article-tags-top">
                  {post.tags.map(tag => (
                    <span key={tag} className="news-cat-badge">{tag}</span>
                  ))}
                </div>
              )}
              <h1 className="article-title">{post.title}</h1>
              <div className="article-meta">
                <span>📅 {formatDate(post.createdAt)}</span>
                {post.author?.username && <span>✍️ {post.author.username}</span>}
                <span>👁 {post.views || 0} lượt xem</span>
              </div>

              {post.featuredImage && (
                <div className="article-featured-img">
                  <img src={`${API}${post.featuredImage}`} alt={post.title} />
                </div>
              )}

              {post.metaDescription && (
                <div className="article-excerpt">
                  <p>{post.metaDescription}</p>
                </div>
              )}

              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="article-footer">
                <Link href="/tin-tuc" className="btn-back-news">← Quay Lại Tin Tức</Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="article-sidebar">
              <div className="sidebar-widget">
                <h3>Bài Viết Mới Nhất</h3>
                {related.length === 0 ? (
                  <p style={{ color: '#888', fontSize: 14 }}>Chưa có bài viết khác.</p>
                ) : related.map(p => (
                  <Link key={p._id} href={`/tin-tuc/${p.slug}`} className="sidebar-post">
                    <div className="sidebar-post-img">
                      {p.featuredImage
                        ? <img src={`${API}${p.featuredImage}`} alt={p.title} />
                        : <span>📰</span>}
                    </div>
                    <div>
                      <p className="sidebar-post-title">{p.title}</p>
                      <span className="sidebar-post-date">{formatDate(p.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="sidebar-widget sidebar-cta">
                <h3>Tư Vấn Miễn Phí</h3>
                <p>Liên hệ ngay để được tư vấn thiết kế đồng phục theo yêu cầu</p>
                <a href="tel:0983430900" className="btn-cta-sidebar">📞 0983 430 900</a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
