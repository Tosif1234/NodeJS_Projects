import { useState } from "react";
import NavLogo from "../assets/TesteNest.png";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex-shrink-0 flex items-center">
          <img src={NavLogo} alt="Logo" />
        </div>

        <div className="hidden xl:flex items-center gap-[24px] font-medium text-[17px] text-[#2B2B2B]">
          <a href="#" className="flex items-center gap-1">
            Home
            <ChevronDown size={15} strokeWidth={2.5} className="mt-[2px]" />
          </a>

          <a href="#" className="hover:text-rose-600 transition-colors">
            About Us
          </a>

          <a href="#" className="flex items-center gap-1">
            Shop
            <ChevronDown size={15} strokeWidth={2.5} className="mt-[2px]" />
          </a>

          <a href="#" className="flex items-center gap-1">
            Blog
            <ChevronDown size={15} strokeWidth={2.5} className="mt-[2px]" />
          </a>

          <a href="#" className="flex items-center gap-1">
            Pages
            <ChevronDown size={15} strokeWidth={2.5} className="mt-[2px]" />
          </a>

          <a href="#" className="hover:text-rose-600 transition-colors">
            Contact
          </a>
        </div>
        <div className="flex items-center">
          {/* Desktop Only Buttons */}
          <div className="hidden xl:flex items-center space-x-4 mr-4">
            <button className="p-2 text-gray-600 hover:text-rose-600 transition-colors relative">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute top-1 right-1 bg-amber-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
              Order Now
            </button>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 text-gray-600 hover:text-rose-600 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 px-4 pt-4 pb-6 space-y-3 shadow-lg transition-all duration-300">
          <a href="#" className="flex items-center justify-between py-2 text-[17px] font-medium text-[#2B2B2B] hover:text-rose-600 transition-colors">
            Home
            <ChevronDown size={15} strokeWidth={2.5} />
          </a>
          <a href="#" className="block py-2 text-[17px] font-medium text-[#2B2B2B] hover:text-rose-600 transition-colors">
            About Us
          </a>
          <a href="#" className="flex items-center justify-between py-2 text-[17px] font-medium text-[#2B2B2B] hover:text-rose-600 transition-colors">
            Shop
            <ChevronDown size={15} strokeWidth={2.5} />
          </a>
          <a href="#" className="flex items-center justify-between py-2 text-[17px] font-medium text-[#2B2B2B] hover:text-rose-600 transition-colors">
            Blog
            <ChevronDown size={15} strokeWidth={2.5} />
          </a>
          <a href="#" className="flex items-center justify-between py-2 text-[17px] font-medium text-[#2B2B2B] hover:text-rose-600 transition-colors">
            Pages
            <ChevronDown size={15} strokeWidth={2.5} />
          </a>
          <a href="#" className="block py-2 text-[17px] font-medium text-[#2B2B2B] hover:text-rose-600 transition-colors">
            Contact
          </a>
          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <button className="flex items-center justify-center gap-2 p-2.5 text-gray-600 hover:text-rose-600 transition-colors border border-gray-200 rounded-full relative">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="font-semibold text-sm">Cart (3)</span>
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm py-2.5 rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 text-center">
              Order Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
