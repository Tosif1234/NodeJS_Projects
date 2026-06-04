import burgerImage from '../assets/burger-3.png';

export default function PromoCards() {
  const promos = [
    { title: "Delicious Pizza", tag: "Hot & Spicy", img: burgerImage },
    { title: "Crunchy French Fries", tag: "Fresh & Crispy", img: burgerImage },
    { title: "Crispy Fried Chicken", tag: "Juicy & Tender", img: burgerImage }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30 grid sm:grid-cols-3 gap-6">
      {promos.map((p, idx) => (
        <div key={idx} className="relative group overflow-hidden rounded-xl shadow-xl h-48 bg-neutral-900">
          <img src={p.img} alt={p.title} className="w-full h-full object-contain opacity-80 group-hover:scale-110 transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end">
            <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-1">{p.tag}</span>
            <h3 className="text-white text-xl font-bold uppercase tracking-wide">{p.title}</h3>
          </div>
        </div>
      ))}
    </section>
  );
}
