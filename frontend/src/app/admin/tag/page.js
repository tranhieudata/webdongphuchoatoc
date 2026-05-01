'use client';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

const EMPTY = { name: '' };

export default function AdminTagPage() {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    fetch(`${API}/api/tag/all`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => setTags(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal('add'); setAlert(''); };
  const openEdit = (t) => {
    setForm({ name: t.name || '' });
    setEditId(t._id);
    setModal('edit');
    setAlert('');
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setAlert('error:Tên thẻ là bắt buộc'); return; }
    setLoading(true);
    try {
      const url = modal === 'add' ? `${API}/api/tag/create` : `${API}/api/tag/${editId}/edit`;
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
    if (!confirm(`Xóa thẻ tag "${name}"?`)) return;
    const res = await fetch(`${API}/api/tag/${id}/delete`, { method: 'DELETE', headers: authHeader() });
    if (res.ok) { setAlert('success:Đã xóa thành công'); load(); }
    else setAlert('error:Xóa thất bại');
  };

  const filtered = tags.filter(t =>
    !search ||
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.slug?.toLowerCase().includes(search.toLowerCase())
  );

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
              <input placeholder="Tìm thẻ tag..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <button onClick={openAdd} className="abtn abtn-primary">+ Thêm Thẻ Tag</button>
        </div>

        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Thẻ Tag</th>
                <th>Slug</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="admin-empty"><span>🏷️</span><p>Không có thẻ tag nào</p></div></td></tr>
              ) : filtered.map((t, i) => (
                <tr key={t._id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', background: '#e8f5ee', color: '#009944', borderRadius: 99, fontSize: 13 }}>
                      {t.name}
                    </span>
                  </td>
                  <td><code style={{ background: '#f0f2f5', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{t.slug}</code></td>
                  <td style={{ color: '#888', fontSize: 13 }}>
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(t)} className="abtn abtn-edit abtn-sm">✏️ Sửa</button>
                    <button onClick={() => handleDelete(t._id, t.name)} className="abtn abtn-danger abtn-sm">🗑️ Xóa</button>
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
              <h3>{modal === 'add' ? '➕ Thêm Thẻ Tag' : '✏️ Sửa Thẻ Tag'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              {alert && (
                <div className={alert.startsWith('success') ? 'admin-alert-success' : 'admin-alert-error'}>
                  {alert.split(':').slice(1).join(':')}
                </div>
              )}
              <div className="aform-group">
                <label>Tên Thẻ Tag *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ví dụ: Áo Polo, Đồng phục học sinh..."
                  autoFocus
                />
                <small style={{ color: '#888', fontSize: 11 }}>Slug sẽ được tự động tạo từ tên khi lưu.</small>
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
