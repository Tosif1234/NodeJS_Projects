export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-neutral-800 pb-12">
        
        {/* Branch Box 1 */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-wider text-amber-400">FOODMUNCH</h3>
          <p className="text-neutral-400 text-sm tracking-wide leading-relaxed">
            Premium gourmet dining experience items brought right out straight to clean home delivery spaces.
          </p>
        </div>

        {/* Branch Box 2 */}
        <div>
          <h4 className="text-amber-400 font-bold uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-neutral-400 uppercase tracking-wide">
            <li><a href="#" className="hover:text-white transition">About Our Story</a></li>
            <li><a href="#" className="hover:text-white transition">Our Culinary Team</a></li>
            <li><a href="#" className="hover:text-white transition">Latest News Blog</a></li>
            <li><a href="#" className="hover:text-white transition">Reservation Portal</a></li>
          </ul>
        </div>

        {/* Branch Box 3 */}
        <div>
          <h4 className="text-amber-400 font-bold uppercase tracking-wider mb-4">Hours Available</h4>
          <ul className="space-y-2 text-sm text-neutral-400 font-light tracking-wide">
            <li>Monday - Friday: <span className="text-white font-medium">09:00 - 22:00</span></li>
            <li>Saturday: <span className="text-white font-medium">10:00 - 23:00</span></li>
            <li>Sunday: <span className="text-white font-medium">11:00 - 21:00</span></li>
          </ul>
        </div>

        {/* Branch Box 4 */}
        <div>
          <h4 className="text-amber-400 font-bold uppercase tracking-wider mb-4">Newsletter</h4>
          <p className="text-xs text-neutral-400 mb-3 tracking-wide">Subscribe for instant deal alerts updates.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400 w-full rounded-l-md"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 rounded-r-md uppercase tracking-wider text-xs">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 uppercase tracking-widest gap-4">
        <p>© 2026 FoodMunch Landing. All Rights Reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}
