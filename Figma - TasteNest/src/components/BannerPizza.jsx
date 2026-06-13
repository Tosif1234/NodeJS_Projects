import burgerImage from '../assets/burger-3.png';

import burgerText from '../assets/burger-text-3.png.png';
import bestDealsText from '../assets/today_best_deals.png.png';
import bannerBg from '../assets/banner/banner-bg.png';
import leftShape from '../assets/banner/left-shape.png.png';
import leavesChilli from '../assets/banner/leaveschilli.png.png';
import onionTomato from '../assets/banner/oniontomato.png.png';


export default function BannerPizza() {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <img
        src={bannerBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

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
        <div className="mx-auto w-full max-w-[633px] text-center lg:text-left">
          <span className="mb-3 block text-xs font-black uppercase tracking-tight text-[#ffd42a] sm:text-sm">
            Crispy, Every Bite Taste
          </span>

          <h2 className="text-[clamp(2.2rem,11vw,5rem)] font-black uppercase leading-[.93] tracking-normal sm:text-[clamp(3.2rem,7.5vw,5.5rem)] lg:text-[5.4rem] xl:text-[6.25rem]">
            Hot Spicy
            <span className="block">Chiken</span>
            <span className="block">Burger</span>
          </h2>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[28px] font-black lg:justify-start sm:text-xl font-bold">
            <span>Limited Offer /</span>
            <span className="text-[55px] leading-none">$5</span>
          </div>

          <button className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#ff315b] px-12 text-[17px] tracking-[0.8px] text-white shadow-[0_14px_28px_rgba(61,0,0,.22)] transition hover:bg-[#ff174d] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-red-900">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_1085_2891)">
                <path d="M18.5643 14.24C17.711 14.24 16.991 14.5467 16.4043 15.16C15.8176 15.7733 15.5243 16.4933 15.5243 17.32C15.5243 18.1467 15.8176 18.8533 16.4043 19.44C16.991 20.0267 17.6976 20.32 18.5243 20.32C19.351 20.32 20.0576 20.0267 20.6443 19.44C21.231 18.8533 21.5243 18.1467 21.5243 17.32C21.5243 16.4933 21.231 15.7733 20.6443 15.16C20.0576 14.5467 19.3643 14.24 18.5643 14.24ZM18.5643 18.8C18.1376 18.8 17.7776 18.6533 17.4843 18.36C17.191 18.0667 17.0443 17.7067 17.0443 17.28C17.0443 16.8533 17.191 16.4933 17.4843 16.2C17.7776 15.9067 18.1243 15.76 18.5243 15.76C18.9243 15.76 19.271 15.9067 19.5643 16.2C19.8576 16.4933 20.0043 16.8533 20.0043 17.28C20.0043 17.7067 19.8576 18.0667 19.5643 18.36C19.271 18.6533 18.9376 18.8 18.5643 18.8ZM8.1643 14.24C7.3643 14.24 6.67096 14.5467 6.0843 15.16C5.49763 15.7733 5.2043 16.4933 5.2043 17.32C5.2043 18.1467 5.49763 18.8533 6.0843 19.44C6.67096 20.0267 7.37763 20.32 8.2043 20.32C9.03096 20.32 9.73763 20.0267 10.3243 19.44C10.911 18.8533 11.2043 18.1467 11.2043 17.32C11.2043 16.4933 10.911 15.7733 10.3243 15.16C9.73763 14.5467 9.01763 14.24 8.1643 14.24ZM8.1643 18.8C7.79096 18.8 7.4443 18.6533 7.1243 18.36C6.8043 18.0667 6.6443 17.7067 6.6443 17.28C6.6443 16.8533 6.8043 16.4933 7.1243 16.2C7.4443 15.9067 7.8043 15.76 8.2043 15.76C8.6043 15.76 8.95096 15.9067 9.2443 16.2C9.53763 16.4933 9.6843 16.8533 9.6843 17.28C9.6843 17.7067 9.53763 18.0667 9.2443 18.36C8.95096 18.6533 8.59096 18.8 8.1643 18.8ZM20.5643 5.60001C20.4043 5.33334 20.191 5.20001 19.9243 5.20001H15.9243V6.72001H19.4443L21.5243 10.8L22.8043 10.16L20.5643 5.60001ZM10.5643 16.56H16.2443V18.08H10.5643V16.56ZM5.9243 16.56H3.2843C3.07096 16.56 2.89763 16.64 2.7643 16.8C2.63096 16.96 2.5643 17.1333 2.5643 17.32C2.5643 17.5067 2.63096 17.68 2.7643 17.84C2.89763 18 3.07096 18.08 3.2843 18.08H5.9243C6.13763 18.08 6.31096 18 6.4443 17.84C6.57763 17.68 6.6443 17.5067 6.6443 17.32C6.6443 17.1333 6.57763 16.96 6.4443 16.8C6.31096 16.64 6.13763 16.56 5.9243 16.56ZM24.2443 11.92L22.7243 10C22.6176 9.84001 22.431 9.76001 22.1643 9.76001H16.6443V4.40001C16.6443 4.24001 16.5776 4.08001 16.4443 3.92001C16.311 3.76001 16.1376 3.68001 15.9243 3.68001H3.2843C3.07096 3.68001 2.89763 3.76001 2.7643 3.92001C2.63096 4.08001 2.5643 4.25334 2.5643 4.44001C2.5643 4.62667 2.63096 4.80001 2.7643 4.96001C2.89763 5.12001 3.07096 5.20001 3.2843 5.20001H15.1243V10.48C15.1243 10.6933 15.2043 10.88 15.3643 11.04C15.5243 11.2 15.711 11.28 15.9243 11.28H21.7643L22.8843 12.64V16.56H20.8043C20.591 16.56 20.4043 16.64 20.2443 16.8C20.0843 16.96 20.0043 17.1333 20.0043 17.32C20.0043 17.5067 20.0843 17.68 20.2443 17.84C20.4043 18 20.591 18.08 20.8043 18.08H23.6843C23.8443 18.08 24.0043 18 24.1643 17.84C24.3243 17.68 24.4043 17.4933 24.4043 17.28V12.4C24.4043 12.24 24.351 12.08 24.2443 11.92ZM5.8443 12.72H2.4043C2.19096 12.72 2.0043 12.8 1.8443 12.96C1.6843 13.12 1.6043 13.3067 1.6043 13.52C1.6043 13.7333 1.6843 13.9067 1.8443 14.04C2.0043 14.1733 2.19096 14.24 2.4043 14.24H5.8443C6.05763 14.24 6.2443 14.1733 6.4043 14.04C6.5643 13.9067 6.6443 13.7333 6.6443 13.52C6.6443 13.3067 6.5643 13.12 6.4043 12.96C6.2443 12.8 6.05763 12.72 5.8443 12.72ZM7.6043 9.76001H1.1243C0.964297 9.76001 0.804297 9.82667 0.644297 9.96001C0.484297 10.0933 0.404297 10.2667 0.404297 10.48C0.404297 10.6933 0.484297 10.88 0.644297 11.04C0.804297 11.2 0.964297 11.28 1.1243 11.28H7.6043C7.81763 11.28 8.0043 11.2 8.1643 11.04C8.3243 10.88 8.4043 10.6933 8.4043 10.48C8.4043 10.2667 8.3243 10.0933 8.1643 9.96001C8.0043 9.82667 7.81763 9.76001 7.6043 9.76001ZM8.8843 6.80001H2.4043C2.19096 6.80001 2.0043 6.86667 1.8443 7.00001C1.6843 7.13334 1.6043 7.30667 1.6043 7.52001C1.6043 7.73334 1.6843 7.92001 1.8443 8.08001C2.0043 8.24001 2.19096 8.32001 2.4043 8.32001H8.8843C9.0443 8.32001 9.2043 8.24001 9.3643 8.08001C9.5243 7.92001 9.6043 7.73334 9.6043 7.52001C9.6043 7.30667 9.5243 7.13334 9.3643 7.00001C9.2043 6.86667 9.0443 6.80001 8.8843 6.80001Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_1085_2891">
                  <rect width="24.81" height="24" fill="white" transform="matrix(1 0 0 -1 0 24)" />
                </clipPath>
              </defs>
            </svg>
            Order Now
          </button>
        </div>

        <div className="relative mx-auto flex min-h-[280px] w-full max-w-[720px] items-center justify-center sm:min-h-[350px] lg:min-h-[470px]">
          <img
            src={bestDealsText}
            alt="Today's best deal"
            className="absolute left-[35%] top-0 z-20 w-[45%] min-w-[120px] sm:min-w-[185px] max-w-[330px] -translate-x-[8%] sm:top-1 lg:top-1"
          />
          <img
            src={burgerText}
            alt="Burger"
            className="absolute bottom-[12%] left-[10%] z-30 w-[40%] min-w-[100px] sm:min-w-[150px] max-w-[330px] rotate-[-8deg] sm:bottom-[13%] sm:left-[6%] lg:left-[1%]"
          />
          <img
            src={burgerImage}
            alt="Hot spicy chicken burger"
            className="relative z-20 mt-9 w-[70%] max-w-[610px] object-contain drop-shadow-[0_22px_25px_rgba(43,0,0,.42)] sm:w-[60%] lg:mt-12 lg:w-[82%]"
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
