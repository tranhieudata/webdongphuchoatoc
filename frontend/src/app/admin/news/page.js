'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL
function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

async function handleAuthError(res) {
  if (res.status === 401) {
    const data = await res.json();
    if (data.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('admin_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      return true;
    }
  }
  return false;
}


export default function AdminNewsPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alert, setAlert] = useState('');

  const load = useCallback(() => {
    const q = new URLSearchParams({ page, limit: 10, ...(statusFilter ? { status: statusFilter } : {}), ...(search ? { search } : {}) });
    fetch(`${API}/api/news?${q}`, { headers: authHeader() })
      .then(async r => {
        if (await handleAuthError(r)) return;
        return r.json();
      })
      .then(d => { 
        if (d) { setPosts(d.posts || []); setTotalPages(d.totalPages || 1); }
      })
      .catch(() => {});
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Xóa bài viết "${title}"?`)) return;
    const res = await fetch(`${API}/api/news/${id}`, { method: 'DELETE', headers: authHeader() });
    if (await handleAuthError(res)) return;
    if (res.ok) { setAlert('success:Đã xóa thành công'); load(); }
    else setAlert('error:Xóa thất bại');
  };

  const statusLabel = { published: ['Đã Đăng', 'abadge-green'], draft: ['Nháp', 'abadge-gray'], archived: ['Lưu Trữ', 'abadge-orange'] };

  return (
    <>
      {alert && (
        <div className={alert.startsWith('success') ? 'admin-alert-success' : 'admin-alert-error'} style={{ marginBottom: 16 }}>
          {alert.split(':').slice(1).join(':')}
          <button onClick={() => setAlert('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>×</button>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-toolbar">
            <div className="admin-search">
              <span>🔍</span>
              <input placeholder="Tìm bài viết..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="admin-filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">Tất cả trạng thái</option>
              <option value="published">Đã Đăng</option>
              <option value="draft">Nháp</option>
              <option value="archived">Lưu Trữ</option>
            </select>
          </div>
          <Link href="/admin/news/write" className="abtn abtn-primary">+ Viết Bài Mới</Link>
        </div>

        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu Đề</th>
                <th>Slug</th>
                <th>Tác Giả</th>
                <th>Trạng Thái</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={7}><div className="admin-empty"><span>📭</span><p>Không có bài viết nào</p></div></td></tr>
              ) : posts.map((p, i) => {
                const [label, cls] = statusLabel[p.status] || ['—', 'abadge-gray'];
                return (
                  <tr key={p._id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td style={{ fontWeight: 600, maxWidth: 280 }}>{p.title}</td>
                    <td><code style={{ background: '#f0f2f5', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{p.slug}</code></td>
                    <td>{p.author?.username || '—'}</td>
                    <td><span className={`abadge ${cls}`}>{label}</span></td>
                    <td style={{ fontSize: 12, color: '#888' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/admin/news/edit/${p._id}`} className="abtn abtn-edit abtn-sm">✏️ Sửa</Link>
                      <button onClick={() => handleDelete(p._id, p.title)} className="abtn abtn-danger abtn-sm">🗑️ Xóa</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="apg-info">Trang {page}/{totalPages}</span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} className={`apg-btn ${n === page ? 'active' : ''}`}>{n}</button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
