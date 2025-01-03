import React, { useEffect, useState } from "react";
import image1 from '../assets/header/bg5.avif'; // Placeholder image

const carsList = [
  // Sedan Cars
  {
    id: 1,
    name: "Hyundai Verna",
    image: image1,
    costPerHour: 300,
    carType: "Sedan",
    seater: 5,
  },
  {
    id: 2,
    name: "Honda City",
    image: "https://example.com/honda-city.jpg",
    costPerHour: 320,
    carType: "Sedan",
    seater: 5,
  },
  {
    id: 3,
    name: "Skoda Octavia",
    image: "https://example.com/skoda-octavia.jpg",
    costPerHour: 350,
    carType: "Sedan",
    seater: 5,
  },
  {
    id: 4,
    name: "Toyota Camry",
    image: "https://example.com/toyota-camry.jpg",
    costPerHour: 450,
    carType: "Sedan",
    seater: 5,
  },
  // SUV Cars
  {
    id: 5,
    name: "Toyota Innova",
    image: image1,
    costPerHour: 500,
    carType: "SUV",
    seater: 7,
  },
  {
    id: 6,
    name: "Mahindra Scorpio",
    image: "https://example.com/scorpio.jpg",
    costPerHour: 450,
    carType: "SUV",
    seater: 7,
  },
  {
    id: 7,
    name: "Hyundai Creta",
    image: "https://example.com/hyundai-creta.jpg",
    costPerHour: 400,
    carType: "SUV",
    seater: 5,
  },
  {
    id: 8,
    name: "Tata Safari",
    image: "https://example.com/tata-safari.jpg",
    costPerHour: 480,
    carType: "SUV",
    seater: 7,
  },
  // Hatchback Cars
  {
    id: 9,
    name: "Maruti Suzuki Swift",
    image: "https://example.com/swift.jpg",
    costPerHour: 250,
    carType: "Hatchback",
    seater: 5,
  },
  {
    id: 10,
    name: "Hyundai i20",
    image: "https://example.com/hyundai-i20.jpg",
    costPerHour: 230,
    carType: "Hatchback",
    seater: 5,
  },
  {
    id: 11,
    name: "Tata Altroz",
    image: "https://example.com/tata-altroz.jpg",
    costPerHour: 220,
    carType: "Hatchback",
    seater: 5,
  },
  {
    id: 12,
    name: "Volkswagen Polo",
    image: "https://example.com/vw-polo.jpg",
    costPerHour: 240,
    carType: "Hatchback",
    seater: 5,
  },
  // Luxury Cars
  {
    id: 13,
    name: "BMW 7 Series",
    image: "https://example.com/bmw-7-series.jpg",
    costPerHour: 1500,
    carType: "Luxury",
    seater: 5,
  },
  {
    id: 14,
    name: "Mercedes-Benz S-Class",
    image: "https://example.com/mercedes-s-class.jpg",
    costPerHour: 1600,
    carType: "Luxury",
    seater: 5,
  },
  {
    id: 15,
    name: "Audi A8",
    image: "https://example.com/audi-a8.jpg",
    costPerHour: 1400,
    carType: "Luxury",
    seater: 5,
  },
  {
    id: 16,
    name: "Jaguar XJ",
    image: "https://example.com/jaguar-xj.jpg",
    costPerHour: 1450,
    carType: "Luxury",
    seater: 5,
  },
];

const CarsSpecification = ({data}) => {
console.log(data);







const filteredCars = data
  ? carsList.filter((car) => {
      console.log("Comparing:", car.carType, data.cabType);
      return car.carType.toLowerCase() === data.cabType.toLowerCase();
    })
  : carsList;


console.log(filteredCars);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Explore Our Cars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="flex bg-white rounded-lg shadow-lg overflow-hidden transform hover:shadow-2xl transition-all duration-300"
            >
              {/* Left Half: Car Image */}
              <div className="w-1/2">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Half: Car Details */}
              <div className="w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{car.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Price:</span> Rs. {car.costPerHour} / hr
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Type:</span> {car.carType}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Seater:</span> {car.seater}
                  </p>
                </div>
                <button className="mt-4 py-2 text-md font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 transition-all">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarsSpecification;
