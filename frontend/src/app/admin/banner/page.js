'use client';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

const EMPTY = { title: '', subtitle: '', desc: '', cta: 'Xem Thêm', href: '#', bg: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)', accent: '#fff', status: 'active', order: 0, imageFile: null };

export default function AdminBannerPage() {
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const load = useCallback(() => {
    fetch(`${API}/api/banner/`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => setBanners(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setImagePreview(null);
    setModal('add');
    setAlert('');
  };

  const openEdit = (b) => {
    setForm({
      title: b.title || '',
      subtitle: b.subtitle || '',
      desc: b.desc || '',
      cta: b.cta || 'Xem Thêm',
      href: b.href || '#',
      bg: b.bg || 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
      accent: b.accent || '#fff',
      status: b.status || 'active',
      order: b.order || 0,
      imageFile: null
    });
    setEditId(b._id);
    setImagePreview(b.imageUrl ? `${API}${b.imageUrl}` : null);
    setModal('edit');
    setAlert('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageFile: file });
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setAlert('error:Tiêu đề là bắt buộc'); return; }
    if (modal === 'add' && !form.imageFile) { setAlert('error:Vui lòng chọn ảnh'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('subtitle', form.subtitle || '');
      formData.append('desc', form.desc || '');
      formData.append('cta', form.cta || 'Xem Thêm');
      formData.append('href', form.href || '#');
      formData.append('bg', form.bg || 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)');
      formData.append('accent', form.accent || '#fff');
      formData.append('status', form.status);
      formData.append('order', form.order || 0);
      if (form.imageFile) formData.append('image', form.imageFile);

      const url = modal === 'add' ? `${API}/api/banner/` : `${API}/api/banner/${editId}`;
      const method = modal === 'add' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: authHeader(),
        body: formData
      });

      if (res.ok) {
        setAlert('success:' + (modal === 'add' ? 'Thêm thành công!' : 'Cập nhật thành công!'));
        setModal(null);
        load();
      } else {
        const d = await res.json();
        setAlert('error:' + (d.message || 'Lỗi xảy ra'));
      }
    } catch (e) {
      setAlert('error:Không thể kết nối server');
    }
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Xóa banner "${title}"?`)) return;
    const res = await fetch(`${API}/api/banner/${id}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    if (res.ok) { setAlert('success:Đã xóa thành công'); load(); }
    else setAlert('error:Xóa thất bại');
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const res = await fetch(`${API}/api/banner/${id}/status`, {
      method: 'PATCH',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) { setAlert('success:Cập nhật thành công'); load(); }
    else setAlert('error:Cập nhật thất bại');
  };

  const filtered = banners.filter(b =>
    !search || b.title?.toLowerCase().includes(search.toLowerCase())
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>Quản Lý Banner Hero</h2>
          <button onClick={openAdd} className="btn btn-primary" style={{ padding: '8px 16px' }}>+ Thêm Mới</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Tìm kiếm banner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', background: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Tiêu Đề</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Ảnh</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Phụ Đề</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>CTA</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Trạng Thái</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</td>
                  <td style={{ padding: '12px' }}>
                    {b.imageUrl && (
                      <img
                        src={`${API}${b.imageUrl}`}
                        alt={b.title}
                        style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.subtitle || '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>
                    {b.cta || '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleStatusToggle(b._id, b.status)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: b.status === 'active' ? '#4caf50' : '#f44336',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {b.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                    </button>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => openEdit(b)}
                      style={{
                        padding: '4px 10px',
                        marginRight: '4px',
                        background: '#2196F3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(b._id, b.title)}
                      style={{
                        padding: '4px 10px',
                        background: '#f44336',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              Không có banner nào
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0 }}>
              {modal === 'add' ? 'Thêm Banner' : 'Sửa Banner'}
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Tiêu Đề
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Phụ đề (Subtitle)
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Mô tả (Description)
              </label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows="3"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                CTA Text (Button)
              </label>
              <input
                type="text"
                value={form.cta}
                onChange={(e) => setForm({ ...form, cta: e.target.value })}
                placeholder="Xem Thêm"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Link
              </label>
              <input
                type="text"
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
                placeholder="/san-pham"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Background Gradient
              </label>
              <input
                type="text"
                value={form.bg}
                onChange={(e) => setForm({ ...form, bg: e.target.value })}
                placeholder="linear-gradient(135deg, ...)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Accent Color
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="color"
                  value={form.accent}
                  onChange={(e) => setForm({ ...form, accent: e.target.value })}
                  style={{
                    width: '50px',
                    height: '40px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={form.accent}
                  onChange={(e) => setForm({ ...form, accent: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Ảnh
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{
                    marginTop: '12px',
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '4px'
                  }}
                />
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Trạng Thái
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ẩn</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModal(null)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  background: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary"
                style={{
                  padding: '8px 16px',
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
