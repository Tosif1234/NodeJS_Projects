import burgerImage from '../assets/burger-3.png';

export default function BannerPizza() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div className="relative">
        <img 
          src={burgerImage}
          alt="Premium Cheese Pizza" 
          className="rounded-2xl shadow-2xl object-contain w-full h-[400px] bg-neutral-950"
        />
      </div>
      <div className="space-y-6">
        <span className="text-red-600 uppercase tracking-widest text-sm font-bold block">Chef's Special</span>
        <h2 className="text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
          The Best Delicious Food Made From Us
        </h2>
        <p className="text-neutral-600 leading-relaxed">
          Crafted with organic hand-milled flour, fresh mozzarella pulled daily, and heirloom tomatoes slow-simmered with Italian herbs.
        </p>
        <div className="grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6">
          <div>
            <span className="block text-2xl font-bold text-amber-500">$12.99</span>
            <span className="text-xs uppercase tracking-wider text-neutral-500">Reg. Pizza</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-amber-500">$18.99</span>
            <span className="text-xs uppercase tracking-wider text-neutral-500">Medium Pizza</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-amber-500">$24.99</span>
            <span className="text-xs uppercase tracking-wider text-neutral-500">Large Pizza</span>
          </div>
        </div>
      </div>
    </section>
  );
}
