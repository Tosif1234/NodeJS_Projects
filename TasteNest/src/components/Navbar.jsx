import NavLogo from '../assets/TesteNest.png' 

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex-shrink-0 flex items-center">
          <img src={NavLogo} alt="Logo" />
        </div>
        <div className="hidden md:flex space-x-8 font-medium text-sm text-gray-700 tracking-wide">
          <a href="#" className="text-rose-600 transition-colors">Home</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Pages</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Menu</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Blog</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Contact</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-rose-600 transition-colors relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span className="absolute top-1 right-1 bg-amber-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">3</span>
          </button>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
            Order Now
          </button>
        </div>
      </div>
    </nav>
  );
}
