'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL
function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

export default function AdminSlugPage() {
  const [activeTab, setActiveTab] = useState('product');
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [newSlug, setNewSlug] = useState('');
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { key: 'product', label: '👕 Sản Phẩm', endpoint: '/api/product/allproduct', listKey: 'products', updateUrl: (id) => `/api/product/${id}/edit` },
    { key: 'news', label: '📰 Bài Viết', endpoint: '/api/news', listKey: 'posts', updateUrl: (id) => `/api/news/${id}` },
    { key: 'category', label: '🗂️ Danh Mục', endpoint: '/api/category/all', listKey: null, updateUrl: (id) => `/api/category/${id}/edit` },
  ];

  const currentTab = tabs.find(t => t.key === activeTab);

  useEffect(() => {
    setItems([]);
    setSearch('');
    setEditItem(null);
    fetch(`${API}${currentTab.endpoint}?limit=100`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => {
        const list = currentTab.listKey ? (d[currentTab.listKey] || []) : (Array.isArray(d) ? d : []);
        setItems(list);
      })
      .catch(() => {});
  }, [activeTab]);

  const handleEditSlug = (item) => {
    setEditItem(item._id);
    setNewSlug(item.slug || '');
    setAlert('');
  };

  const handleSaveSlug = async (item) => {
    if (!newSlug.trim()) { setAlert('error:Slug không được để trống'); return; }
    if (!/^[a-z0-9-]+$/.test(newSlug)) { setAlert('error:Slug chỉ được chứa chữ thường, số và dấu gạch ngang'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}${currentTab.updateUrl(item._id)}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ ...item, slug: newSlug }),
      });
      if (res.ok) {
        setAlert('success:Cập nhật slug thành công!');
        setEditItem(null);
        setItems(prev => prev.map(i => i._id === item._id ? { ...i, slug: newSlug } : i));
      } else {
        const d = await res.json();
        setAlert('error:' + (d.message || 'Cập nhật thất bại'));
      }
    } catch { setAlert('error:Không thể kết nối server'); }
    setLoading(false);
  };

  const filtered = items.filter(item =>
    !search ||
    (item.name || item.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.slug || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {alert && (
        <div className={alert.startsWith('success') ? 'admin-alert-success' : 'admin-alert-error'} style={{ marginBottom: 16 }}>
          {alert.split(':').slice(1).join(':')}
          <button onClick={() => setAlert('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>×</button>
        </div>
      )}

      <div className="slug-type-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`slug-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label} <span style={{ opacity: 0.7, fontSize: 11 }}>({activeTab === t.key ? filtered.length : '...'})</span>
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-toolbar">
            <div className="admin-search">
              <span>🔍</span>
              <input placeholder={`Tìm slug ${currentTab.label}...`} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <span style={{ fontSize: 13, color: '#888' }}>{filtered.length} mục</span>
        </div>

        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Slug Hiện Tại</th>
                <th>URL Preview</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="admin-empty"><span>🔗</span><p>Không có dữ liệu</p></div></td></tr>
              ) : filtered.map((item, i) => {
                const name = item.name || item.title || '—';
                const slug = item.slug || '';
                const urlPrefix = activeTab === 'product' ? '/san-pham' : activeTab === 'news' ? '/tin-tuc' : '/danh-muc';
                const isEditing = editItem === item._id;
                return (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600, maxWidth: 200 }}>{name}</td>
                    <td>
                      {isEditing ? (
                        <input
                          value={newSlug}
                          onChange={e => setNewSlug(e.target.value)}
                          style={{ padding: '5px 8px', border: '1.5px solid #009944', borderRadius: 5, fontSize: 13, outline: 'none', width: '100%' }}
                          autoFocus
                          onKeyDown={e => { if (e.key === 'Enter') handleSaveSlug(item); if (e.key === 'Escape') setEditItem(null); }}
                        />
                      ) : (
                        <code style={{ background: '#f0f2f5', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{slug || '(chưa có)'}</code>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: '#009944' }}>
                      {urlPrefix}/{isEditing ? newSlug || '...' : slug}
                    </td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {isEditing ? (
                        <>
                          <button onClick={() => handleSaveSlug(item)} className="abtn abtn-primary abtn-sm" disabled={loading}>
                            {loading ? '...' : '✓ Lưu'}
                          </button>
                          <button onClick={() => setEditItem(null)} className="abtn abtn-outline abtn-sm">Hủy</button>
                        </>
                      ) : (
                        <button onClick={() => handleEditSlug(item)} className="abtn abtn-edit abtn-sm">✏️ Sửa Slug</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
