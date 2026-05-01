import Link from 'next/link';

const Error = () => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '60px 20px',
    }}>
      <div style={{
        fontSize: '120px',
        fontWeight: 800,
        color: '#FF6B35',
        lineHeight: 1,
        marginBottom: '8px',
      }}>404</div>

      <h1 style={{
        fontSize: '28px',
        fontWeight: 700,
        color: '#222',
        margin: '0 0 12px',
      }}>Trang không tồn tại</h1>

      <p style={{
        fontSize: '15px',
        color: '#888',
        marginBottom: '32px',
        maxWidth: '400px',
      }}>
        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: '#FF6B35',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '15px',
          textDecoration: 'none',
        }}>
          ← Trang Chủ
        </Link>
        <Link href="/san-pham" style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: '#fff',
          color: '#FF6B35',
          border: '2px solid #FF6B35',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '15px',
          textDecoration: 'none',
        }}>
          Xem Sản Phẩm
        </Link>
      </div>
    </div>
  );
};

export default Error;