'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/admin.css';

export default function AdminLayout({ children }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setReady(true);
      return;
    }
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  }, [pathname]);

  if (!ready) return null;

  if (pathname === '/admin/login') {
    return <div className="admin-overlay">{children}</div>;
  }

  return (
    <div className="admin-overlay">
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-body">
          <div className="admin-topbar">
            <h2 className="admin-page-title">Quản Trị Hệ Thống</h2>
            <div className="admin-topbar-right">
              <span className="admin-user-badge">👤 Admin</span>
            </div>
          </div>
          <main className="admin-main">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
