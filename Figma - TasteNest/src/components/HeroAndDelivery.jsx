import React from 'react';
import deliveryMan from "../assets/delivery-man-2-1.png.png"
import Pizza from "../assets/big-pizza-1.png.png"
import Fries from "../assets/french-fry-2.png.png"
import friedChiken from "../assets/chicken-french.png.png"
import pizzaBG from "../assets/pizza-bg.png"
import friesBG from "../assets/fries-bg.png"
import friedChikenBG from "../assets/friedChiken-bg.png"
import playBG from "../assets/background.png"
import { Play, Truck } from 'lucide-react';
import { fromJSON } from 'postcss';

const HeroAndDelivery = () => {
  return (
    <>
      <div className="w-full bg-black font-sans text-white overflow-hidden">
            
            {/* 1. TOP HERO VIDEO/IMAGE SECTION */}
            <section className="relative w-full overflow-hidden">
      
        <img
          src={playBG}
          alt=""
          className="
            w-full
            h-auto
            object-contain
            block
          "
        />
      
        <div className="absolute inset-0 bg-black/20" />
      
        <button
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-20
            h-20
            md:w-24
            md:h-24
            rounded-full
            border
            border-dashed
            border-gray-400
            flex
            items-center
            justify-center
            hover:bg-white/10
            transition
          "
        >
          <svg
            className="w-6 h-6 text-[#ffcc00]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      
      </section>
      
            {/* 2. RED DELIVERY BANNER SECTION */}
            <section className="relative w-full bg-[#ef3a4b] px-6 py-10 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between">
              {/* Text Area */}
              <div className="flex-1 text-center md:text-left mb-16 md:mb-0 z-10">
                <p className="text-[#ffcc00] text-sm md:text-base font-semibold tracking-wider uppercase mb-2">
                  Crispy, Every Bite Taste
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  30 Minutes Fast <br />
                  <span className="text-[#ffcc00]">Delivery</span> Challenge
                </h2>
              </div>
      
              {/* Center 3D Scooter Image */}
              <div className="flex-1 flex justify-center relative z-20 mt-6 md:mt-0">
                {/* Using a negative margin to make the scooter pop out over the bottom edge slightly as seen in design */}
                <img 
                  src={deliveryMan} 
                  alt="Delivery Scooter" 
                  className="w-48 md:w-72 lg:w-80 object-contain -mb-8 md:-mb-12 drop-shadow-2xl hover:-translate-y-2 transition-transform duration-300"
                />
              </div>
      
              {/* Order Button Area */}
              <div className="flex-1 flex justify-center md:justify-end z-10 mt-8 md:mt-0">
                <button className="bg-white text-green-600 px-8 py-3 rounded-md shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                  <Truck className="w-5 h-5" />
                  Order Now
                </button>
              </div>
            </section>
      
      
          </div>
    </>
  );
};

export default HeroAndDelivery;