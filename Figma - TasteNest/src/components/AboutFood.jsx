import React from 'react';
import BigPizza from "../assets/pizza.jpg.png";

const AboutFood = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Image with Overlapping Box */}
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
          <img
            src={BigPizza}
            alt="Cheese Pull Pizza"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
          <div className="absolute -bottom-4 right-0 bg-[#ffc222] p-5 sm:p-[30px] max-w-[200px] sm:max-w-[275px] shadow-xl z-10 rounded-[5px]">
            <h4 className="text-black text-sm sm:text-xl font-black font-oswald">We Cook Sandwiches For You</h4>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="space-y-6 text-center lg:text-left lg:pl-10 flex flex-col items-center lg:items-start">
          <div className="w-full">
            <p className="text-green-600 font-bold text-sm tracking-wide mb-2 uppercase">About Our Food</p>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-[1.1] uppercase">
              The Best Delicious Food Made From Us...
            </h2>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed max-w-[600px] lg:max-w-none">
            Its the perfect dining experience where every dish is crafted with fresh, high-quality dining experience
            Experience quick and efficient service that ensures your food is servead fresh Its the where every dining
            experience where every dish is crafted with fresh, high-quality ingredients fresh, high-quality
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-4 pt-6 border-t border-gray-200 mt-8 w-full">
            <div className="relative text-center lg:text-left">
              <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-2 -top-6 text-6xl font-bold text-gray-100 -z-10 select-none">01</div>
              <p className="text-xs font-bold text-gray-900 mb-1">Satsified Clients</p>
              <p className="text-3xl font-black text-yellow-500">250+</p>
            </div>
            <div className="relative text-center lg:text-left border-l-0 lg:border-l border-gray-200 pl-0 lg:pl-4">
              <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-2 -top-6 text-6xl font-bold text-gray-100 -z-10 select-none">02</div>
              <p className="text-xs font-bold text-gray-900 mb-1">Total Food Catagories</p>
              <p className="text-3xl font-black text-yellow-500">153+</p>
            </div>
            <div className="relative text-center lg:text-left border-l-0 lg:border-l border-gray-200 pl-0 lg:pl-4">
              <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-2 -top-6 text-6xl font-bold text-gray-100 -z-10 select-none">03</div>
              <p className="text-xs font-bold text-gray-900 mb-1">Awward Win</p>
              <p className="text-3xl font-black text-yellow-500">25+</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-6 mt-4 w-full">
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="CEO Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="font-[cursive] text-2xl text-gray-800 -rotate-3">Aenimus</div>
            </div>
            <div className="bg-[#1f1f1f] text-white px-6 py-3 rounded-full text-xs font-medium tracking-wide shadow-lg">
              Foundation, Since <span className="text-yellow-500 font-bold">21st</span> Oct , 2019
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFood;