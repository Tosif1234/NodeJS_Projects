import burgerImage from '../assets/burger-3.png';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-neutral-950 flex items-center justify-between pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.25),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.25),transparent_30%)]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center z-10">
        <div className="text-white space-y-6">
          <span className="text-amber-400 uppercase tracking-widest text-sm font-semibold block">Premium Quality</span>
          <h1 className="text-5xl sm:text-7xl font-extrabold uppercase tracking-tight leading-tight">
            The Best Food <br /> Collection <span className="text-amber-400">2026</span>
          </h1>
          <p className="text-neutral-300 max-w-md text-lg font-light tracking-wide">
            Experience culinary masterclasses brought straight to your doorstep. Hot, fresh, and unmatched flavors.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 uppercase tracking-wider rounded-md transition-all transform hover:-translate-y-0.5">
              Order Now
            </button>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-md backdrop-blur-sm">
              <span className="text-xs uppercase text-neutral-400 block">Delivery Hotline</span>
              <span className="text-amber-400 font-bold text-lg">+1 234 567 890</span>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          {/* Highlight Promo Badge */}
          <div className="absolute top-4 right-10 sm:right-20 bg-red-600 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold tracking-tight transform rotate-12 shadow-2xl animate-pulse border-4 border-amber-400 z-20">
            <span className="text-xl">20%</span>
            <span className="text-xs uppercase">OFF</span>
          </div>
          <img 
            src={burgerImage}
            alt="Signature Dish" 
            className="w-4/5 object-contain drop-shadow-2xl transform hover:rotate-6 transition duration-700"
          />
        </div>
      </div>
    </section>
  );
}
