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
    <li className="flex items-start justify-between gap-5 border-b border-dashed border-[#bdbdbd] pb-[22px]">
      <div className="min-w-0">
        <h3 className="text-[13px] font-black leading-none text-[#202020]">{item.name}</h3>
        <p className="mt-2 text-[10px] font-normal leading-none text-[#555]">
          Its the perfect dining experience where Experience quick and efficient
        </p>
      </div>
      <span className="shrink-0 text-[12px] font-black leading-none text-[#ffae00]">{item.price}</span>
    </li>
  );
}

export default function TrendingMenu() {
  return (
    <section className="bg-white px-5 pb-[74px] pt-12 sm:px-8 lg:pt-[42px]">
      <div className="mx-auto max-w-[890px] text-center">
        <span className="text-[11px] font-black leading-none text-[#00a84f]">About Our Food</span>
        <h2 className="mt-3 text-[38px] font-black leading-none text-[#252525] sm:text-[43px]">
          Trending Food Menu
        </h2>

        <div className="relative mt-5 rounded-lg border border-dashed border-[#bdbdbd] px-6 py-10 text-left sm:px-10 lg:px-[58px] lg:py-[48px]">
          <span className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-[13px] font-black text-[#f6268d] lg:block">
            +
          </span>

          <div className="grid gap-9 lg:grid-cols-2 lg:gap-[78px]">
            <ul className="space-y-[28px]">
              {leftItems.map((item) => (
                <MenuItem key={item.name} item={item} />
              ))}
            </ul>

            <ul className="space-y-[28px]">
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
