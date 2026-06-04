import burgerImage from '../assets/burger-3.png';

export default function Blog() {
  const blogs = [
    { title: "Secrets Behind True Neapolitan Dough", date: "May 20, 2026", img: burgerImage },
    { title: "Why Organic Farm Herbs Change Everything", date: "May 14, 2026", img: burgerImage },
    { title: "Safe Fast Delivery Logistical Methods", date: "May 02, 2026", img: burgerImage }
  ];

  return (
    <section className="bg-neutral-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-600 uppercase tracking-widest text-xs font-bold block mb-2">Our News Feed</span>
          <h2 className="text-3xl font-extrabold uppercase tracking-wide text-neutral-900">Update News & Blog</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 group">
              <div className="h-48 overflow-hidden relative">
                <img src={b.img} alt={b.title} className="w-full h-full object-contain bg-neutral-950 group-hover:scale-105 transition duration-500" />
                <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  {b.date}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold uppercase text-neutral-800 text-lg group-hover:text-red-600 transition cursor-pointer leading-tight">
                  {b.title}
                </h3>
                <p className="text-neutral-500 text-sm mt-2 line-clamp-2">Exploring techniques, materials, and steps used to create amazing standard-setting cuisine daily.</p>
                <span className="text-red-600 text-xs uppercase tracking-wider font-bold inline-block mt-4 cursor-pointer hover:underline">Read Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
