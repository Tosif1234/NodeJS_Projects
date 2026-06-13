import React from 'react';
import FooterLogo from '../assets/TesteNest.png';
import FooterLeft from '../assets/footer-left.png';
// Note: Corrected the import path assuming your right image is named 'footer-right.png'
import FooterRight from '../assets/footer-right.png'; 

const aboutLinks = ['Fredoka One', 'Special Dish', 'Reservation', 'Contact'];
const menuLinks = ['Steaks', 'Burgers', 'Coctails', 'Bar B Q', 'Desserts'];

function LinkColumn({ title, links }) {
  return (
    <div className="min-w-0 text-center lg:text-left">
      <h3 className="inline-block border-b-4 border-[#ffce10] pb-1 text-[26px] font-black leading-none text-black sm:text-[28px]">
        {title}
      </h3>

      <ul className="mt-9 space-y-4 text-[16px] font-normal leading-none text-[#242424] flex flex-col items-center lg:items-start">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="group inline-flex items-center gap-3 transition hover:text-[#f62650]">
              <span className="text-[26px] font-light leading-[12px] text-[#555] transition group-hover:text-[#f62650]">
                &rsaquo;
              </span>
              <span>{link}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#f3f7fd] px-5 py-12 md:py-16 lg:pt-28 lg:pb-8 text-black sm:px-8 lg:px-10">
      
      {/* Replaced SVGs with Imported Image Assets */}
      <img
        src={FooterLeft}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 hidden max-h-[95%] w-auto max-w-[300px] object-contain object-left-bottom md:block xl:max-w-[200px]"
      />
      <img
        src={FooterRight}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden max-h-[95%] w-auto max-w-[300px] object-contain object-right-bottom md:block xl:max-w-[200px]"
      />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[310px_145px_145px_285px] lg:justify-center lg:gap-x-[72px] xl:gap-x-[92px]">
          
          <section className="flex min-h-[288px] flex-col rounded-[22px] bg-[#f62650] px-9 py-8 text-white shadow-sm sm:max-w-[350px] lg:h-[288px] lg:w-[310px] lg:max-w-none mx-auto lg:mx-0 items-center lg:items-start text-center lg:text-left">
            <img src={FooterLogo} alt="TasteNest" className="h-auto w-[100px] brightness-0 invert" />

            <div className="mt-14 space-y-5 text-[15px] font-black leading-none">
              <p>Tuesday &ndash; Saturday: 12:00pm &ndash; 23:00pm</p>
              <a href="#" className="inline-block underline decoration-2 underline-offset-2">
                Closed on Sunday
              </a>
            </div>

            <p className="mt-auto text-[15px] font-black leading-none">5 star rated on TripAdvisor</p>
          </section>

          <LinkColumn title="About" links={aboutLinks} />
          <LinkColumn title="Menu" links={menuLinks} />

          <section className="min-w-0 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h3 className="inline-block border-b-4 border-[#ffce10] pb-1 text-[26px] font-black leading-none text-black sm:text-[28px]">
              Newsletter
            </h3>

            <p className="mt-9 text-[16px] font-normal leading-none text-[#202020]">Get recent news and updates.</p>

            <form className="mt-5 max-w-[285px] flex flex-col items-center lg:items-start w-full" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">
                Email Address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Email Address"
                className="h-[50px] w-full rounded-lg border border-[#d9dde4] bg-white px-7 text-[15px] font-normal text-black outline-none transition placeholder:text-[#c5c5c5] focus:border-[#f62650] focus:ring-4 focus:ring-[#f62650]/10"
              />

              <button
                type="submit"
                className="mt-5 h-[52px] min-w-[128px] rounded-lg border-2 border-[#f62650] bg-[#f62650] px-8 text-[14px] font-black text-white shadow-[inset_0_0_0_3px_#f3f7fd] transition hover:-translate-y-0.5 hover:bg-[#e31f46] focus:outline-none focus:ring-4 focus:ring-[#f62650]/20"
              >
                Subscribe
              </button>
            </form>
          </section>
        </div>

        <div className="mt-16 h-2 w-full bg-[#ffce10] lg:mt-[78px]" />

        <div className="mt-7 flex flex-col gap-5 text-[15px] font-black leading-none sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <p className="w-full sm:w-auto">
            <span className="text-[#f62650]">&copy; 2025 TasteNest</span>
            <span className="mx-1">|</span>
            <span>All shawonetc3 Themes</span>
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-8 gap-y-4 lg:gap-x-12 w-full sm:w-auto">
            <a href="#" className="underline decoration-2 underline-offset-1 transition hover:text-[#f62650]">
              Facebook
            </a>
            <a href="#" className="underline decoration-2 underline-offset-1 transition hover:text-[#f62650]">
              Instagram
            </a>
            
            {/* Scroll to Top Arrow */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#ffce10] transition hover:text-[#f62650] focus:outline-none"
              aria-label="Scroll to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="h-[22px] w-[22px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}