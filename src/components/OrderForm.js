import { useState } from "react";
import carimage from "../assets/header/bg2.jpg";
import "./common.css";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
const OrderForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    date: "",

    cabType: "",
    timing: "",
  });

  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // To manage selected car details
  const [isModalOpen, setIsModalOpen] = useState(false); // To manage modal visibility

  const dummyCars = [
    {
      id: 1,
      name: "Toyota Corolla",
      cabType: "Sedan",
      image: carimage,
      rate: "10 Rs/km",
    },
    {
      id: 2,
      name: "Honda Civic",
      cabType: "Sedan",
      image: carimage,
      rate: "12 Rs/km",
    },
    {
      id: 3,
      name: "Hyundai Creta",
      cabType: "SUV",
      image: carimage,
      rate: "15 Rs/km",
    },
    {
      id: 4,
      name: "Toyota Fortuner",
      cabType: "SUV",
      image: carimage,
      rate: "18 Rs/km",
    },
    {
      id: 5,
      name: "Maruti Suzuki Swift",
      cabType: "Hatchback",
      image: carimage,
      rate: "8 Rs/km",
    },
    {
      id: 6,
      name: "Hyundai i20",
      cabType: "Hatchback",
      image: carimage,
      rate: "9 Rs/km",
    },
    {
      id: 7,
      name: "BMW 5 Series",
      cabType: "Luxury",
      image: carimage,
      rate: "25 Rs/km",
    },
    {
      id: 8,
      name: "Mercedes-Benz E-Class",
      cabType: "Luxury",
      image: carimage,
      rate: "30 Rs/km",
    },
    {
      id: 9,
      name: "Audi Q7",
      cabType: "Luxury",
      image: carimage,
      rate: "28 Rs/km",
    },
    {
      id: 10,
      name: "Jeep Compass",
      cabType: "SUV",
      image: carimage,
      rate: "20 Rs/km",
    },
    {
      id: 11,
      name: "Kia Seltos",
      cabType: "SUV",
      image: carimage,
      rate: "16 Rs/km",
    },
    {
      id: 12,
      name: "Tata Nexon",
      cabType: "Hatchback",
      image: carimage,
      rate: "10 Rs/km",
    },
    {
      id: 13,
      name: "Mahindra Thar",
      cabType: "SUV",
      image: carimage,
      rate: "22 Rs/km",
    },
    {
      id: 14,
      name: "Volkswagen Polo",
      cabType: "Hatchback",
      image: carimage,
      rate: "11 Rs/km",
    },
    {
      id: 15,
      name: "Honda City",
      cabType: "Sedan",
      image: carimage,
      rate: "13 Rs/km",
    },
    {
      id: 16,
      name: "Skoda Superb",
      cabType: "Luxury",
      image: carimage,
      rate: "27 Rs/km",
    },
    {
      id: 17,
      name: "Renault Kwid",
      cabType: "Hatchback",
      image: carimage,
      rate: "7 Rs/km",
    },
    {
      id: 18,
      name: "Hyundai Verna",
      cabType: "Sedan",
      image: carimage,
      rate: "14 Rs/km",
    },
    {
      id: 19,
      name: "Ford Endeavour",
      cabType: "SUV",
      image: carimage,
      rate: "19 Rs/km",
    },
    {
      id: 20,
      name: "Jaguar XF",
      cabType: "Luxury",
      image: carimage,
      rate: "35 Rs/km",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matches = dummyCars.filter((car) => car.cabType === formData.cabType);
    setFilteredCars(matches);
  };

  const openModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const navigate = useNavigate(); // Initialize navigate function

  const handleCheckout = () => {
    navigate("/checkout"); // Navigate to /checkout
  };
  return (
    <>
      <div className="flex gap-6 p-6">
        {/* Form Section */}
        <form
          className="bg-[#9eb0f8] p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col gap-6 w-1/3"
          onSubmit={handleSubmit}
          style={{
    background: "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)",
  }}
        >
          <h1 className="text-2xl md:text-3xl pl-2 my-2 border-l-4  font-sans font-bold border-teal-400 ">
            Book a Cab
          </h1>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="Pickup Location"
            required
            className="py-2 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#78B3CE] focus:outline-none shadow-md"
          />
          <input
            type="text"
            name="dropLocation"
            value={formData.dropLocation}
            onChange={handleChange}
            placeholder="Drop Location"
            required
            className="py-2 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#78B3CE] focus:outline-none shadow-md"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="py-2 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#78B3CE] focus:outline-none shadow-md"
          />
        
          <select
            name="cabType"
            value={formData.cabType}
            onChange={handleChange}
            required
            className="py-2 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#78B3CE] focus:outline-none shadow-md"
          >
            <option value="">Select Cab Type</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Luxury">Luxury</option>
          </select>
          <input
            type="time"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            required
            className="py-2 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#78B3CE] focus:outline-none shadow-md"
          />
          <button
            type="submit"
            className="navbutton py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
          >
            Let's Go
          </button>
        </form>

        {/* Filtered Cars Section */}
        <div className="mt-6 flex flex-col gap-4 w-[80%] px-10 bg-white p-6 rounded-2xl shadow-xl hover:shadow-3xl transition-shadow duration-300">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="flex items-center border border-gray-300 rounded-lg shadow-3xl bg-white p-4"
            >
              {/* Car Details */}
              <div className="flex-1">
                <p className=" ">
                  <span className="bg-green-50 text-green-800 text-lg font-bold me-2 px-2.5 py-0.5 rounded  ">
                    {car.name}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1 ml-2">
                  Type: {car.cabType}
                </p>
                <p className="text-sm text-gray-600 mt-1 ml-2">
                  Rate: {car.rate}
                </p>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => openModal(car)}
                className="navbutton text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Book Now{" "}
                <Icon icon="mdi:arrow-right-thin" width="24" height="24" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative bg-white p-8 rounded-lg w-full max-w-3xl shadow-xl">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={closeModal}
            >
              ✖
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Car Image */}

              {/* Car Details and Booking Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedCar.name}
                </h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Type:</span>{" "}
                  {selectedCar.cabType}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Rate:</span>{" "}
                  {selectedCar.rate}
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
                  />
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
                  />
                </div>

                {/* Charges Section */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between text-gray-800">
                    <p>Fixed Charges:</p>
                    <p>₹500</p>
                  </div>
                  <div className="flex justify-between text-gray-800">
                    <p>Variable Charges:</p>
                    <p>{selectedCar.rate}</p>
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  onClick={handleCheckout}
                  className="navbutton w-[50%] mt-6 mx-auto mt-5 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderForm;
