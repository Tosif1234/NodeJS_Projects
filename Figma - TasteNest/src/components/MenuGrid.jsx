import React from 'react';
import burger from "../assets/About-us/burger.png";
import fries from "../assets/About-us/fries.png";
import pizza from "../assets/About-us/pizza.png";
import legPiece from "../assets/About-us/LegPiece.png";
import bg from "../assets/bg-main-grey.png";

const MenuGrid = () => {
  return (
    // Outer container with white background and explicit horizontal padding
    // This creates the distinct "white space outside the section" on all screen sizes.
    <section className="w-full bg-white py-16 pb-0 px-4 md:px-6 lg:px-24 font-sans flex justify-center">
      
      {/* Inner container with the gray patterned background */}
      {/* Fixed width structure to match the boxy layout in your design */}
      <div className="w-full max-w-[1300px] relative overflow-hidden py-12 md:py-20 px-4 sm:px-8 shadow-sm"style={{ backgroundImage: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} >
        
        <div 
          className="absolute inset-0  pointer-events-none" 
          
        ></div>
        
        {/* Content wrapper relative to stay above the pattern */}
        <div className="relative z-10 w-full mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <p className="text-[#00a850] font-bold text-[13px] tracking-wide mb-3">About Our Food</p>
            <h2 className="text-[2.5rem] md:text-[3.2rem] font-black text-[#222] tracking-tight leading-none">
              Hot Delicious Item
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3.5 mb-16">
            <button className="bg-[#ffc222] text-[#111] font-bold px-8 py-2.5 rounded-full text-[14.5px] transition-transform hover:-translate-y-0.5">
              Chicken Fry
            </button>
            <button className="bg-transparent text-[#333] font-semibold px-8 py-2.5 rounded-full text-[14.5px] border border-gray-200 hover:border-gray-300 hover:bg-white transition-all">
              Pizza
            </button>
            <button className="bg-transparent text-[#333] font-semibold px-8 py-2.5 rounded-full text-[14.5px] border border-gray-200 hover:border-gray-300 hover:bg-white transition-all">
              Burger
            </button>
            <button className="bg-transparent text-[#333] font-semibold px-8 py-2.5 rounded-full text-[14.5px] border border-gray-200 hover:border-gray-300 hover:bg-white transition-all">
              Deserts
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            
            {/* Item 1 */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="h-[200px] w-full flex justify-center items-center mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                <img src={pizza} alt="Chicago Deep Pizza" className="max-h-full max-w-[85%] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]" />
              </div>
              <h4 className="text-[20px] font-black text-[#222] uppercase mb-2">Chicago Deep Pizza.</h4>
              <p className="text-[11px] text-gray-500 font-medium leading-[1.6] max-w-[210px]">
                Its the perfect dining experience where <br /> Experience quick and efficient
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="h-[200px] w-full flex justify-center items-center mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                <img src={fries} alt="FAST FOOD COMBO" className="max-h-full max-w-[95%] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]" />
              </div>
              <h4 className="text-[20px] font-black text-[#222] uppercase mb-2">FAST FOOD COMBO</h4>
              <p className="text-[11px] text-gray-500 font-medium leading-[1.6] max-w-[210px]">
                Its the perfect dining experience where <br /> Experience quick and efficient
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="h-[200px] w-full flex justify-center items-center mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                <img src={legPiece} alt="GRILLED CHICKEN" className="max-h-full max-w-[85%] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]" />
              </div>
              <h4 className="text-[20px] font-black text-[#222] uppercase mb-2">GRILLED CHICKEN</h4>
              <p className="text-[11px] text-gray-500 font-medium leading-[1.6] max-w-[210px]">
                Its the perfect dining experience where <br /> Experience quick and efficient
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="h-[200px] w-full flex justify-center items-center mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                <img src={burger} alt="WHOPPER BURGER KING" className="max-h-full max-w-[85%] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)]" />
              </div>
              <h4 className="text-[20px] font-black text-[#222] uppercase mb-2">WHOPPER BURGER KING</h4>
              <p className="text-[11px] text-gray-500 font-medium leading-[1.6] max-w-[210px]">
                Its the perfect dining experience where <br /> Experience quick and efficient
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuGrid;