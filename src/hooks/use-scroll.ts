'use client';
import { useEffect, useState } from 'react';

export const useScroll = (downThreshold: number, upThreshold?: number) => {
  const [scrolled, setScrolled] = useState(false);
  const scrollUpThreshold = upThreshold ?? downThreshold / 2;

  useEffect(() => {
    const handleScroll = () => {
      const scrollOffsetPx = window.scrollY;
      setScrolled((wasScrolled) => {
        if (wasScrolled) {
          return scrollOffsetPx > scrollUpThreshold;
        }
        return scrollOffsetPx > downThreshold;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [downThreshold, scrollUpThreshold]);

  return scrolled;
};
