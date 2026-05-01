'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const LOGO_URL = '/assets/img/logo.png';
const ORIGINAL_FAVICON = '/assets/img/logo.png';

export default function PageLoadingSpinner() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [logoImage, setLogoImage] = useState(null);

  // Load original logo image
  useEffect(() => {
    const img = new Image();
    img.src = LOGO_URL;
    img.onload = () => setLogoImage(img);
  }, []);

  const createSpinnerFavicon = (rotate) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 64, 64);

    // Draw logo in center
    if (logoImage) {
      ctx.drawImage(logoImage, 8, 8, 48, 48);
    }

    // Save state for rotation
    ctx.save();
    ctx.translate(32, 32);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.translate(-32, -32);

    // Draw spinning circle border
    ctx.strokeStyle = '#009944';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 1.5);
    ctx.stroke();

    ctx.restore();

    return canvas.toDataURL();
  };

  const updateFavicon = (dataUrl) => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = dataUrl;
  };

  const restoreFavicon = () => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = ORIGINAL_FAVICON;
  };

  useEffect(() => {
    setIsLoading(true);
    let animationFrame;
    let currentRotation = 0;

    if (!logoImage) return;

    // Animation loop
    const animate = () => {
      currentRotation = (currentRotation + 12) % 360;
      updateFavicon(createSpinnerFavicon(currentRotation));
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    // Stop after 1.2 seconds
    const timer = setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      setIsLoading(false);
      restoreFavicon();
    }, 1200);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
    };
  }, [pathname, logoImage]);

  return null;
}
