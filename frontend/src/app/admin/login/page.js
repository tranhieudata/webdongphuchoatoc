'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../../styles/admin.css';

const API = process.env.NEXT_PUBLIC_API_URL
export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Đăng nhập thất bại');
      } else {
        localStorage.setItem('admin_token', data.token);
        router.replace('/admin/dashboard');
      }
    } catch {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span className="all-main">Hỏa Tốc</span>
          <span className="all-sub">ADMIN PANEL</span>
        </div>
        <h1>Đăng Nhập Quản Trị</h1>
        {error && <div className="admin-alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="aform-group">
            <label>Tên Đăng Nhập</label>
            <input
              type="text"
              required
              placeholder="admin"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
            />
          </div>
          <div className="aform-group">
            <label>Mật Khẩu</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
        <a href="/" className="admin-back-home">← Về Trang Chủ</a>
      </div>
    </div>
  );
}
