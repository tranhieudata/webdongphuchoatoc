'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL
function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function AdminSizeChartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'published', order: 0 });
  const [files, setFiles] = useState([]);
  const [keepImages, setKeepImages] = useState(true);
  const [alert, setAlert] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/size-chart/all?limit=100`, { headers: authHeader() });
      const d = await res.json();
      setItems(d.items || []);
    } catch { setAlert('error:Không thể tải dữ liệu'); }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', status: 'published', order: 0 });
    setFiles([]);
    setKeepImages(true);
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description || '', status: item.status, order: item.order || 0 });
    setFiles([]);
    setKeepImages(true);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('status', form.status);
    fd.append('order', form.order);
    if (editing) fd.append('keepImages', keepImages ? 'true' : 'false');
    files.forEach(f => fd.append('images', f));

    const url = editing ? `${API}/api/size-chart/${editing._id}` : `${API}/api/size-chart/create`;
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: authHeader(), body: fd });
      if (res.ok) {
        setAlert('success:Lưu thành công!');
        setModal(false);
        fetchItems();
      } else {
        const d = await res.json();
        setAlert('error:' + (d.message || 'Lỗi server'));
      }
    } catch { setAlert('error:Không thể kết nối server'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa bảng size này?')) return;
    await fetch(`${API}/api/size-chart/${id}`, { method: 'DELETE', headers: authHeader() });
    setAlert('success:Đã xóa!');
    fetchItems();
  };

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
          <h3 style={{ margin: 0 }}>Danh Sách Bảng Size</h3>
          <button onClick={openAdd} className="abtn abtn-primary">+ Thêm Bảng Size</button>
        </div>
        <div className="admin-card-body">
          {loading ? <div className="admin-empty"><p>Đang tải...</p></div> : (
            <table className="admin-table">
              <thead><tr><th>#</th><th>Tiêu Đề</th><th>Ảnh</th><th>Trạng Thái</th><th>Thứ Tự</th><th>Thao Tác</th></tr></thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={6}><div className="admin-empty"><span>📐</span><p>Chưa có bảng size</p></div></td></tr>
                ) : items.map((item, i) => (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td>
                      {item.images?.length > 0 ? (
                        <img src={`${API}${item.images[0]}`} alt="" style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 4 }} />
                      ) : <span style={{ color: '#ccc' }}>—</span>}
                      <span style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>{item.images?.length || 0} ảnh</span>
                    </td>
                    <td><span className={`abadge ${item.status === 'published' ? 'abadge-success' : 'abadge-warning'}`}>{item.status === 'published' ? 'Hiển thị' : 'Nháp'}</span></td>
                    <td>{item.order}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(item)} className="abtn abtn-edit abtn-sm">✏️ Sửa</button>
                      <button onClick={() => handleDelete(item._id)} className="abtn abtn-danger abtn-sm">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="admin-modal-backdrop" onClick={() => setModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{editing ? 'Sửa Bảng Size' : 'Thêm Bảng Size'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="aform-group">
                <label>Tiêu Đề *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Bảng Size Áo Polo Nam..." />
              </div>
              <div className="aform-group">
                <label>Mô Tả</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả bảng size..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div className="aform-row">
                <div className="aform-group">
                  <label>Trạng Thái</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="published">Hiển Thị</option>
                    <option value="draft">Nháp</option>
                  </select>
                </div>
                <div className="aform-group">
                  <label>Thứ Tự</label>
                  <input type="number" min={0} value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
                </div>
              </div>
              <div className="aform-group">
                <label>Ảnh Bảng Size (chọn nhiều)</label>
                <input type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files))} />
                {files.length > 0 && <small style={{ color: '#009944' }}>Đã chọn {files.length} ảnh</small>}
                {editing && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={keepImages} onChange={e => setKeepImages(e.target.checked)} />
                    Giữ lại ảnh cũ
                  </label>
                )}
                {editing && editing.images?.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {editing.images.map((img, i) => (
                      <img key={i} src={`${API}${img}`} alt="" style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setModal(false)} className="abtn abtn-outline">Hủy</button>
                <button type="submit" className="abtn abtn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
