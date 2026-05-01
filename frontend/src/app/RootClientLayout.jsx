'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Header/Navbar';
import Footer from '@/components/Footer/Footer';
import PageLoadingSpinner from '@/components/PageLoadingSpinner';

export default function RootClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PageLoadingSpinner />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <div className="contact-sticky-bar">
        <div className="contact-sticky-item">
          <div className="contact-sticky-icons">
            <a href="tel:0983430900" aria-label="Hotline">📞</a>
            <a href="https://zalo.me/0335003416" target="_blank" rel="noopener noreferrer" aria-label="Zalo">Zalo</a>
          </div>
          <div>
            {/* <span className="label">Hotline</span> */}
            <a href="tel:0335003416" className="phone" style={{ color: '#fff', display: 'block' }}>Hotline: 0335 003 416</a>
          </div>
        </div>
        
        
      </div>
    </>
  );
}
