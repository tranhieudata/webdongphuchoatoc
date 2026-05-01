'use client';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL
function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

const EMPTY = { name: '', slug: '', description: '' };

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    fetch(`${API}/api/category/all`, { headers: authHeader() })
      .then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal('add'); setAlert(''); };
  const openEdit = (c) => {
    setForm({ name: c.name || '', slug: c.slug || '', description: c.description || '' });
    setEditId(c._id);
    setModal('edit');
    setAlert('');
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) { setAlert('error:Tên và slug là bắt buộc'); return; }
    setLoading(true);
    try {
      const url = modal === 'add' ? `${API}/api/category/create` : `${API}/api/category/${editId}/edit`;
      const method = modal === 'add' ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(form) });
      if (res.ok) {
        setAlert('success:' + (modal === 'add' ? 'Thêm thành công!' : 'Cập nhật thành công!'));
        setModal(null);
        load();
      } else {
        const d = await res.json();
        setAlert('error:' + (d.message || 'Lỗi xảy ra'));
      }
    } catch { setAlert('error:Không thể kết nối server'); }
    setLoading(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa danh mục "${name}"?\nCác sản phẩm trong danh mục này sẽ không bị xóa.`)) return;
    const res = await fetch(`${API}/api/category/${id}/delete`, { method: 'DELETE', headers: authHeader() });
    if (res.ok) { setAlert('success:Đã xóa thành công'); load(); }
    else setAlert('error:Xóa thất bại');
  };

  const autoSlug = (name) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

  const filtered = categories.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.slug?.toLowerCase().includes(search.toLowerCase()));

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
              <input placeholder="Tìm danh mục..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <button onClick={openAdd} className="abtn abtn-primary">+ Thêm Danh Mục</button>
        </div>

        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Danh Mục</th>
                <th>Slug</th>
                <th>Mô Tả</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="admin-empty"><span>🗂️</span><p>Không có danh mục nào</p></div></td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td><code style={{ background: '#f0f2f5', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{c.slug}</code></td>
                  <td style={{ color: '#888', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description || '—'}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(c)} className="abtn abtn-edit abtn-sm">✏️ Sửa</button>
                    <button onClick={() => handleDelete(c._id, c.name)} className="abtn abtn-danger abtn-sm">🗑️ Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="admin-modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{modal === 'add' ? '➕ Thêm Danh Mục' : '✏️ Sửa Danh Mục'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              {alert && <div className={alert.startsWith('success') ? 'admin-alert-success' : 'admin-alert-error'}>{alert.split(':').slice(1).join(':')}</div>}
              <div className="aform-group">
                <label>Tên Danh Mục *</label>
                <input required value={form.name} onChange={e => {
                  const name = e.target.value;
                  setForm({ ...form, name, slug: modal === 'add' ? autoSlug(name) : form.slug });
                }} placeholder="Áo Polo" />
              </div>
              <div className="aform-group">
                <label>Slug *</label>
                <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="ao-polo" />
                <small style={{ color: '#888', fontSize: 11 }}>Slug được tự động tạo từ tên. Có thể chỉnh sửa.</small>
              </div>
              <div className="aform-group">
                <label>Mô Tả</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả danh mục..." />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setModal(null)} className="abtn abtn-outline">Hủy</button>
              <button onClick={handleSave} className="abtn abtn-primary" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
