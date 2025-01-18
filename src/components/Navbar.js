// import React, { useState } from "react";
// import logo from '../assets/Logo.png';
// import './common.css';
// import { useNavigate } from "react-router-dom";

// import { Icon } from "@iconify/react/dist/iconify.js";
// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const navigate = useNavigate();


//   const goBack = () => {
//     navigate("/passangers"); // Go back to the previous page
//   };

//   return (
//     <nav className="bg-[#FBF8EF] shadow-md hover:shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-24">
//           {/* Logo Section */}
//           <div className="flex items-center">
//             <a href="/">
//               <img src={logo} alt="Logo" className="h-16" />
//             </a>
//             <button
//         onClick={goBack}
//         className="py-2 px-6 bg-red-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg shadow-lg transition duration-200"
//       >
//         Go Back
//       </button>
//           </div>



//           {/* Desktop Links */}
//           <div className="hidden md:flex items-center space-x-12">
//             {/* <a
//               href="#book-cab"
//               className="text-gray-700 text-md font-semibold hover:text-blue-600 transition-all duration-300"
//             >
//               Home
//             </a>
//             <a
//               href="#about-us"
//               className="text-gray-700 text-md font-semibold hover:text-blue-600 transition-all duration-300"
//             >
//               About Us
//             </a>
//             <a
//               href="#contact"
//               className="text-gray-700 text-md font-semibold hover:text-blue-600 transition-all duration-300"
//             >
//               Contact
//             </a> */}
            
//           </div>

//           {/* Mobile Menu Button */}
//           {/* <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-700 focus:outline-none"
//             >
//               <svg
//                 className={`h-8 w-8 transform ${
//                   isMenuOpen ? "rotate-90" : ""
//                 } transition-transform duration-300`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16m-7 6h7"
//                 />
//               </svg>
//             </button>
//           </div> */}
//         </div>
//       </div>

     
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState } from "react";
import logo from '../assets/Logo.png';
import './common.css';
import { useNavigate } from "react-router-dom";

import { Icon } from "@iconify/react/dist/iconify.js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/passangers"); // Go back to the previous page
  };

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

          {/* Spacer to push the button to the right */}
          <div className="flex-grow"></div>

          {/* Go Back Button */}
          <button
            onClick={goBack}
            className="py-2 px-6 bg-teal-500 text-white font-semibold hover:bg-teal-600 text-lg  rounded-lg shadow-lg transition duration-200"
          >
           My Bookings
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
