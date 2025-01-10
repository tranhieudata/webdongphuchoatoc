import Link from 'next/link';

const Error = () => {
  return (
    <div style={{padding:"200px",textAlign:"center"}}>
      <h1>Trang không được tìm thấy.</h1>
      
      <Link href="/">Quay lại trang chủ</Link>
    </div>
  );
};

export default Error;