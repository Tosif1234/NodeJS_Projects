import burgerImage from '../assets/burger-3.png';
import burgerText from '../assets/burger-text-3.png.png';
import bestDealsText from '../assets/today_best_deals.png.png';
import leftShape from '../assets/banner/left-shape.png.png';
import leavesChilli from '../assets/banner/leaveschilli.png.png';
import onionTomato from '../assets/banner/oniontomato.png.png';

export default function BannerPizza() {
  return (
    <section className="relative isolate overflow-hidden bg-[#990000] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_45%,#d00000_0%,#a90000_38%,#650000_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-35 [background-image:radial-gradient(rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:4px_4px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_94%,rgba(255,127,0,.44),transparent_21%),radial-gradient(circle_at_95%_92%,rgba(255,90,0,.34),transparent_20%),linear-gradient(90deg,rgba(31,0,0,.72),transparent_28%,transparent_71%,rgba(38,0,0,.7))]" />

      <img
        src={leftShape}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-5 top-12 z-0 w-18 sm:w-24 lg:left-0 lg:top-16 lg:w-28"
      />
      <img
        src={leavesChilli}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center opacity-95"
      />
      <img
        src={onionTomato}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center opacity-95"
      />

      <div className="relative z-10 mx-auto grid min-h-[430px] max-w-7xl items-center gap-7 px-5 py-10 sm:min-h-[480px] sm:px-8 lg:min-h-[570px] lg:grid-cols-[.86fr_1.14fr] lg:px-12 lg:py-12">
        <div className="mx-auto w-full max-w-[390px] text-center sm:text-left lg:pl-28">
          <span className="mb-3 block text-xs font-black uppercase tracking-tight text-[#ffd42a] sm:text-sm">
            Crispy, Every Bite Taste
          </span>
          <h2 className="text-[clamp(3.1rem,13vw,5.9rem)] font-black uppercase leading-[.93] tracking-normal sm:text-[clamp(4rem,8vw,6.7rem)] lg:text-[5.4rem] xl:text-[6.05rem]">
            Hot Spicy
            <span className="block">Chiken</span>
            <span className="block">Burger</span>
          </h2>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-lg font-black sm:justify-start sm:text-xl">
            <span>Limited Offer</span>
            <span className="h-8 w-px bg-white/70" aria-hidden="true" />
            <span className="text-4xl leading-none">$5</span>
          </div>

          <button className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#ff315b] px-8 text-xs font-black uppercase tracking-tight text-white shadow-[0_14px_28px_rgba(61,0,0,.22)] transition hover:bg-[#ff174d] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-red-900">
            <span aria-hidden="true">↝</span>
            Order Now
          </button>
        </div>

        <div className="relative mx-auto flex min-h-[280px] w-full max-w-[720px] items-center justify-center sm:min-h-[350px] lg:min-h-[470px]">
          <img
            src={bestDealsText}
            alt="Today's best deal"
            className="absolute left-1/2 top-0 z-20 w-[42%] min-w-[185px] max-w-[330px] -translate-x-[8%] sm:top-1 lg:top-1"
          />
          <img
            src={burgerText}
            alt="Burger"
            className="absolute bottom-[12%] left-[10%] z-30 w-[40%] min-w-[150px] max-w-[330px] rotate-[-8deg] sm:bottom-[13%] sm:left-[6%] lg:left-[1%]"
          />
          <img
            src={burgerImage}
            alt="Hot spicy chicken burger"
            className="relative z-20 mt-9 w-[83%] max-w-[610px] object-contain drop-shadow-[0_22px_25px_rgba(43,0,0,.42)] sm:w-[78%] lg:mt-12 lg:w-[82%]"
          />
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-white/60" />
        <span className="h-3 w-3 rounded-full border-2 border-white bg-transparent" />
        <span className="h-2 w-2 rounded-full bg-white/60" />
      </div>
    </section>
  );
}
