'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL
function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, posts: 0, categories: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const headers = authHeader();
    Promise.all([
      fetch(`${API}/api/product/allproduct?limit=5`, { headers }).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/api/news?limit=5`, { headers }).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/api/category/all`, { headers }).then(r => r.json()).catch(() => []),
    ]).then(([prod, news, cats]) => {
      setStats({
        products: prod?.totalProducts || prod?.products?.length || 0,
        posts: news?.total || news?.posts?.length || 0,
        categories: Array.isArray(cats) ? cats.length : 0,
      });
      setRecentPosts(news?.posts?.slice(0, 5) || []);
      setRecentProducts(prod?.products?.slice(0, 5) || []);
    });
  }, []);

  const statCards = [
    { icon: '👕', label: 'Sản Phẩm', value: stats.products, color: 'green', href: '/admin/product' },
    { icon: '📰', label: 'Bài Viết', value: stats.posts, color: 'blue', href: '/admin/news' },
    { icon: '🗂️', label: 'Danh Mục', value: stats.categories, color: 'orange', href: '/admin/category' },
    { icon: '🔗', label: 'Tổng Slug', value: stats.products + stats.posts + stats.categories, color: 'purple', href: '/admin/slug' },
  ];

  return (
    <>
      <div className="admin-stats">
        {statCards.map(s => (
          <a key={s.label} href={s.href} className="admin-stat-card" style={{ textDecoration: 'none' }}>
            <div className={`asc-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="asc-value">{s.value}</div>
              <div className="asc-label">{s.label}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>📰 Bài Viết Mới Nhất</h3>
            <a href="/admin/news" className="abtn abtn-outline abtn-sm">Xem tất cả</a>
          </div>
          <div className="admin-card-body">
            {recentPosts.length === 0 ? (
              <div className="admin-empty"><span>📭</span><p>Chưa có bài viết</p></div>
            ) : recentPosts.map((p, i) => (
              <div key={i} className="admin-recent-item">
                <div className="ari-icon">📰</div>
                <div>
                  <div className="ari-name">{p.title || 'Bài viết'}</div>
                  <div className="ari-meta">{p.status || 'draft'} · /{p.slug || p._id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>👕 Sản Phẩm Mới Nhất</h3>
            <a href="/admin/product" className="abtn abtn-outline abtn-sm">Xem tất cả</a>
          </div>
          <div className="admin-card-body">
            {recentProducts.length === 0 ? (
              <div className="admin-empty"><span>📦</span><p>Chưa có sản phẩm</p></div>
            ) : recentProducts.map((p, i) => (
              <div key={i} className="admin-recent-item">
                <div className="ari-icon">👕</div>
                <div>
                  <div className="ari-name">{p.name || 'Sản phẩm'}</div>
                  <div className="ari-meta">Slug: {p.slug || p._id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}