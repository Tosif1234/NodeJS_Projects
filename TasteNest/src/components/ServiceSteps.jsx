export default function ServicesSteps() {
  const steps = [
    { num: "01", title: "Select Food", desc: "Browse our expansive menu options catalog." },
    { num: "02", title: "Instant Payment", desc: "Secure encrypted transaction clearing options." },
    { num: "03", title: "Fast Delivery", desc: "Dispatched under optimal thermal control." }
  ];

  return (
    <section className="bg-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-red-600 uppercase tracking-widest text-xs font-bold block mb-2">How We Serve You</span>
        <h2 className="text-3xl font-extrabold uppercase tracking-wide text-neutral-900 mb-12">Simple Steps Process</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200/60 text-center relative group hover:-translate-y-1 transition duration-300">
              <span className="text-4xl font-black text-amber-400/30 absolute top-4 right-6 group-hover:text-amber-400 transition">{s.num}</span>
              <h3 className="text-xl font-bold uppercase text-neutral-800 mb-2 mt-4">{s.title}</h3>
              <p className="text-neutral-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
