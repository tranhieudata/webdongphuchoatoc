'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menu = [
  { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: '🎬', label: 'Banner Hero', href: '/admin/banner' },
  { icon: '👕', label: 'Sản Phẩm', href: '/admin/product' },
  { icon: '📰', label: 'Bài Viết', href: '/admin/news' },
  { icon: '🗂️', label: 'Danh Mục', href: '/admin/category' },
  { icon: '🏷️', label: 'Thẻ Tag', href: '/admin/tag' },
  { icon: '🧵', label: 'Mẫu Vải', href: '/admin/fabric' },
  { icon: '📐', label: 'Bảng Size', href: '/admin/size-chart' },
  { icon: '🔗', label: 'Quản Lý Slug', href: '/admin/slug' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.replace('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="asb-logo">HT</span>
        <div>
          <span className="asb-name">Hoạt Tốc</span>
          <span className="asb-role">Admin Panel</span>
        </div>
      </div>

      <nav className="admin-nav">
        {menu.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-item${pathname.startsWith(item.href) ? ' active' : ''}`}
          >
            <span className="ani-icon">{item.icon}</span>
            <span className="ani-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-foot">
        <a href="/" className="admin-view-site" target="_blank" rel="noopener noreferrer">
          🌐 Xem Website
        </a>
        <button onClick={logout} className="admin-logout-btn">
          🚪 Đăng Xuất
        </button>
      </div>
    </aside>
  );
}
