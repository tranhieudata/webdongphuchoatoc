'use client';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}
function authHeaderJSON() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

const EMPTY = { name: '', slug: '', price: '', description: '', status: 'active', categoryId: '', metaTitle: '', metaDescription: '', excerpt: '', tags: '' };

// Tự sinh slug từ tên tiếng Việt
function generateSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function seoScore(form, hasImg) {
  let score = 0;
  const metaTitle = form.metaTitle || form.name || '';
  const meta = form.metaDescription || '';
  const slug = form.slug || '';
  const tags = form.tags || '';
  if (metaTitle.length >= 30 && metaTitle.length <= 70) score += 25;
  else if (metaTitle.length > 0) score += 10;
  if (meta.length >= 120 && meta.length <= 160) score += 30;
  else if (meta.length > 0) score += 15;
  if (slug.length > 0) score += 20;
  if (tags.trim().length > 0) score += 15;
  if (hasImg) score += 10;
  return score;
}

function SeoBar({ score }) {
  const color = score >= 80 ? '#009944' : score >= 50 ? '#f97316' : '#e74c3c';
  const label = score >= 80 ? 'Tốt' : score >= 50 ? 'Trung bình' : 'Yếu';
  return (
    <div style={{ margin: '12px 0 4px', padding: '12px 14px', background: '#f8f9fa', borderRadius: 6, border: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>🔍 Điểm SEO</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}/100 – {label}</span>
      </div>
      <div style={{ height: 6, background: '#e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 3, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const load = useCallback(() => {
    fetch(`${API}/api/product/allproduct?page=${page}&limit=10`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => {
        setProducts(d.products || d || []);
        setTotalPages(d.totalPages || 1);
      })
      .catch(() => {});
  }, [page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fetch(`${API}/api/category/all`, { headers: authHeader() })
      .then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal('add'); setAlert(''); setImageFiles([]); setExistingImages([]); };
  const openEdit = (p) => {
    setForm({
      name: p.name || '', slug: p.slug || '', price: p.price || '',
      description: p.description || '', status: p.status || 'active', categoryId: p.categoryId || '',
      metaTitle: p.metaTitle || '', metaDescription: p.metaDescription || '',
      excerpt: p.excerpt || '', tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
    });
    setEditId(p._id);
    setModal('edit');
    setAlert('');
    setImageFiles([]);
    setExistingImages(Array.isArray(p.images) ? p.images : []);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setAlert('error:Vui lòng nhập tên sản phẩm'); return; }
    if (!form.price || Number(form.price) <= 0) { setAlert('error:Vui lòng nhập giá sản phẩm hợp lệ'); return; }
    if (modal === 'add' && imageFiles.length === 0) { setAlert('error:Vui lòng chọn ít nhất 1 ảnh sản phẩm'); return; }
    setLoading(true);
    try {
      const url = modal === 'add' ? `${API}/api/product/create` : `${API}/api/product/${editId}/edit`;
      const method = modal === 'add' ? 'POST' : 'PUT';

      if (imageFiles.length > 0) {
        // multipart/form-data khi có ảnh mới
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('slug', form.slug);
        fd.append('price', form.price);
        fd.append('description', form.description);
        fd.append('status', form.status);
        fd.append('metaTitle', form.metaTitle || form.name);
        fd.append('metaDescription', form.metaDescription || '');
        fd.append('excerpt', form.excerpt || '');
        fd.append('tags', form.tags || '');
        if (form.categoryId) fd.append('categoryIds', form.categoryId);
        imageFiles.forEach(f => fd.append('images', f));
        const res = await fetch(url, { method, headers: authHeader(), body: fd });
        if (res.ok) {
          setAlert('success:' + (modal === 'add' ? 'Thêm thành công!' : 'Cập nhật thành công!'));
          setModal(null); load();
        } else {
          const d = await res.json();
          setAlert('error:' + (d.message || 'Lỗi xảy ra'));
        }
      } else {
        const res = await fetch(url, { method, headers: authHeaderJSON(), body: JSON.stringify(form) });
        if (res.ok) {
          setAlert('success:' + (modal === 'add' ? 'Thêm thành công!' : 'Cập nhật thành công!'));
          setModal(null); load();
        } else {
          const d = await res.json();
          setAlert('error:' + (d.message || 'Lỗi xảy ra'));
        }
      }
    } catch { setAlert('error:Không thể kết nối server'); }
    setLoading(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return;
    const res = await fetch(`${API}/api/product/${id}/delete`, { method: 'DELETE', headers: authHeader() });
    if (res.ok) { setAlert('success:Đã xóa thành công'); load(); }
    else setAlert('error:Xóa thất bại');
  };

  const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.slug?.toLowerCase().includes(search.toLowerCase()));

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
              <input placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <button onClick={openAdd} className="abtn abtn-primary">+ Thêm Sản Phẩm</button>
        </div>

        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Sản Phẩm</th>
                <th>Slug</th>
                <th>Giá</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="admin-empty"><span>📦</span><p>Không có sản phẩm nào</p></div></td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p._id}>
                  <td>{(page - 1) * 10 + i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td><code style={{ background: '#f0f2f5', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{p.slug}</code></td>
                  <td>{p.price ? Number(p.price).toLocaleString('vi-VN') + 'đ' : '—'}</td>
                  <td>
                    <span className={`abadge ${p.status === 'active' ? 'abadge-green' : 'abadge-gray'}`}>
                      {p.status === 'active' ? 'Hoạt Động' : 'Ẩn'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} className="abtn abtn-edit abtn-sm">✏️ Sửa</button>
                    <button onClick={() => handleDelete(p._id, p.name)} className="abtn abtn-danger abtn-sm">🗑️ Xóa</button>
                  </td>
                </tr>
              ))}
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

      {/* Modal */}
      {modal && (
        <div className="admin-modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{modal === 'add' ? '➕ Thêm Sản Phẩm' : '✏️ Sửa Sản Phẩm'}</h3>
              <button className="admin-modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="aform-row">
                <div className="aform-group">
                  <label>Tên Sản Phẩm *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => {
                      const name = e.target.value;
                      setForm(prev => ({
                        ...prev,
                        name,
                        // Chỉ tự sinh slug khi thêm mới, hoặc slug chưa bị sửa tay
                        slug: modal === 'add' ? generateSlug(name) : prev.slug,
                      }));
                    }}
                    placeholder="Áo Polo Nam..."
                  />
                </div>
                <div className="aform-group">
                  <label>Slug <span style={{ fontSize: 11, color: '#999', fontWeight: 400 }}>(tự sinh, có thể sửa)</span></label>
                  <input
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    placeholder="ao-polo-nam"
                    style={{ fontFamily: 'monospace', fontSize: 13 }}
                  />
                </div>
              </div>
              <div className="aform-row">
                <div className="aform-group">
                  <label>Giá (VNĐ)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="85000" />
                </div>
                <div className="aform-group">
                  <label>Trạng Thái</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Hoạt Động</option>
                    <option value="inactive">Ẩn</option>
                  </select>
                </div>
              </div>
              <div className="aform-group">
                <label>Danh Mục</label>
                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="aform-group">
                <label>Mô Tả</label>
                <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả sản phẩm chi tiết..." />
              </div>

              {/* SEO Section */}
              <div style={{ borderTop: '2px solid #e0e0e0', paddingTop: 16, marginTop: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a2332', marginBottom: 12 }}>🔍 SEO & Metadata</div>

                <SeoBar score={seoScore(form, imageFiles.length > 0 || existingImages.length > 0)} />

                <div className="aform-group" style={{ marginTop: 12 }}>
                  <label>
                    Meta Title
                    <span style={{ fontSize: 11, color: form.metaTitle.length > 70 ? '#e74c3c' : form.metaTitle.length >= 30 ? '#009944' : '#999', marginLeft: 8 }}>
                      {form.metaTitle.length}/70 ký tự {form.metaTitle.length >= 30 && form.metaTitle.length <= 70 ? '✓' : '(tốt nhất: 30–70)'}
                    </span>
                  </label>
                  <input
                    value={form.metaTitle}
                    onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                    placeholder={form.name || 'Tiêu đề SEO (mặc định lấy tên sản phẩm)'}
                    maxLength={70}
                  />
                </div>

                <div className="aform-group">
                  <label>
                    Meta Description
                    <span style={{ fontSize: 11, color: form.metaDescription.length > 160 ? '#e74c3c' : form.metaDescription.length >= 120 ? '#009944' : '#999', marginLeft: 8 }}>
                      {form.metaDescription.length}/160 ký tự {form.metaDescription.length >= 120 && form.metaDescription.length <= 160 ? '✓' : '(tốt nhất: 120–160)'}
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.metaDescription}
                    onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                    placeholder="Mô tả ngắn hiển thị trên Google (120–160 ký tự)..."
                    maxLength={160}
                  />
                </div>

                <div className="aform-group">
                  <label>Excerpt <span style={{ fontSize: 11, color: '#999', fontWeight: 400 }}>(tóm tắt ngắn hiển thị ngoài trang)</span></label>
                  <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Tóm tắt sản phẩm..."
                    maxLength={300}
                  />
                </div>

                <div className="aform-group">
                  <label>Tags SEO <span style={{ fontSize: 11, color: '#999', fontWeight: 400 }}>(phân cách bằng dấu phẩy)</span></label>
                  <input
                    value={form.tags}
                    onChange={e => setForm({ ...form, tags: e.target.value })}
                    placeholder="áo polo, đồng phục công ty, áo thun..."
                  />
                  {form.tags && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {form.tags.split(',').filter(t => t.trim()).map((t, i) => (
                        <span key={i} style={{ padding: '2px 10px', background: '#e8f5ee', color: '#009944', borderRadius: 99, fontSize: 12, fontWeight: 500 }}>{t.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview Google */}
                {(form.metaTitle || form.name) && (
                  <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6, padding: 14, marginTop: 4 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 6, fontWeight: 600 }}>👁 Preview Google</div>
                    <div style={{ fontSize: 17, color: '#1a0dab', marginBottom: 2, lineHeight: 1.3 }}>{form.metaTitle || form.name || 'Tiêu đề sản phẩm'}</div>
                    <div style={{ fontSize: 13, color: '#006621', marginBottom: 4 }}>dongphuchoatoc.vn/san-pham/{form.slug || 'ten-san-pham'}</div>
                    <div style={{ fontSize: 13, color: '#545454', lineHeight: 1.5 }}>{form.metaDescription || 'Nhập meta description để hiển thị mô tả trên Google...'}</div>
                  </div>
                )}
              </div>
              {/* Ảnh sản phẩm */}
              <div className="aform-group">
                <label>Hình Ảnh Sản Phẩm {modal === 'add' ? '*' : ''}</label>
                <label htmlFor="product-images" style={{ display: 'block', padding: '12px', border: '2px dashed #009944', borderRadius: 6, background: 'rgba(0,153,68,0.04)', color: '#009944', fontWeight: 500, textAlign: 'center', cursor: 'pointer' }}>
                  📁 {imageFiles.length > 0 ? `Đã chọn ${imageFiles.length} ảnh` : 'Chọn ảnh sản phẩm'}
                </label>
                <input
                  id="product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => setImageFiles(Array.from(e.target.files))}
                />
                {/* Preview ảnh mới */}
                {imageFiles.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                    {imageFiles.map((file, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={URL.createObjectURL(file)} alt={`new-${i}`} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '1px solid #e0e0e0' }} />
                        <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Ảnh hiện có (khi edit) */}
                {modal === 'edit' && existingImages.length > 0 && (
                  <div>
                    <p style={{ fontSize: 13, color: '#666', margin: '8px 0 4px' }}>Ảnh hiện có:</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {existingImages.map((img, i) => (
                        <img key={i} src={`${API}${img}`} alt={`img-${i}`} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '1px solid #e0e0e0' }} />
                      ))}
                    </div>
                  </div>
                )}
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
