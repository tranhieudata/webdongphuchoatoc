'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
function authHeader() {
  const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function handleAuthError(res) {
  if (res.status === 401) {
    const data = await res.json();
    if (data.code === 'TOKEN_EXPIRED') {
      // Token expired - redirect to login
      localStorage.removeItem('admin_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      return true;
    }
  }
  return false;
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block'],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'indent',
  'blockquote', 'code-block',
  'align', 'link', 'image',
];

function toSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function seoScore(title, meta, slug, tags, hasImg) {
  let score = 0;
  if (title.length >= 30 && title.length <= 60) score += 20;
  else if (title.length > 0) score += 10;
  if (meta.length >= 120 && meta.length <= 160) score += 25;
  else if (meta.length > 0) score += 12;
  if (slug.length > 0) score += 20;
  if (tags.length > 0) score += 20;
  if (hasImg) score += 15;
  return score;
}

export default function NewsEditor({ editId }) {
  const router = useRouter();
  const imgRef = useRef();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', msg }
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState(editId || null);

  // Load post if editing
  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    fetch(`${API}/api/news/by-id/${editId}`, { headers: authHeader() })
      .then(async r => {
        if (await handleAuthError(r)) return;
        return r.json();
      })
      .then(d => {
        if (!d) return;
        const p = d.post || d;
        console.log('Loaded post:', p);
        setTitle(p.title || '');
        setSlug(p.slug || '');
        setSlugManual(!!p.slug);
        setContent(p.content || '');
        setExcerpt(p.excerpt || p.metaDescription || '');
        setMetaDescription(p.metaDescription || '');
        setStatus(p.status || 'draft');
        setTags(Array.isArray(p.tags) ? p.tags : []);
        if (p.featuredImage) setFeaturedImagePreview(`${API}${p.featuredImage}`);
        setAlert(null);
      })
      .catch(err => {
        console.error('Load error:', err);
        setAlert({ type: 'error', msg: 'Không tải được bài viết' });
      })
      .finally(() => setLoading(false));
  }, [editId]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && title) setSlug(toSlug(title));
  }, [title, slugManual]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFeaturedImage(file);
    setFeaturedImagePreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/,/g, '');
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (t) => setTags(prev => prev.filter(x => x !== t));

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && !tagInput && tags.length) setTags(prev => prev.slice(0, -1));
  };

  const doSave = async (saveStatus) => {
    if (!title.trim()) { setAlert({ type: 'error', msg: 'Vui lòng nhập tiêu đề' }); return; }
    const rawContent = content.replace(/<(.|\n)*?>/g, '').trim();
    if (!rawContent) { setAlert({ type: 'error', msg: 'Vui lòng nhập nội dung' }); return; }

    setSaving(true);
    setAlert(null);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('content', content);
      fd.append('metaDescription', metaDescription);
      fd.append('excerpt', excerpt);
      fd.append('tags', JSON.stringify(tags));
      fd.append('status', saveStatus);
      if (slug) fd.append('slug', slug);
      if (featuredImage) fd.append('featuredImage', featuredImage);

      const currentId = savedId || editId;
      const url = currentId ? `${API}/api/news/${currentId}` : `${API}/api/news`;
      const method = currentId ? 'PUT' : 'POST';

      console.log(`Saving post (${method}):`, { title, hasContent: !!content, slug, status: saveStatus });
      const res = await fetch(url, { method, headers: authHeader(), body: fd });
      
      if (await handleAuthError(res)) return;
      
      const data = await res.json();
      
      if (res.ok) {
        console.log('Save success, response:', data);
        if (!currentId && data._id) setSavedId(data._id);
        setStatus(saveStatus);
        if (data.slug) setSlug(data.slug);
        setAlert({ type: 'success', msg: saveStatus === 'published' ? '✓ Đã đăng bài!' : '✓ Đã lưu nháp!' });
      } else {
        console.error('Save failed, response:', data);
        setAlert({ type: 'error', msg: data.message || 'Lỗi server' });
      }
    } catch (err) {
      console.error('Save error:', err);
      setAlert({ type: 'error', msg: 'Không kết nối được server' });
    }
    setSaving(false);
  };

  const score = seoScore(title, metaDescription, slug, tags, !!featuredImagePreview);
  const scoreColor = score >= 70 ? '#009944' : score >= 40 ? '#f59e0b' : '#ef4444';

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Đang tải...</div>;

  return (
    <div className="nwe-page">
      {/* ---- Top bar ---- */}
      <div className="nwe-topbar">
        <Link href="/admin/news" className="nwe-back">← Bài Viết</Link>
        <span className="nwe-topbar-title">{editId ? 'Sửa Bài Viết' : 'Viết Bài Mới'}</span>
        <div className="nwe-topbar-actions">
          {alert && (
            <span className={`nwe-alert ${alert.type}`}>{alert.msg}</span>
          )}
          <button onClick={() => doSave('draft')} disabled={saving} className="nwe-btn-draft">
            {saving ? '...' : 'Lưu Nháp'}
          </button>
          {slug && (
            <a href={`/tin-tuc/${slug}`} target="_blank" rel="noopener noreferrer" className="nwe-btn-preview">
              Xem Trước ↗
            </a>
          )}
          <button onClick={() => doSave('published')} disabled={saving} className="nwe-btn-publish">
            {saving ? 'Đang lưu...' : status === 'published' ? 'Cập Nhật' : 'Đăng Bài'}
          </button>
        </div>
      </div>

      {/* ---- Main layout ---- */}
      <div className="nwe-layout">

        {/* Left: editor */}
        <div className="nwe-main">
          <input
            className="nwe-title-input"
            placeholder="Tiêu đề bài viết..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <div className="nwe-editor-box">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={QUILL_MODULES}
              formats={QUILL_FORMATS}
              placeholder="Bắt đầu viết nội dung bài viết tại đây..."
            />
          </div>

          <div className="nwe-section">
            <div className="nwe-section-head">Tóm Tắt (Excerpt)</div>
            <textarea
              className="nwe-textarea"
              rows={3}
              placeholder="Mô tả ngắn hiển thị trong danh sách bài — để trống sẽ lấy từ Meta Description..."
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
            />
          </div>
        </div>

        {/* Right: sidebar panels */}
        <aside className="nwe-sidebar">

          {/* --- Publish panel --- */}
          <div className="nwe-panel">
            <div className="nwe-panel-head">📋 Đăng Bài</div>
            <div className="nwe-panel-body">
              <div className="nwe-field">
                <label>Trạng Thái</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="draft">📝 Bản Nháp</option>
                  <option value="published">✅ Đã Đăng</option>
                  <option value="archived">📦 Lưu Trữ</option>
                </select>
              </div>
              <div className="nwe-panel-btns">
                <button onClick={() => doSave('draft')} disabled={saving} className="nwe-btn-draft">
                  Lưu Nháp
                </button>
                <button onClick={() => doSave('published')} disabled={saving} className="nwe-btn-publish">
                  {status === 'published' ? 'Cập Nhật' : 'Đăng Ngay'}
                </button>
              </div>
            </div>
          </div>

          {/* --- Featured image --- */}
          <div className="nwe-panel">
            <div className="nwe-panel-head">🖼️ Ảnh Đại Diện</div>
            <div className="nwe-panel-body">
              {featuredImagePreview ? (
                <div className="nwe-img-preview-wrap">
                  <img src={featuredImagePreview} alt="featured" className="nwe-img-preview" />
                  <button
                    className="nwe-img-remove"
                    onClick={() => { setFeaturedImage(null); setFeaturedImagePreview(''); }}
                  >
                    × Xóa ảnh
                  </button>
                </div>
              ) : (
                <button className="nwe-img-upload-btn" onClick={() => imgRef.current?.click()}>
                  + Đặt Ảnh Đại Diện
                </button>
              )}
              <input
                ref={imgRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* --- SEO panel --- */}
          <div className="nwe-panel">
            <div className="nwe-panel-head">
              🔍 SEO
              <span className="nwe-seo-badge" style={{ background: scoreColor }}>{score}%</span>
            </div>
            <div className="nwe-panel-body">

              <div className="nwe-field">
                <label>Đường Dẫn (Slug)</label>
                <div className="nwe-slug-row">
                  <span className="nwe-slug-prefix">/tin-tuc/</span>
                  <input
                    value={slug}
                    onChange={e => { setSlug(e.target.value); setSlugManual(true); }}
                    placeholder="duong-dan-bai-viet"
                  />
                </div>
                {!slugManual && title && (
                  <div className="nwe-field-hint">Auto từ tiêu đề — click để sửa</div>
                )}
              </div>

              <div className="nwe-field">
                <label>
                  Meta Description
                  <span className={`nwe-meta-count ${metaDescription.length > 160 ? 'over' : metaDescription.length >= 120 ? 'ok' : ''}`}>
                    {metaDescription.length}/160
                  </span>
                </label>
                <textarea
                  rows={3}
                  className="nwe-textarea"
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  placeholder="Mô tả hiển thị trên Google (tối ưu 120–160 ký tự)..."
                  maxLength={200}
                />
              </div>

              {/* Google SERP preview */}
              <div className="nwe-google-preview">
                <div className="nwe-gp-label">Xem Trước Google</div>
                <div className="nwe-gp-box">
                  <div className="nwe-gp-url">
                    dongphuchoatoc.vn › tin-tuc › {slug || 'duong-dan'}
                  </div>
                  <div className="nwe-gp-title">
                    {title ? (title.length > 60 ? title.slice(0, 57) + '...' : title) : 'Tiêu đề bài viết'}
                  </div>
                  <div className="nwe-gp-desc">
                    {metaDescription
                      ? (metaDescription.length > 160 ? metaDescription.slice(0, 157) + '...' : metaDescription)
                      : 'Mô tả bài viết hiển thị trên kết quả tìm kiếm Google...'}
                  </div>
                </div>
              </div>

              {/* SEO checklist */}
              <div className="nwe-seo-list">
                <SeoCheck
                  ok={title.length >= 30 && title.length <= 60}
                  warn={title.length > 0 && !(title.length >= 30 && title.length <= 60)}
                  label={`Tiêu đề 30–60 ký tự (${title.length})`}
                />
                <SeoCheck
                  ok={metaDescription.length >= 120 && metaDescription.length <= 160}
                  warn={metaDescription.length > 0 && !(metaDescription.length >= 120 && metaDescription.length <= 160)}
                  label={`Meta desc 120–160 ký tự (${metaDescription.length})`}
                />
                <SeoCheck ok={slug.length > 0} label="Có đường dẫn (slug)" />
                <SeoCheck ok={tags.length > 0} label="Có thẻ tag" />
                <SeoCheck ok={!!featuredImagePreview} label="Có ảnh đại diện" />
              </div>
            </div>
          </div>

          {/* --- Tags panel --- */}
          <div className="nwe-panel">
            <div className="nwe-panel-head">🏷️ Thẻ (Tags)</div>
            <div className="nwe-panel-body">
              <div className="nwe-tags-box">
                {tags.map(t => (
                  <span key={t} className="nwe-tag-chip">
                    {t}
                    <button type="button" onClick={() => removeTag(t)}>×</button>
                  </span>
                ))}
                <input
                  className="nwe-tag-input"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? 'Thêm tag, Enter để xác nhận...' : ''}
                />
              </div>
              <div className="nwe-field-hint">Nhấn Enter hoặc dấu phẩy để thêm tag</div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

function SeoCheck({ ok, warn, label }) {
  const cls = ok ? 'nwe-seo-check ok' : warn ? 'nwe-seo-check warn' : 'nwe-seo-check';
  const icon = ok ? '✓' : warn ? '!' : '○';
  return <div className={cls}><span>{icon}</span>{label}</div>;
}
