# Đồng Phục Hoạt Tốc - Frontend

Thiết kế frontend hiện đại cho website bán đồng phục, tối ưu hóa theo website wego.net.vn

## 🎨 Tính Năng Chính

✅ **Giao diện responsive** - Hoạt động tốt trên desktop, tablet, mobile  
✅ **SEO tối ưu** - Sử dụng Next.js cho SSR/SSG  
✅ **Dark mode support** - Thiết kế hiện đại  
✅ **Performance** - Lazy loading, image optimization  
✅ **Accessibility** - WCAG compliant  

## 📦 Tech Stack

- **Framework**: Next.js 14+ (React 18)
- **Styling**: CSS3 (Module-based)
- **Font**: Google Fonts (Roboto)
- **Build Tool**: Vite (for admin) / Next.js built-in
- **Package Manager**: npm / yarn

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 16+ 
- npm hoặc yarn

### 2. Installation

```bash
# Vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install
# hoặc
yarn install
```

### 3. Environment Setup

```bash
# Copy file .env.example
cp .env.example .env.local

# Chỉnh sửa các biến môi trường nếu cần
```

### 4. Development

```bash
# Chạy dev server
npm run dev
# hoặc
yarn dev

# Server sẽ chạy tại: http://localhost:3000
```

### 5. Build & Production

```bash
# Build project
npm run build

# Start production server
npm run start
```

## 📁 Cấu Trúc Thư Mục

```
frontend/
├── public/
│   └── assets/
│       └── img/
├── src/
│   ├── app/
│   │   ├── layout.js                    # Layout chính
│   │   ├── globals.css                  # Styles toàn bộ ứng dụng
│   │   ├── page.js                      # Trang chủ
│   │   ├── home.css
│   │   ├── san-pham/
│   │   │   ├── page.js                  # Trang danh sách sản phẩm
│   │   │   ├── products.css
│   │   │   └── [id]/
│   │   │       ├── page.js              # Trang chi tiết sản phẩm
│   │   │       └── product-detail.css
│   │   ├── lien-he/
│   │   │   ├── page.js                  # Trang liên hệ
│   │   │   └── contact.css
│   │   ├── mau-ao/                      # Danh mục áo
│   │   │   ├── ao-phong/
│   │   │   ├── ao-so-mi/
│   │   │   ├── ao-gio/
│   │   │   ├── ao-polo/
│   │   │   └── hoc-sinh/
│   │   └── gio-hang/                    # Giỏ hàng (coming soon)
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── Hero/
│   │   │   ├── HeroBanner.jsx
│   │   │   └── HeroBanner.css
│   │   ├── Products/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductCard.css
│   │   │   ├── ProductGrid.jsx
│   │   │   └── ProductGrid.css
│   │   ├── Categories/
│   │   │   ├── CategoriesSection.jsx
│   │   │   └── CategoriesSection.css
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   └── seo.jsx
│   ├── hooks/                           # Custom hooks
│   └── utils/                           # Utility functions
├── .env.example
├── package.json
├── next.config.mjs
└── README.md
```

## 🎯 Các Trang Chính

### 1. Trang Chủ (/)
- Hero Banner Carousel
- Danh mục sản phẩm
- Sản phẩm nổi bật
- Banner khuyến mãi
- Danh sách ưu điểm
- Newsletter signup

### 2. Trang Sản Phẩm (/san-pham)
- Danh sách sản phẩm với pagination
- Bộ lọc (danh mục, giá, đánh giá)
- Sắp xếp (mới nhất, phổ biến, giá, đánh giá)
- Product grid responsive

### 3. Trang Chi Tiết Sản Phẩm (/san-pham/[id])
- Hình ảnh sản phẩm (multi-image viewer)
- Thông tin chi tiết
- Chọn màu sắc, kích cỡ, số lượng
- Thêm vào giỏ hàng / Mua ngay / Yêu thích
- Thông số kỹ thuật
- Sản phẩm liên quan

### 4. Trang Liên Hệ (/lien-he)
- Form liên hệ
- Thông tin liên hệ
- Google Maps embed
- Social media links

### 5. Danh Mục (/mau-ao/[category])
- Danh sách sản phẩm theo danh mục
- Filters tương tự trang sản phẩm
- Breadcrumb navigation

## 🎨 Design System

### Colors
```css
Primary: #FF6B35 (Orange)
Secondary: #FF9500 (Light Orange)
Dark: #333333
Light: #FFFFFF
Border: #E0E0E0
Background: #F5F5F5
```

### Typography
```css
Font Family: 'Roboto', sans-serif
H1: 36px, 700
H2: 28px, 700
H3: 22px, 600
Body: 14px, 400
```

### Breakpoints
```css
Desktop: > 1024px
Tablet: 768px - 1024px
Mobile: < 768px
Small Mobile: < 480px
```

## 🔧 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm run start

# Lint (ESLint)
npm run lint

# Format (Prettier)
npm run format

# Type check (TypeScript)
npm run type-check
```

## 🌐 API Integration

Tạo một file `src/utils/api.js` để tích hợp API:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchProducts = async (page = 1, filters = {}) => {
  const response = await fetch(`${API_BASE_URL}/products?page=${page}`, {
    method: 'GET',
  });
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return response.json();
};

// Thêm các endpoints khác tùy theo backend
```

## 📱 Responsive Design

- **Desktop (1200px+)**: Full layout với sidebar
- **Tablet (768px-1024px)**: Layout 2-column
- **Mobile (480px-768px)**: Single column
- **Small mobile (<480px)**: Optimized for small screens

## 🛒 Tích Hợp Backend

File `.env.example`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Đồng Phục Hoạt Tốc
NEXT_PUBLIC_ZALO_URL=https://zalo.me/0382468988
NEXT_PUBLIC_PHONE=0382468988
```

## 🔒 Security Best Practices

- ✅ XSS Protection via React escaping
- ✅ CSRF tokens (implement with backend)
- ✅ Environment variables cho sensitive data
- ✅ Secure image loading (next/image)
- ✅ Input validation in forms

## 📊 Performance Optimization

- Next.js Image Component (auto optimization)
- CSS modules (scoped styling)
- Lazy loading components
- Optimized bundle size

## 🐛 Troubleshooting

### Port 3000 đã được sử dụng

```bash
# Chạy trên port khác
npm run dev -- -p 3001
```

### Clear cache

```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📞 Support & Contact

- **Email**: info@dongphuchoatoc.com
- **Phone**: 0382 468 988
- **Zalo**: https://zalo.me/0382468988

## 📝 License

Private Project - Đồng Phục Hoạt Tốc

## 👥 Team

- Frontend Developer: [Your Name]
- Backend Developer: [Backend Developer]
- Designer: [Designer]

---

**Lần cập nhật cuối**: Tháng 4, 2026
