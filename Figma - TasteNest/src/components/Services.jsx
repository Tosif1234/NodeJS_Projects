import qualityImage from '../assets/service.png';

function FeatureIcon({ type }) {
  const paths =
    type === 'quality'
      ? [
          'M18 35c7-11 28-11 36 0',
          'M16 39h40M20 47h34M26 56h21',
          'M24 32h2M34 29h2M44 32h2',
        ]
      : [
          'M31 18l5 9 10 2-7 7 2 10-10-5-9 5 2-10-7-7 10-2 4-9Z',
          'M17 55h44',
          'M24 62h30',
        ];

  return (
    <svg aria-hidden="true" className="h-[31px] w-[31px] shrink-0 text-[#ffbe12]" viewBox="0 0 70 70" fill="none">
      {paths.map((path) => (
        <path key={path} d={path} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      ))}
    </svg>
  );
}

function QualityFeature({ icon, title }) {
  return (
    <div className="relative flex gap-3">
      <FeatureIcon type={icon} />
      <div>
        <h3 className="text-[13px] font-black leading-none text-[#202020]">{title}</h3>
        <p className="mt-2 max-w-[185px] text-[10px] font-normal leading-[1.45] text-[#525252]">
          A team of dreamers and doers building unique interactive music and art
        </p>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="bg-[#f5f5f5] overflow-hidden py-12 md:py-[70px]">
  <div className="max-w-[1280px] mx-auto px-4 flex flex-col lg:flex-row items-center gap-[70px]">

    {/* LEFT */}
    <div className="w-full lg:w-[42%] text-center lg:text-left flex flex-col items-center lg:items-start">

      <span className="text-[#ef2d56] font-bold text-[13px]">
        About Our Food
      </span>

      <h2 className="mt-3 text-[34px] lg:text-[60px] font-black leading-[0.95] text-[#222]">
        Where Quality Meet
        <br />
        Excellent <span className="text-[#ef2d56]">Service.</span>
      </h2>

      <p className="mt-8 text-[#666] text-[14px] leading-[30px] max-w-[500px] mx-auto lg:mx-0">
        Its the perfect dining experience where every dish is crafted with
        fresh, high-quality ingredients. Experience quick and efficient
        service that ensures your food is served fresh every time.
      </p>

      <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-10">

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 max-w-[230px]">
          <FeatureIcon type="quality" />
          <div>
            <h4 className="font-bold text-[16px] text-[#222]">
              Super Quality Food
            </h4>

            <p className="mt-2 text-[13px] text-[#666] leading-6">
              A team of dreamers and doers building unique interactive music and art.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 max-w-[230px]">
          <FeatureIcon type="reputation" />
          <div>
            <h4 className="font-bold text-[16px] text-[#222]">
              Well Reputation
            </h4>

            <p className="mt-2 text-[13px] text-[#666] leading-6">
              A team of dreamers and doers building unique interactive music and art.
            </p>
          </div>
        </div>

      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-center gap-6 w-full justify-center lg:justify-start text-center sm:text-left">

        <button className="bg-[#ef2d56] hover:bg-[#dd2148] text-white font-bold text-[13px] px-10 py-4 rounded">
          More About Us
        </button>

        <div>
          <p className="uppercase text-[#ffbe12] font-bold text-[11px]">
            Brendon Barsey
          </p>

          <p className="uppercase font-bold text-[12px] text-[#222]">
            Customers Experience Is Our Highest Priority.
          </p>
        </div>

      </div>
    </div>

    {/* RIGHT */}
    <div className="w-full lg:w-[58%]">

      <div className="relative overflow-hidden rounded-[20px] lg:rounded-l-[32px] lg:rounded-r-none h-[360px] sm:h-[450px] lg:h-[520px]">

        <img
          src={qualityImage}
          alt="Fresh burgers"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div
          className="
            absolute
            bottom-8
            right-8
            sm:bottom-[55px]
            sm:right-[55px]
            rotate-[-20deg]
            bg-[#00A94F]
            text-white
            px-6
            py-3
            sm:px-8
            sm:py-5
            text-[20px]
            sm:text-[28px]
            font-black
            shadow-xl
          "
        >
          Since 1985
        </div>

      </div>

    </div>

  </div>
</section>
  );
}
