export default function TrendingMenu() {
  const items = [
    { name: "Spicy Beef Burger", price: "$8.50" },
    { name: "BBQ Chicken Pizza", price: "$14.00" },
    { name: "Mozzarella Sticks", price: "$5.50" },
    { name: "Vegan Garden Salad", price: "$7.25" },
    { name: "Creamy Carbonara", price: "$12.00" },
    { name: "Chocolate Lava Cake", price: "$6.00" }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-red-600 uppercase tracking-widest text-xs font-bold block mb-2">Top Picks</span>
        <h2 className="text-3xl font-extrabold uppercase tracking-wide text-neutral-900">Trending Menu Items</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-baseline border-b border-dashed border-neutral-300 pb-3">
            <div>
              <h4 className="font-bold uppercase text-neutral-800 text-lg tracking-wide">{item.name}</h4>
              <p className="text-neutral-500 text-xs mt-1">Fresh ingredients beautifully balanced.</p>
            </div>
            <span className="text-xl font-bold text-amber-500 tracking-tight">{item.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
