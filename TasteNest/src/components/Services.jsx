import qualityImage from '../assets/lib/img4.png';

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
    <section className="overflow-hidden bg-white px-5 py-16 sm:px-8 lg:py-0">
      <div className="mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-[1fr_1.02fr] lg:gap-[58px]">
        <div className="py-4 lg:py-[82px]">
          <span className="text-[11px] font-black leading-none text-[#f62650]">About Our Food</span>
          <h2 className="mt-3 max-w-[430px] text-[40px] font-black leading-[0.94] text-[#252525] sm:text-[48px]">
            Where Quality Meet Excellent <span className="text-[#f62650]">Service.</span>
          </h2>

          <p className="mt-7 max-w-[550px] text-[12px] font-normal leading-[1.72] text-[#555]">
            Its the perfect dining experience where every dish is crafted with fresh, high-quality Experience quick and
            efficient service that ensures your food is served fresh Its the dining experience where every dish is crafted
            with fresh, high-quality ingredients
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <QualityFeature icon="quality" title="Super Quality Food" />
            <div className="relative">
              <QualityFeature icon="reputation" title="Well Reputation" />
              <span className="absolute -right-1 top-2 hidden text-[12px] font-black text-[#f6268d] sm:block">+</span>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
            <a
              href="#"
              className="inline-flex h-[46px] w-max items-center rounded-[4px] bg-[#f62650] px-9 text-[12px] font-black leading-none text-white transition hover:bg-[#df1e46]"
            >
              More About Us
            </a>

            <div className="text-[10px] font-black uppercase leading-[1.25] text-[#1f1f1f]">
              <p className="text-[#ffbe12]">Bredon Bakery</p>
              <p>Customers Experience Is Our Highest Priority.</p>
            </div>
          </div>
        </div>

        <div className="relative -mx-5 sm:-mx-8 lg:mx-0">
          <div className="relative h-[330px] overflow-hidden rounded-none bg-neutral-950 sm:h-[420px] lg:h-[470px] lg:rounded-bl-[22px] lg:rounded-tl-[22px]">
            <img src={qualityImage} alt="Fresh burgers and fries" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/10" />
            <span className="absolute bottom-[52px] right-[78px] rotate-[-22deg] bg-[#00a84f] px-7 py-4 text-[23px] font-black leading-none text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:right-[96px]">
              Since 1985
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
