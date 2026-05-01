'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './Navbar.css';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/category/all`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.categories || []);
        setCategories(list);
      })
      .catch(() => {});
    fetch(`${API}/api/tag/all`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.tags || []);
        setTags(list);
      })
      .catch(() => {}); 
  }, []);

  const menuItems = [
    { label: 'Giới Thiệu', href: '/gioi-thieu' },
    {
      label: 'Sản Phẩm',
      href: '/san-pham',
      children: [
        ...categories.map(c => ({ label: c.name, href: `/danh-muc/${c.slug}` })),
      ],
    },
    { label: 'Mẫu Áo', 
      href: '/mau-ao' ,
      children: [
        ...tags.map(t => ({ label: t.name, href: `/mau-ao/${t.slug}` })),
      ],
    },
    { label: 'Mẫu Vải', href: '/mau-vai' },
    { label: 'Bảng Size', href: '/bang-size' },
    { label: 'Tin Tức', href: '/tin-tuc' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      window.location.href = `/san-pham?q=${encodeURIComponent(searchVal.trim())}`;
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <span>Hotline : 0335.003.416 | CHÚNG TÔI MANG CHẤT LƯỢNG ĐẾN BẠN, NHANH CHÓNG VÀ HOÀN HẢO | Làm việc: T2 – CN , 24/7</span>
          </div>
          <div className="topbar-right">
            <a href="tel:0335003416" className="cart-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <span>0335.003.416</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link href="/" className="logo">
            <img src="/assets/img/logo.png" alt="Logo" height="40" />
            <div className="logo-text">
              <span className="logo-main">ĐỒNG PHỤC HỎA TỐC</span>
            
            </div>
          </Link>
        
         

          {/* Desktop Menu */}
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li
                key={item.label}
                className={`nav-item${item.children ? ' has-dropdown' : ''}`}
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link href={item.href} className="nav-link">
                  {item.label}
                  {item.children && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  )}
                </Link>
                {item.children && openDropdown === item.label && (
                  <ul className="dropdown">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Tìm kiếm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button className="icon-btn hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="search-bar">
            <div className="container">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  autoFocus
                />
                <button type="submit">Tìm kiếm</button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            <ul>
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
                  {item.children && (
                    <ul className="mobile-sub">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} onClick={() => setMobileOpen(false)}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
