import React from 'react';
import Pizza from "../assets/big-pizza-1.png.png";
import Fries from "../assets/french-fry-2.png.png";
import friedChiken from "../assets/chicken-french.png.png";
import pizzaBG from "../assets/pizza-bg.png";
import friesBG from "../assets/fries-bg.png";
import friedChikenBG from "../assets/friedChiken-bg.png";

const PromoCards = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div
          className="relative rounded-xl overflow-hidden p-6 h-64 flex flex-col justify-between group bg-cover bg-center"
          style={{ backgroundImage: `url(${pizzaBG})` }}
        >
          <div className="relative z-10">
            <p className="text-yellow-500 text-sm font-semibold mb-1">Crispy, Every Bite Taste</p>
            <h3 className="text-white text-3xl font-bold leading-tight">Delicious & <br /> Hot Pizza</h3>
            <a href="#" className="inline-flex items-center text-white text-sm mt-4 hover:text-yellow-400 transition-colors">
              Order Now <span className="ml-2">→</span>
            </a>
          </div>
          <div className="absolute top-[18px] right-[18px] z-20 flex items-center justify-center w-[60px] h-[60px] xl:w-[75px] xl:h-[75px] rounded-full border border-dashed border-[#FFC222] rotate-[-12deg]">
            <div className="text-center leading-none">
              <p className="text-[8px] xl:text-[10px] font-black uppercase text-white">UP TO</p>
              <p className="mt-0.5 text-[10px] xl:text-[13px] font-black uppercase text-[#FFC222] leading-none">SAVE</p>
              <p className="text-[11px] xl:text-[14px] font-black text-[#FFC222] leading-none">50%</p>
              <p className="mt-0.5 text-[8px] xl:text-[10px] font-black uppercase text-white">OFF</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-[3%] w-[150px] h-[112px] xl:w-[200px] xl:h-[150px] z-10">
            <img src={Pizza} alt="Pizza" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="relative rounded-xl overflow-hidden p-6 h-64 flex flex-col justify-between group bg-cover bg-center"
          style={{ backgroundImage: `url(${friesBG})` }}
        >
          <div className="relative z-10">
            <p className="text-white text-sm font-semibold mb-1"><span className="text-yellow-200">Today's</span> Delicious</p>
            <h3 className="text-white text-3xl font-bold leading-tight mb-2">French Fry</h3>
            <p className="text-white text-xs font-medium mb-4">This Weekend Only</p>
            <button className="bg-yellow-400 text-black px-4 py-2 text-sm font-bold rounded shadow-md hover:bg-yellow-300 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Order Now
            </button>
          </div>
          <div className="absolute bottom-0 right-2 w-[160px] h-[123px] xl:w-[220px] xl:h-[170px] z-10">
            <img src={Fries} alt="French Fries" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="relative rounded-xl overflow-hidden p-6 h-64 flex flex-col justify-between group bg-cover bg-center"
          style={{ backgroundImage: `url(${friedChikenBG})` }}
        >
          <div className="relative z-10">
            <p className="text-yellow-500 text-sm font-semibold mb-1">Crispy, Every Bite Taste</p>
            <h3 className="text-white text-3xl font-bold leading-tight">Chiken & <br /> French Fry</h3>
            <a href="#" className="inline-flex items-center text-white text-sm mt-4 hover:text-yellow-400 transition-colors">
              Order Now <span className="ml-2">→</span>
            </a>
          </div>
          <div className="absolute top-6 right-6 bg-yellow-500 text-white rounded-full w-11 h-11 xl:w-14 xl:h-14 flex items-center justify-center rotate-12 shadow-lg z-20">
            <div className="text-center leading-none">
              <span className="font-bold text-sm xl:text-lg">50%</span><br />
              <span className="text-[8px] xl:text-[10px] uppercase font-bold">Off</span>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-[160px] h-[123px] xl:w-[220px] xl:h-[170px] z-10">
            <img src={friedChiken} alt="Chicken & Fries" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoCards;