import React from 'react';

const leftItems = [
  { name: 'CHICAGO DEEP PIZZA', price: '$22.00' },
  { name: 'Chicago Burger King.', price: '$26.00' },
  { name: 'Chicago French Fries.', price: '$28.00' },
  { name: 'Chicago Beef Jerky.', price: '$39.00' },
];

const rightItems = [
  { name: 'CHINESE PASTA', price: '$34.00' },
  { name: 'Chicago Chicken Wings.', price: '$39.00' },
  { name: 'Chicago Deep Pasta.', price: '$34.00' },
  { name: 'Chicago Salad Recipes.', price: '$26.00' },
];

function MenuItem({ item }) {
  return (
    <li className="flex items-start justify-between gap-6 border-b border-dashed border-[#dcdcdc] pb-5 md:pb-8">
      <div className="min-w-0">
        <h3 className="text-[17px] font-black leading-none text-[#202020]">{item.name}</h3>
        <p className="mt-3 text-[14px] font-normal leading-tight text-[#777]">
          Its the perfect dining experience where Experience quick and efficient
        </p>
      </div>
      <span className="shrink-0 text-[18px] font-black leading-none text-[#ffae00]">{item.price}</span>
    </li>
  );
}

export default function TrendingMenu() {
  return (
    <section className="bg-white px-5 py-12 md:py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-[1280px] text-center">
        <span className="text-[14px] font-black leading-none text-[#00a84f]">About Our Food</span>
        <h2 className="mt-4 text-[42px] font-black leading-none text-[#252525] sm:text-[48px]">
          Trending Food Menu
        </h2>

        <div className="relative mt-12 rounded-xl border border-solid border-[#e5e5e5] px-6 py-12 text-left sm:px-12 lg:px-[70px] lg:py-[60px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-[80px] lg:gap-y-0">
            <ul className="space-y-6 md:space-y-[32px]">
              {leftItems.map((item) => (
                <MenuItem key={item.name} item={item} />
              ))}
            </ul>

            <ul className="space-y-6 md:space-y-[32px]">
              {rightItems.map((item) => (
                <MenuItem key={item.name} item={item} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}