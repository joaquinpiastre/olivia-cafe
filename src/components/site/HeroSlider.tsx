'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { img } from '@/lib/site';

const SLIDES = [
  { src: '/img/hero-cafe-1.jpg', alt: 'Café con leche con arte latte en una taza de cerámica floral, una porción de carrot cake y jugo de naranja sobre la mesa' },
  { src: '/img/hero-cafe-2.jpg', alt: 'Mesa con dos cafés con arte latte, sándwich tostado, torta de chocolate, chipás y limonada' },
  { src: '/img/hero-cafe-3.jpg', alt: 'Porción de torta de chocolate, tiramisú, chipás y café con leche sobre una mesa de madera' },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-soft sm:aspect-[5/6] lg:max-w-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotos de Olivia"
    >
      {SLIDES.map((s, idx) => (
        <Image
          key={s.src}
          src={img(s.src)}
          alt={s.alt}
          fill
          priority={idx === 0}
          sizes="(min-width: 1024px) 560px, 90vw"
          aria-hidden={idx !== i}
          className={`object-cover transition-opacity duration-1000 ${idx === i ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Ver foto ${idx + 1}`}
            aria-current={idx === i}
            onClick={() => setI(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === i ? 'w-7 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/90'}`}
          />
        ))}
      </div>
    </div>
  );
}
