import React from 'react';
import galleryImage1 from '../assets/lib/img1.png';
import galleryImage2 from '../assets/lib/img2.png';
import galleryImage3 from '../assets/lib/img3.png';
import galleryImage4 from '../assets/lib/img4.png';
import galleryImage5 from '../assets/lib/img5.png';

export default function InstagramGrid() {
  const galleryItems = [
    { src: galleryImage1, alt: 'Loaded wrap with fries' },
    { src: galleryImage2, alt: 'Fresh sandwich being served' },
    { src: galleryImage3, alt: 'Grilled chicken plate' },
    { src: galleryImage4, alt: 'Crispy chicken burger' },
    { src: galleryImage5, alt: 'Classic burger with fries' },
  ];

  return (
    <section className="w-full overflow-hidden" aria-label="TasteNest food gallery">
      {/* Grid container with no gaps to make images perfectly flush */}
      <div className="w-full grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5">
        {galleryItems.map((item, index) => (
          <figure
            key={item.alt}
            className={`group relative w-full overflow-hidden aspect-[4/3] lg:aspect-[5/4] bg-neutral-900 ${
              index === 4 ? 'hidden md:block' : ''
            }`}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            {/* Subtle hover overlay to add interaction depth */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
          </figure>
        ))}
      </div>
    </section>
  );
}