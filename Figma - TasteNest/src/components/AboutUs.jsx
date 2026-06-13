import showcaseImage1 from "../assets/lib/img4.png";
import showcaseImage2 from "../assets/lib/img2.png";
import showcaseImage3 from "../assets/lib/img5.png";

const showcaseImages = [
  showcaseImage1,
  showcaseImage2,
  showcaseImage3,
];

function ArrowButton({ direction }) {
  const isNext = direction === "next";

  return (
    <button
      className="flex items-center justify-center text-[#6B6B6B] transition hover:text-[#f62650]"
      aria-label={isNext ? "Next" : "Previous"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10"
      >
        {isNext ? (
          <>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </>
        ) : (
          <>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 5 5 12 12 19" />
          </>
        )}
      </svg>
    </button>
  );
}

export default function AboutUs() {
  return (
    <section className="bg-[#f5f5f5] py-[60px] overflow-hidden">
  <div className="relative max-w-[1400px] mx-auto px-4">

    {/* Left Arrow - Outside 1280px */}
    <button
      className="
        hidden lg:flex
        absolute
        left-0
        top-1/2
        -translate-y-1/2
        text-[#666]
        hover:text-[#f62650]
      "
    >
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 12H5M12 5L5 12L12 19"
        />
      </svg>
    </button>

    {/* 1280px Images Container */}
    <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-6 md:gap-4 items-center">
      {showcaseImages.map((image, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            bg-black
            w-full
            max-w-[320px]
            sm:max-w-[410px]
            aspect-[410/536]
            h-auto
            md:w-[32%]
            xl:w-[410px]
            xl:h-[536px]
          "
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>

    {/* Right Arrow - Outside 1280px */}
    <button
      className="
        hidden lg:flex
        absolute
        right-0
        top-1/2
        -translate-y-1/2
        text-[#666]
        hover:text-[#f62650]
      "
    >
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12H19M12 5L19 12L12 19"
        />
      </svg>
    </button>
  </div>

  {/* Mobile Arrows */}
  <div className="flex md:hidden justify-center gap-8 mt-6">
    <ArrowButton direction="prev" />
    <ArrowButton direction="next" />
  </div>
</section>
  );
}