import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faTicketAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import cab3d from "../assets/header/cab3d.avif";
import {
  faCalendar,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import CarsSpecification from "./CarsSpecification";




const Header = () => {
  return (
    <section
      className="light py-14 md:py-20 md:h-[50%] bg-white text-zinc-900 dark:text-white relative overflow-hidden z-10 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://cdn.easyfrontend.com/pictures/hero/header35-img.png)",
      }}

    
    >
      <div className="container px-4 mx-auto mb-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center md:p-10">
            <h2 className="font-bold text-[36px] md:text-[70px] mb-6 leading-tight">
              Start Your Journey
            </h2>
            <p className="text-[18px] leading-[30px] opacity-80 mb-4">
              Whether you're planning a business trip, visiting loved ones, or
              just exploring the city, our reliable cab services are here to
              make your ride comfortable, safe, and hassle-free. Enjoy
              door-to-door service at your fingertips.
            </p>
            <p className="text-[18px] leading-[30px] opacity-80">
              Book your cab now and let us handle the rest. Sit back, relax, and
              experience the smoothest journey to your destination.
            </p>
          </div>
         
        </div>
       {/* <div className="h-32">
       <OrderForm />
       </div> */}
      </div>

      {/* Shape Divider at the Bottom */}
      <div className="custom-shape-divider-bottom-1735804367 ">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,
               82.39-16.72,168.19-17.73,250.45-.39C823.78,31,
               906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,
               214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <style>{`.custom-shape-divider-bottom-1735804367 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
}

.custom-shape-divider-bottom-1735804367 svg {
  position: relative;
  display: block;
  width: calc(140% + 1.3px);
  height: 142px;
}

.custom-shape-divider-bottom-1735804367 .shape-fill {
  fill: #ffffff; /* Adjust as needed */
}
`}</style>
    </section>
  );
};

export default Header;
