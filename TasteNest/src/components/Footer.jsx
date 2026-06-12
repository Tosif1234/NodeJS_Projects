import FooterLogo from '../assets/TesteNest.png';

const aboutLinks = ['Fredoka One', 'Special Dish', 'Reservation', 'Contact'];
const menuLinks = ['Steaks', 'Burgers', 'Coctails', 'Bar B Q', 'Desserts'];

function LinkColumn({ title, links }) {
  return (
    <div className="min-w-0">
      <h3 className="inline-block border-b-4 border-[#ffce10] pb-1 text-[26px] font-black leading-none text-black sm:text-[28px]">
        {title}
      </h3>

      <ul className="mt-9 space-y-4 text-[16px] font-normal leading-none text-[#242424]">
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

function FooterIllustration({ side }) {
  const isLeft = side === 'left';

  return (
    <svg
      aria-hidden="true"
      className={[
        'pointer-events-none absolute bottom-0 hidden h-[360px] w-[330px] text-[#6d675d] opacity-75 md:block xl:h-[430px] xl:w-[390px]',
        isLeft ? '-left-28 xl:-left-24' : '-right-28 scale-x-[-1] xl:-right-24',
      ].join(' ')}
      viewBox="0 0 390 430"
      fill="none"
    >
      <path
        d="M58 280c20-52 64-92 120-112 56-19 120-13 156 18-12 46-47 90-96 116-60 31-133 25-180-22Z"
        fill="#ffce10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M76 262c54 16 120 26 218-54M95 221c34 20 90 38 154 35M132 186c25 19 58 30 101 31"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M246 322c17-42 48-70 84-78 17 45 5 88-32 128-32-11-49-26-52-50Z"
        fill="#f6f8fb"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path d="M273 349c15-31 31-58 57-101" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      <path
        d="M32 368c18-28 52-38 80-24 10 27-8 58-42 70-25-5-38-20-38-46Z"
        fill="#f6f8fb"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M47 383c20-16 39-25 63-36M58 354c3 13 9 25 20 37M84 346c0 16-3 31-10 46"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M310 124c16-34 51-48 86-38 14 34-4 70-45 88-27-7-41-24-41-50Z"
        fill="#f6f8fb"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path d="M328 144c24-24 45-39 66-53" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#f3f7fd] px-5 pt-16 pb-8 text-black sm:px-8 lg:px-10 lg:pt-28">
      <FooterIllustration side="left" />
      <FooterIllustration side="right" />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="grid gap-10 lg:grid-cols-[310px_145px_145px_285px] lg:justify-center lg:gap-x-[72px] xl:gap-x-[92px]">
          <section className="flex min-h-[288px] flex-col rounded-[22px] bg-[#f62650] px-9 py-8 text-white shadow-sm sm:max-w-[350px] lg:h-[288px] lg:w-[310px] lg:max-w-none">
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

          <section className="min-w-0">
            <h3 className="inline-block border-b-4 border-[#ffce10] pb-1 text-[26px] font-black leading-none text-black sm:text-[28px]">
              Newsletter
            </h3>

            <p className="mt-9 text-[16px] font-normal leading-none text-[#202020]">Get recent news and updates.</p>

            <form className="mt-5 max-w-[285px]" onSubmit={(event) => event.preventDefault()}>
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

        <div className="mt-7 flex flex-col gap-5 text-[15px] font-black leading-none sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="text-[#f62650]">&copy; 2025 TasteNest</span>
            <span className="mx-1">|</span>
            <span>All shawonetc3 Themes</span>
          </p>

          <div className="flex flex-wrap gap-x-24 gap-y-4 sm:justify-end">
            <a href="#" className="underline decoration-2 underline-offset-1 transition hover:text-[#f62650]">
              Facebook
            </a>
            <a href="#" className="underline decoration-2 underline-offset-1 transition hover:text-[#f62650]">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
