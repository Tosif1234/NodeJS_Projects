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
    <section className="bg-[#fcfbfa] px-4 py-4 sm:px-5 lg:px-4" aria-label="TasteNest food gallery">
      <div className="mx-auto grid max-w-360 grid-cols-2 overflow-hidden border border-white bg-neutral-950 shadow-[0_16px_44px_rgba(15,15,15,0.12)] sm:grid-cols-3 lg:grid-cols-5">
        {galleryItems.map((item, index) => (
          <figure
            key={item.alt}
            className={[
              'group relative aspect-[1.18/1] overflow-hidden bg-neutral-950 sm:aspect-[1.35/1] lg:aspect-[1.22/1]',
              index === galleryItems.length - 1 ? 'col-span-2 sm:col-span-1' : '',
            ].join(' ')}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover brightness-[0.92] transition duration-500 ease-out group-hover:scale-105 group-hover:brightness-105"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />
          </figure>
        ))}
      </div>
    </section>
  );
}
