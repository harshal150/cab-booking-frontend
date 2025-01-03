import React from "react";
import review from "../assets/featuressection/review.avif";
import fares from "../assets/featuressection/fares.avif";
import rental from "../assets/featuressection/rentalexpert.avif";

const FeaturesSection = () => {
  const features = [
    {
      icon: rental,
      head:"Car Rental Experts",
      title: "Since 2006",
      hoverColor: "hover:bg-green-100",
    },
    {
      icon: review,
      head:"Google Reviews",
      title: "Rated 4.5/5",
      hoverColor: "hover:bg-red-100",
    },
    {
      icon: fares,
      head:"Fares from",
      title: "₹9/km",
      hoverColor: "hover:bg-violet-100",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-white mx-auto rounded-lg shadow-lg cursor-pointer">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-6 transition-all duration-300 ${feature.hoverColor} text-center`}
          >
            <img
              src={feature.icon}
              alt={feature.title}
              className="h-16 w-16 mb-4 rounded-2xl object-cover"
            />
            <h3 className="text-sm font-semibold text-gray-800">{feature.head}</h3>
            <h3 className="text-2xl font-bold text-gray-800">{feature.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
