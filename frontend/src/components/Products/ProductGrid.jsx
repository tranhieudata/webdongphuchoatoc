import Link from 'next/link';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ title, products = [], viewAllHref, cols = 4 }) {
  return (
    <section className="product-grid-section">
      <div className="container">
        {title && (
          <div className="grid-header">
            <div className="section-header">
              <h2>{title}</h2>
            </div>
            {viewAllHref && (
              <Link href={viewAllHref} className="view-all-link">
                Xem tất cả &rarr;
              </Link>
            )}
          </div>
        )}
        <div className={`product-grid cols-${cols}`}>
          {products.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
