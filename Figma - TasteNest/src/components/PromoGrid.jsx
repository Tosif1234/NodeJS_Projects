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
const PromoGrid = () => {
  return (
    <div className="w-full bg-black font-sans text-white overflow-hidden">

            {/* 3. PROMO GRID SECTION */}
            <section className="w-full flex flex-col lg:flex-row h-auto lg:h-[600px]">
            
            {/* Left Large Panel (Pizza) */}
            <div 
              className="w-full lg:w-1/2 h-[500px] lg:h-full relative p-8 md:p-12 flex flex-col items-center bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${pizzaBG})` }}
            >
              {/* Background Texture Overlay (Optional) */}
              <div className="absolute inset-0 opacity-20 bg-[url('/path/to/dark-texture.jpg')] mix-blend-overlay"></div>
              
              <div className="relative z-10 text-center mt-8">
                <p className="text-gray-300 text-lg md:text-xl font-medium tracking-wide">Today</p>
                <h3 className="text-4xl md:text-5xl font-bold mt-1 mb-2">Special Delicious</h3>
                <p className="text-xl md:text-2xl font-semibold">
                  Beef <span className="text-[#ffcc00] font-serif italic font-normal">chiness</span> Pizza
                </p>
              </div>
      
              {/* 50% Off Badge */}
              <div className="absolute right-8 md:right-24 top-48 md:top-56 z-20 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-gray-400 flex flex-col items-center justify-center rotate-12">
                <span className="text-[10px] md:text-xs text-gray-300 uppercase">Up To</span>
                <span className="text-xl md:text-2xl font-bold text-[#ffcc00] leading-none">50%</span>
                <span className="text-[10px] md:text-xs text-gray-300">OFF</span>
              </div>
      
              <img 
                src={Pizza}
                alt="Delicious Pizza" 
                className="relative z-10 w-full max-w-md mt-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
      
            {/* Right 2x2 Grid Panel */}
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 h-auto sm:h-[800px] lg:h-full">
              
              {/* Top Left: Burger Combo */}
              <div className="bg-[#8b1c1c] p-8 flex flex-col justify-center relative overflow-hidden group h-[300px] sm:h-auto" >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="relative z-10">
                  <p className="text-[#ffcc00] text-sm font-semibold mb-1">Delicious</p>
                  <h4 className="text-3xl font-bold mb-2">Burger Combo</h4>
                  <p className="text-xs text-gray-300 uppercase tracking-widest mb-4">This Weekend Only</p>
                  <p className="text-sm mb-6">Limited Offer / <span className="text-2xl font-bold">$5</span></p>
                  <button className="bg-[#ffcc00] text-black px-6 py-2 font-bold text-sm rounded shadow hover:bg-yellow-400 transition-colors">
                    Order Now
                  </button>
                </div>
              </div>
      
              {/* Top Right: Super Delicious */}
              <div className="bg-[#111] p-8 flex flex-col justify-center relative overflow-hidden h-[300px] sm:h-auto" style={{ backgroundImage: `url(${pizzaBG})` }}>
                {/* Brick background texture */}
                <div className="absolute inset-0 opacity-40 bg-[url('/path/to/brick-wall.jpg')] bg-cover mix-blend-luminosity"></div>
                <div className="relative z-10">
                  <p className="text-[#ffcc00] text-sm font-semibold mb-2">Crispy, Every Bite Taste</p>
                  <h4 className="text-3xl font-bold uppercase leading-tight mb-6">Super<br/>Delicious</h4>
                  <div className="w-16 h-16 rounded-full border-2 border-white flex flex-col items-center justify-center -rotate-12">
                    <span className="text-xl font-bold leading-none">50%</span>
                    <span className="text-xs">OFF</span>
                  </div>
                </div>
              </div>
      
              {/* Bottom Left: Fast Food Meal (Fries) */}
              <div 
                className="p-8 flex flex-col justify-between relative overflow-hidden bg-cover bg-center bg-no-repeat h-[300px] sm:h-auto"
                style={{ backgroundImage: `url(${friesBG})` }}
              >
                 <div className="relative z-10">
                  <p className="text-white/80 text-xs font-semibold mb-1">Crispy, Every Bite Taste</p>
                  <h4 className="text-4xl font-bold uppercase leading-none mb-2 shadow-sm">Fast Food<br/>Meal</h4>
                  <p className="text-[10px] text-white/90 w-2/3 mb-4 leading-tight">
                    The mouth-watering aroma of sizzling burgers
                  </p>
                  <button className="bg-[#ffcc00] text-black px-6 py-2 font-bold text-sm rounded shadow hover:bg-yellow-400 transition-colors">
                    Order Now
                  </button>
                </div>
                {/* Fries Image bottom right */}
                <img 
                  src={Fries} 
                  alt="French Fries" 
                  className="absolute right-0 bottom-0 w-36 md:w-44 object-contain drop-shadow-xl"
                />
              </div>
      
              {/* Bottom Right: Fried Chicken */}
              <div 
                className="p-8 flex flex-col items-center justify-end relative overflow-hidden bg-cover bg-center bg-no-repeat h-[300px] sm:h-auto"
                style={{ backgroundImage: `url(${friedChikenBG})` }}
              >
                {/* Wood floor texture */}
                <div className="absolute inset-0 top-1/2 opacity-50 bg-[url('/path/to/wood-table.jpg')] bg-cover mix-blend-overlay"></div>
                
                <div className="relative z-10 text-center w-full mb-auto mt-4">
                   <h4 className="text-[#ffcc00] text-3xl font-bold uppercase transform -skew-y-3 leading-none drop-shadow-md">
                     <span className="text-white text-lg block -mb-2 skew-y-3 font-serif italic capitalize">Delicious Fried</span>
                     Chicken
                   </h4>
                   <p className="text-white text-xs mt-2 italic font-serif">Limited Offer</p>
                </div>
      
                <img 
                  src={friedChiken} 
                  alt="Fried Chicken" 
                  className="relative z-10 w-full max-w-[200px] object-contain drop-shadow-2xl"
                />
              </div>
      
            </div>
          </section>
      
          </div>
  );
};

export default PromoGrid;