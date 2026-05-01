import { Inter } from 'next/font/google';
import './globals.css';
import RootClientLayout from './RootClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Đồng Phục Hỏa Tốc - Đồng Phục Uy Tín Chất Lượng Cao',
  description: 'Chuyên sản xuất và cung cấp đồng phục doanh nghiệp, học sinh, nhà hàng, thể thao. Hơn 10 năm kinh nghiệm, chất lượng cao, giá cả hợp lý.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
