import React, { useEffect, useState, useRef } from "react";
import bgimage from "../assets/header/bg1.jpg";
import { Icon } from "@iconify/react/dist/iconify.js";
const Numbers = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true); // Start the animation when the section is visible
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="light py-24 md:py-24 text-white bg-cover bg-top bg-no-repeat relative overflow-hidden z-[1]"
      style={{
        backgroundImage: `url(${bgimage})`,
        backgroundPosition: "center",
      }}
    >
      <div className="absolute top-0 right-0 bottom-0 left-0 -z-[1]" />
      <div className="container px-4">
        <div className="flex justify-between items-center">
          {/* Text on the Left */}
          <div className="text-left">
            <h2 className="font-bold text-[36px] md:text-[35px] leading-tight mb-4">
              Incredible Destinations at Incredible Deals
            </h2>
            <p className="text-lg opacity-80">
              Discover a wide range of destinations with unbeatable prices.
              Explore the world with ease.
            </p>
          </div>

          {/* Button on the Right */}
          <div className="text-right">
            <button
              type="submit"
              aria-label="Submit"
              className="navbutton py-3 px-8 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              Book Now{" "}
              <Icon icon="mdi:arrow-right-thin" width="24" height="24" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Numbers;
