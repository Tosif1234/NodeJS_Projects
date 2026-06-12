import showcaseImage1 from '../assets/lib/img4.png';
import showcaseImage2 from '../assets/lib/img2.png';
import showcaseImage3 from '../assets/lib/img5.png';

const showcaseImages = [
  { src: showcaseImage1, alt: 'Stacked burgers on a wooden board' },
  { src: showcaseImage2, alt: 'Melted cheese food closeup' },
  { src: showcaseImage3, alt: 'Burger with fries' },
];

function ArrowButton({ direction }) {
  const isNext = direction === 'next';

  return (
    <button
      type="button"
      aria-label={isNext ? 'Next food image' : 'Previous food image'}
      className={[
        'grid h-11 w-11 place-items-center text-[#6a6a6a] transition hover:text-[#f62650]',
        isNext ? 'lg:ml-6' : 'lg:mr-6',
      ].join(' ')}
    >
      <svg className="h-9 w-9" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d={isNext ? 'M12 24h24M27 15l9 9-9 9' : 'M36 24H12M21 15l-9 9 9 9'}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    </button>
  );
}

export default function AboutUs() {
  return (
    <section className="bg-[#fbfbfb] px-5 py-[70px] sm:px-8 lg:py-[84px]">
      <div className="mx-auto flex max-w-[1120px] items-center justify-center gap-4">
        <div className="hidden shrink-0 lg:block">
          <ArrowButton direction="prev" />
        </div>

        <div className="grid w-full max-w-[940px] gap-5 sm:grid-cols-3 lg:gap-6">
          {showcaseImages.map((image) => (
            <figure key={image.alt} className="group h-[260px] overflow-hidden bg-neutral-950 sm:h-[286px] lg:h-[296px]">
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </figure>
          ))}
        </div>

        <div className="hidden shrink-0 lg:block">
          <ArrowButton direction="next" />
        </div>
      </div>

      <div className="mt-7 flex justify-center gap-8 lg:hidden">
        <ArrowButton direction="prev" />
        <ArrowButton direction="next" />
      </div>
    </section>
  );
}
