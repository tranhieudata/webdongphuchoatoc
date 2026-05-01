'use client';
import { useState } from 'react';
import './contact.css';

export default function LienHePage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <a href="/">Trang Chủ</a>
          <span className="breadcrumb-sep">›</span>
          <span>Liên Hệ</span>
        </div>
      </div>

      <div className="contact-page">
        <div className="container">
          <div className="section-header">
            <h2>Liên Hệ Với Chúng Tôi</h2>
            <p>Chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7</p>
          </div>

          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info">
              <div className="contact-card">
                <span className="ci-icon">📍</span>
                <div>
                  <h4>Địa Chỉ</h4>
                 
                  <p>97 Ngõ 99 Định Công Hạ Hoàng Mai Hà Nội</p>
                </div>
              </div>
              <div className="contact-card">
                <span className="ci-icon">📞</span>
                <div>
                  <h4>Điện Thoại</h4>
                  
                  <p><a href="tel:0335003416">0335 003 416</a></p>
                </div>
              </div>
              <div className="contact-card">
                <span className="ci-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:info@dongphuchoatoc.com">info@dongphuchoatoc.com</a></p>
                </div>
              </div>
              <div className="contact-card">
                <span className="ci-icon">⏰</span>
                <div>
                  <h4>Giờ Làm Việc</h4>
                  <p>Thứ 2 - Thứ 7: 8:00 - 18:00</p>
                  <p>Chủ Nhật: 9:00 - 17:00</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrap">
              {sent ? (
                <div className="contact-success">
                  <span>✅</span>
                  <h3>Gửi thành công!</h3>
                  <p>Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
                  <button onClick={() => setSent(false)} className="btn btn-outline">Gửi Thêm</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3>Gửi Yêu Cầu Báo Giá</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Họ và Tên *</label>
                      <input type="text" required placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Số Điện Thoại *</label>
                      <input type="tel" required placeholder="0900 000 000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Loại Đồng Phục *</label>
                    <select required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                      <option value="">-- Chọn loại đồng phục --</option>
                      <option>Đồng Phục Công Ty</option>
                      <option>Đồng Phục Học Sinh</option>
                      <option>Đồng Phục Nhà Hàng</option>
                      <option>Áo Polo / Áo Phông</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nội Dung *</label>
                    <textarea required rows={5} placeholder="Mô tả yêu cầu, số lượng, màu sắc..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>
                    Gửi Yêu Cầu
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
