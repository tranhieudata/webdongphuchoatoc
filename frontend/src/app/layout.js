import SEO from "@/components/seo";  // Đảm bảo đường dẫn chính xác
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: "Đồng Phục Hỏa Tốc",
  description: "Cung cấp Đồng Phục thời gian hỏa tốc",
  keywords: "đồng phục bếp, đồng phục nhà hàng, đồng phục công ty",
  image: "https://dongphuchoatoc.com/assets/img/logo.png",
  url: "https://dongphuchoatoc.com"
};
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
      <SEO
          title={metadata.title}
          description={metadata.description}
          keywords={metadata.keywords}
          image={metadata.image}
          url={metadata.url}
        />
      </head>
      <body>
        {children}
        <div className="fixed-bottom-box">
          <a href="https://zalo.me/0382468988">
            <img src="/assets/img/ZALO.png" alt="Ảnh cố định dưới cùng" className="fixed-bottom-image" />
          </a>
          <img src="/assets/img/HOTLINE.png" alt="Ảnh cố định dưới cùng" className="fixed-bottom-left" />
        </div>
      </body>
    </html>
  );
}
