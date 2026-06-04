import burgerImage from '../assets/burger-3.png';

export default function MenuGrid() {
  return (
    <section className="grid md:grid-cols-3 max-w-full">
      <div className="relative group h-80 bg-black overflow-hidden">
        <img src={burgerImage} alt="Pizza" className="w-full h-full object-contain opacity-80 group-hover:scale-105 transition duration-500" />
        <div className="absolute inset-0 bg-neutral-900/40 p-8 flex flex-col justify-end text-white">
          <h3 className="text-2xl font-bold uppercase tracking-wider">Special Pizza</h3>
          <p className="text-amber-400 font-semibold">$14.00</p>
        </div>
      </div>
      <div className="relative group h-80 bg-black overflow-hidden bg-gradient-to-br from-amber-500 to-amber-700 p-8 flex flex-col justify-between text-black">
        <span className="bg-black text-white text-xs px-3 py-1 uppercase tracking-widest font-bold self-start rounded-full">Hot Deal</span>
        <div>
          <h3 className="text-3xl font-extrabold uppercase tracking-tight">Crispy Garlic Fries</h3>
          <p className="font-bold text-xl mt-1">$4.99</p>
        </div>
      </div>
      <div className="relative group h-80 bg-black overflow-hidden">
        <img src={burgerImage} alt="Wings" className="w-full h-full object-contain opacity-80 group-hover:scale-105 transition duration-500" />
        <div className="absolute inset-0 bg-neutral-900/40 p-8 flex flex-col justify-end text-white">
          <h3 className="text-2xl font-bold uppercase tracking-wider">Super Delicious Chicken</h3>
          <p className="text-amber-400 font-semibold">$11.50</p>
        </div>
      </div>
    </section>
  );
}
