import { useState } from 'react';
import burgerImage from '../assets/burger-3.png';

export default function Categories() {
  const categories = ['Pizza', 'Burgers', 'Sides', 'Drinks'];
  const [active, setActive] = useState('Pizza');

  return (
    <section className="bg-neutral-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-red-600 uppercase tracking-widest text-xs font-bold block mb-2">Our Menu</span>
        <h2 className="text-3xl font-extrabold uppercase tracking-wide text-neutral-900 mb-8">Hot Delicious Item</h2>
        
        <div className="flex justify-center space-x-2 md:space-x-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-6 py-2.5 rounded-full uppercase tracking-wider text-sm font-semibold transition ${
                active === cat ? 'bg-amber-500 text-black shadow-lg' : 'bg-white text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Display Container Row Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-center border border-neutral-100">
              <img src={burgerImage} alt="Item" className="w-24 h-24 mx-auto object-contain rounded-full mb-4" />
              <h4 className="font-bold uppercase text-neutral-800">Classic Custom {active}</h4>
              <p className="text-amber-500 font-bold mt-1">$9.45</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
