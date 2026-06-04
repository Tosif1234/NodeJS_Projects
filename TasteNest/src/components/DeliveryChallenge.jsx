export default function DeliveryChallenge() {
  return (
    <section className="bg-red-600 text-white py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider">
            30 Minutes Fast <br className="hidden sm:inline" /> Delivery Challenge!
          </h2>
          <p className="text-red-100 text-sm tracking-wide mt-2">If we’re late, your meal is absolutely free.</p>
        </div>
        <button className="bg-white text-red-600 font-bold px-8 py-3.5 rounded-full uppercase tracking-widest text-sm shadow-xl hover:bg-neutral-100 transition">
          Call Now
        </button>
      </div>
    </section>
  );
}
