import './about.css';

export default function GioiThieuPage() {
  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <a href="/">Trang Chủ</a>
          <span className="breadcrumb-sep">›</span>
          <span>Giới Thiệu</span>
        </div>
      </div>

      <div className="about-page">
        {/* Hero */}
        <section className="about-hero">
          <div className="container">
            <div className="about-hero-inner">
              <div>
                <span className="about-tag">Về Chúng Tôi</span>
                <h1>Đồng Phục Hoạt Tốc<br/>Uy Tín - Chất Lượng</h1>
                <p>Hơn 10 năm kinh nghiệm trong lĩnh vực sản xuất đồng phục cao cấp cho doanh nghiệp, trường học, nhà hàng và các tổ chức trên toàn quốc.</p>
                <a href="/lien-he" className="btn btn-primary">Liên Hệ Ngay</a>
              </div>
              <div className="about-hero-stats">
                {[['10+','Năm kinh nghiệm'],['5000+','Khách hàng'],['2000m²','Xưởng sản xuất'],['100%','Hài lòng']].map(([n,l]) => (
                  <div key={l} className="about-stat">
                    <strong>{n}</strong>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="about-story">
          <div className="container">
            <div className="about-story-inner">
              <div className="story-img-placeholder">🏭</div>
              <div className="story-text">
                <h2>Câu Chuyện Thương Hiệu</h2>
                <p>Đồng Phục Hoạt Tốc được thành lập với sứ mệnh mang đến những bộ đồng phục chất lượng cao, giá cả phải chăng cho mọi doanh nghiệp và tổ chức tại Việt Nam.</p>
                <p>Với xưởng may rộng 2000m², đội ngũ 200+ nhân viên lành nghề và hệ thống máy móc hiện đại, chúng tôi có khả năng đáp ứng mọi đơn hàng từ nhỏ đến lớn với chất lượng đồng đều và tiến độ giao hàng đúng hẹn.</p>
                <p>Áp dụng tiêu chuẩn quản lý chất lượng ISO, mỗi sản phẩm xuất xưởng đều trải qua quy trình kiểm soát chất lượng nghiêm ngặt trước khi đến tay khách hàng.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="about-values">
          <div className="container">
            <div className="section-header">
              <h2>Giá Trị Cốt Lõi</h2>
            </div>
            <div className="values-grid">
              {[
                { icon: '🎯', title: 'Chất Lượng', desc: 'Sử dụng nguyên liệu cao cấp, kiểm soát chất lượng nghiêm ngặt ở mọi công đoạn sản xuất.' },
                { icon: '💡', title: 'Sáng Tạo', desc: 'Đội ngũ thiết kế chuyên nghiệp, luôn cập nhật xu hướng và tạo ra những mẫu đồng phục độc đáo.' },
                { icon: '🤝', title: 'Tin Cậy', desc: 'Cam kết giao hàng đúng hẹn, báo giá minh bạch, dịch vụ hậu mãi tận tâm.' },
                { icon: '🌱', title: 'Bền Vững', desc: 'Hướng đến sản xuất xanh, sử dụng nguyên liệu thân thiện môi trường, giảm thiểu lãng phí.' },
              ].map(v => (
                <div key={v.title} className="value-card">
                  <span className="value-icon">{v.icon}</span>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clients */}
        <section className="about-clients">
          <div className="container">
            <div className="section-header">
              <h2>Khách Hàng Tiêu Biểu</h2>
              <p>Niềm tin từ hàng nghìn doanh nghiệp lớn nhỏ trên toàn quốc</p>
            </div>
            <div className="clients-banner">
              {['VTV', 'Toyota', 'FPT Software', 'Vingroup', 'Viettel', 'Grab', 'Highlands Coffee', 'The Coffee House'].map(c => (
                <div key={c} className="client-badge">{c}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
