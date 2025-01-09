import React, { useState } from "react";
import logo from '../assets/Logo.png';
import './common.css';
import { Icon } from "@iconify/react/dist/iconify.js";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#FBF8EF] shadow-md hover:shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/">
              <img src={logo} alt="Logo" className="h-16" />
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-12">
            {/* <a
              href="#book-cab"
              className="text-gray-700 text-md font-semibold hover:text-blue-600 transition-all duration-300"
            >
              Home
            </a>
            <a
              href="#about-us"
              className="text-gray-700 text-md font-semibold hover:text-blue-600 transition-all duration-300"
            >
              About Us
            </a>
            <a
              href="#contact"
              className="text-gray-700 text-md font-semibold hover:text-blue-600 transition-all duration-300"
            >
              Contact
            </a> */}
            
          </div>

          {/* Mobile Menu Button */}
          {/* <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className={`h-8 w-8 transform ${
                  isMenuOpen ? "rotate-90" : ""
                } transition-transform duration-300`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Menu */}
      {/* <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-gray-100 shadow-md`}
      >
        <a
          href="#book-cab"
          className="block text-gray-700 text-sm font-semibold px-4 py-2 hover:bg-gray-200 transition-all duration-300"
        >
          Home
        </a>
        <a
          href="#about-us"
          className="block text-gray-700 text-sm font-semibold px-4 py-2 hover:bg-gray-200 transition-all duration-300"
        >
          About Us
        </a>
        <a
          href="#contact"
          className="block text-gray-700 text-sm font-semibold px-4 py-2 hover:bg-gray-200 transition-all duration-300"
        >
          Contact
        </a>
        <a
          href="#login"
          className="block navbutton text-center px-4 py-2"
        >
          Book a Cab
        </a>
      </div> */}
    </nav>
  );
};

export default Navbar;
