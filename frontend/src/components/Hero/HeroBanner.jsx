'use client';
import { useState, useEffect, useCallback } from 'react';
import './HeroBanner.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}/api/banner/`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch banners');
        return r.json();
      })
      .then(data => {
        const activeBanners = Array.isArray(data) ? data.filter(b => b.status === 'active') : [];
        if (activeBanners.length === 0) {
          setError('Không có banner nào được kích hoạt');
          setSlides([]);
          return;
        }
        const apiSlides = activeBanners.map(b => ({
          id: b._id,
          title: b.title || 'Banner',
          subtitle: b.subtitle || '',
          desc: b.desc || '',
          cta: b.cta || 'Xem Thêm',
          href: b.href || '#',
          bg: b.bg || 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
          image: b.imageUrl ? `${API}${b.imageUrl}` : null,
          accent: b.accent || '#fff',
        }));
        setSlides(apiSlides);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching banners:', err);
        setError('Lỗi khi tải banner: ' + err.message);
        setSlides([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback((idx) => {
    if (transitioning || slides.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx % slides.length);
      setTransitioning(false);
    }, 150);
  }, [transitioning, slides.length]);

  const next = useCallback(() => {
    if (slides.length > 0) {
      goTo((current + 1) % slides.length);
    }
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    if (slides.length > 0) {
      goTo((current - 1 + slides.length) % slides.length);
    }
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(next, 5000);
      return () => clearInterval(timer);
    }
  }, [next, slides.length]);

  // Show loading state
  if (loading) {
    return (
      <div className="hero-banner" style={{ minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center', color: '#999' }}>Đang tải banner...</div>
      </div>
    );
  }

  // Show error state
  if (error || slides.length === 0) {
    return (
      <div className="hero-banner" style={{ minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>{error || 'Chưa có banner nào'}</p>
          <p style={{ fontSize: '12px', color: '#999' }}>Vui lòng thêm banner tại /admin/banner</p>
        </div>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div className="hero-banner">
      <div
        className={`hero-slide${transitioning ? ' fade-out' : ''}`}
        style={{
          backgroundImage: slide.image ? `url('${slide.image}')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div
          className="hero-overlay"
          style={{ background: slide.bg }}
        />
        <div className="hero-content container">
          <div className="hero-text">
            {slide.subtitle && <span className="hero-tag" style={{ color: slide.accent }}>Bộ Sưu Tập Mới</span>}
            <h1 className="hero-title">{slide.title}</h1>
            {slide.subtitle && <p className="hero-subtitle">{slide.subtitle}</p>}
            {slide.desc && <p className="hero-desc">{slide.desc}</p>}
            <a href={slide.href} className="hero-cta">
              {slide.cta} &rarr;
            </a>
          </div>
          <div className="hero-visual">
            <div className="hero-badge">
              <span className="badge-num">10+</span>
              <span className="badge-text">Năm Kinh Nghiệm</span>
            </div>
            <div className="hero-badge">
              <span className="badge-num">1000+</span>
              <span className="badge-text">Khách Hàng</span>
            </div>
            <div className="hero-badge">
              <span className="badge-num">100%</span>
              <span className="badge-text">Hài Lòng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button className="hero-prev" onClick={prev} aria-label="Previous">&#10094;</button>
          <button className="hero-next" onClick={next} aria-label="Next">&#10095;</button>

          {/* Dots */}
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === current ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
