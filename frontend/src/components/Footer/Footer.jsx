import Link from 'next/link';
import './Footer.css';
import { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
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
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-col footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-main">Đồng Phục Hỏa Tốc</span>
             
            </div>
            <p>Chuyên sản xuất đồng phục cao cấp cho doanh nghiệp, trường học, nhà hàng với hơn 10 năm kinh nghiệm.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" aria-label="Zalo">Zalo</a>
            </div>
          </div>

          {/* Collections */}
          <div className="footer-col">
            <h4>Danh Mục Sản Phẩm</h4>
            {categories.length === 0 ? (
              <p>Không có danh mục nào</p>
            ) : (
              <ul>
                {categories.map(c => (
                  <li key={c._id}>
                    <Link href={`/danh-muc/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tags */}
          <div className="footer-col">
            <h4>Mẫu Áo Phổ Biến</h4>
            {tags.length === 0 ? (
              <p>Không có mẫu áo nào</p>
            ) : (
              <ul>
                {tags.map(t => (
                  <li key={t._id}>
                    <Link href={`/mau-ao/${t.slug}`}>{t.name}</Link>
                  </li>
                ))}
              </ul>
            )}
             
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Hỗ Trợ</h4>
            <ul>
              <li><Link href="/gioi-thieu">Giới Thiệu</Link></li>
              <li><Link href="/tin-tuc">Tin Tức</Link></li>
              <li><Link href="/lien-he">Liên Hệ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Liên Hệ</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-icon">📍</span>
                <span>97 Ngõ 99 Định Công Hạ, Hoàng Mai, Hà Nội</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:0335003416">0335 003 416</a>
              </li>
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:dongphuchoatoc.com@gmail.com">dongphuchoatoc.com@gmail.com</a>
              </li>
              <li>
                <span className="contact-icon">⏰</span>
                <span>8:00 - 18:00, Thứ 2 - Thứ 7</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2025 Đồng Phục Hỏa Tốc. Bảo lưu mọi quyền.</p>
          <div className="payment-methods">
            <span>Thanh toán:</span>

            <span className="pay-badge">COD</span>
            <span className="pay-badge">Chuyển Khoản</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
