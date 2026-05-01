'use client';
import Link from 'next/link';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { id, name, price, originalPrice, image, slug, isNew, discount } = product;

  const formatPrice = (p) => p.toLocaleString('vi-VN') + '₫';

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <Link href={`/san-pham/${slug || id}/${id}`}>
          {image ? (
            <img src={image} alt={name} className="product-img" loading="lazy" />
          ) : (
            <div className="product-img-placeholder">
              <span>👕</span>
            </div>
          )}
        </Link>
        <div className="product-badges">
          {isNew && <span className="badge badge-new">Mới</span>}
          {discount && <span className="badge badge-sale">-{discount}%</span>}
        </div>
        <div className="product-actions">
          <button className="action-btn" title="Thêm vào giỏ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </button>
          <Link href={`/san-pham/${slug || id}/${id}`} className="action-btn" title="Xem chi tiết">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </Link>
        </div>
      </div>
      <div className="product-info">
        <Link href={`/san-pham/${slug || id}/${id}`} className="product-name">{name}</Link>
        <div className="product-price">
          <span className="price-current">{formatPrice(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className="price-original">{formatPrice(originalPrice)}</span>
          )}
        </div>
        <button className="product-cta">Xem Mẫu</button>
      </div>
    </div>
  );
}
