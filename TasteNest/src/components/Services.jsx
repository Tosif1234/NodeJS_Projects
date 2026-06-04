import burgerImage from '../assets/burger-3.png';

export default function Services() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <span className="text-red-600 uppercase tracking-widest text-xs font-bold block">Our Philosophy</span>
        <h2 className="text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
          Where Quality Meets <br /> Exceptional Service.
        </h2>
        <p className="text-neutral-600 leading-relaxed">
          We operate on a zero-compromise approach toward ingredient freshness, computational routing accuracy for rapid home-delivery times, and pristine sanitation guidelines.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            <h4 className="font-bold uppercase text-neutral-800 text-sm">100% Pure Organic</h4>
            <p className="text-neutral-500 text-xs mt-1">Farm sourced meats and veggies.</p>
          </div>
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            <h4 className="font-bold uppercase text-neutral-800 text-sm">Super Fast Delivery</h4>
            <p className="text-neutral-500 text-xs mt-1">Thorough thermal insulated transport.</p>
          </div>
        </div>
      </div>
      <div>
        <img src={burgerImage} alt="Chef Preparing Food" className="rounded-2xl shadow-xl w-full object-contain h-96 bg-neutral-950" />
      </div>
    </section>
  );
}
