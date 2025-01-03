import React from "react";
import confortable from '../assets/cabfeatures/comfortrable.jpg'
import safety from '../assets/cabfeatures/safety.avif'
import rewards from '../assets/cabfeatures/rewards.avif'
import afordable from '../assets/cabfeatures/affordable.avif'

import image from '../assets/cabfeatures/imagemain.jpeg'
const CabFeatures = () => {
  const features = [
    {
      icon: (
        <img
          src= {confortable}
          alt="Comfortable Rides"
          className="w-16 h-16 rounded-3xl"
        />
      ),
      title: "Comfortable Rides",
      description: "Experience smooth and comfortable rides with our well-maintained vehicles and professional drivers.",
    },
    {
      icon: (
        <img
          src={safety}
          alt="Safety First"
          className="w-16 h-16 rounded-3xl"
        />
      ),
      title: "Safety First",
      description: "Your safety is our top priority with fully insured rides, regular vehicle checks, and trusted drivers.",
    },
    {
      icon: (
        <img
          src={rewards}
          alt="Reward Points"
          className="w-16 h-16 rounded-3xl"
        />
      ),
      title: "Reward Points",
      description: "Earn reward points on every ride and enjoy exciting offers and discounts on future bookings.",
    },
    {
      icon: (
        <img
          src={afordable}
          alt="Affordable Pricing"
          className="w-16 h-16 rounded-3xl"
        />
      ),
      title: "Affordable Pricing",
      description: "Enjoy transparent and budget-friendly pricing for all your travel needs.",
    },
  ];

  return (
    <section>
      <div className="container max-w-xl p-6 mx-auto space-y-12 lg:px-8 lg:max-w-7xl md:mb-10">
        <div>
          {/* <h2 className="text-3xl font-bold text-center sm:text-5xl">Cab Features</h2> */}
          <p className="max-w-3xl mx-auto mt-4 text-xl text-gray-800 text-center font-bold">
            Explore the latest features designed to provide a seamless and enjoyable cab booking experience.
          </p>
        </div>
        <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mt-4 space-y-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-14 h-14">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">{feature.title}</h4>
                    <p className="mt-2">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden="true" className="mt-10 lg:mt-0">
            <img
              width="600"
              height="600"
              src={image}
              className="mx-auto rounded-lg shadow-lg"
              alt="Cab Features"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CabFeatures;
