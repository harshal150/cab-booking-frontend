import { useState , useEffect} from "react";
import carimage from "../assets/header/bg2.jpg";
import "./common.css";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import OTPLogin from "./OtpLogin";
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
  const [isOtpLoginOpen, setIsOtpLoginOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // Confirmation box visibility
  const [mobileNumber, setMobileNumber] = useState(""); // Shared state for mobile number

  const dummyCars = [
    {
      id: 1,
      name: "Toyota Corolla",
      cabType: "Sedan",
      image: carimage,
      rate: "10 Rs/km",
      fixedCharges: 500,
      driverName: "Amit Sharma",
      driverMobile: "9876543210",
    },
    {
      id: 2,
      name: "Honda Civic",
      cabType: "Sedan",
      image: carimage,
      rate: "12 Rs/km",
      fixedCharges: 600,
      driverName: "Rajesh Gupta",
      driverMobile: "9876543211",
    },
    {
      id: 3,
      name: "Hyundai Creta",
      cabType: "SUV",
      image: carimage,
      rate: "15 Rs/km",
      fixedCharges: 800,
      driverName: "Sunil Mehra",
      driverMobile: "9876543212",
    },
    {
      id: 4,
      name: "Toyota Fortuner",
      cabType: "SUV",
      image: carimage,
      rate: "18 Rs/km",
      fixedCharges: 1000,
      driverName: "Ravi Kumar",
      driverMobile: "9876543213",
    },
    {
      id: 5,
      name: "Maruti Suzuki Swift",
      cabType: "Hatchback",
      image: carimage,
      rate: "8 Rs/km",
      fixedCharges: 300,
      driverName: "Ankit Yadav",
      driverMobile: "9876543214",
    },
    {
      id: 6,
      name: "Hyundai i20",
      cabType: "Hatchback",
      image: carimage,
      rate: "9 Rs/km",
      fixedCharges: 400,
      driverName: "Manoj Verma",
      driverMobile: "9876543215",
    },
    {
      id: 7,
      name: "BMW 5 Series",
      cabType: "Luxury",
      image: carimage,
      rate: "25 Rs/km",
      fixedCharges: 1500,
      driverName: "Vivek Singh",
      driverMobile: "9876543216",
    },
    {
      id: 8,
      name: "Mercedes-Benz E-Class",
      cabType: "Luxury",
      image: carimage,
      rate: "30 Rs/km",
      fixedCharges: 1800,
      driverName: "Karan Patel",
      driverMobile: "9876543217",
    },
    {
      id: 9,
      name: "Audi Q7",
      cabType: "Luxury",
      image: carimage,
      rate: "28 Rs/km",
      fixedCharges: 1700,
      driverName: "Arjun Malhotra",
      driverMobile: "9876543218",
    },
    {
      id: 10,
      name: "Jeep Compass",
      cabType: "SUV",
      image: carimage,
      rate: "20 Rs/km",
      fixedCharges: 900,
      driverName: "Naveen Jain",
      driverMobile: "9876543219",
    },
    {
      id: 11,
      name: "Kia Seltos",
      cabType: "SUV",
      image: carimage,
      rate: "16 Rs/km",
      fixedCharges: 850,
      driverName: "Sandeep Sharma",
      driverMobile: "9876543220",
    },
    {
      id: 12,
      name: "Tata Nexon",
      cabType: "Hatchback",
      image: carimage,
      rate: "10 Rs/km",
      fixedCharges: 450,
      driverName: "Deepak Chauhan",
      driverMobile: "9876543221",
    },
    {
      id: 13,
      name: "Mahindra Thar",
      cabType: "SUV",
      image: carimage,
      rate: "22 Rs/km",
      fixedCharges: 1200,
      driverName: "Prakash Mehta",
      driverMobile: "9876543222",
    },
    {
      id: 14,
      name: "Volkswagen Polo",
      cabType: "Hatchback",
      image: carimage,
      rate: "11 Rs/km",
      fixedCharges: 500,
      driverName: "Ramesh Tiwari",
      driverMobile: "9876543223",
    },
    {
      id: 15,
      name: "Honda City",
      cabType: "Sedan",
      image: carimage,
      rate: "13 Rs/km",
      fixedCharges: 550,
      driverName: "Ravi Sharma",
      driverMobile: "9876543224",
    },
    {
      id: 16,
      name: "Skoda Superb",
      cabType: "Luxury",
      image: carimage,
      rate: "27 Rs/km",
      fixedCharges: 1600,
      driverName: "Rajat Kumar",
      driverMobile: "9876543225",
    },
    {
      id: 17,
      name: "Renault Kwid",
      cabType: "Hatchback",
      image: carimage,
      rate: "7 Rs/km",
      fixedCharges: 250,
      driverName: "Soham Joshi",
      driverMobile: "9876543226",
    },
    {
      id: 18,
      name: "Hyundai Verna",
      cabType: "Sedan",
      image: carimage,
      rate: "14 Rs/km",
      fixedCharges: 600,
      driverName: "Kunal Singh",
      driverMobile: "9876543227",
    },
    {
      id: 19,
      name: "Ford Endeavour",
      cabType: "SUV",
      image: carimage,
      rate: "19 Rs/km",
      fixedCharges: 1100,
      driverName: "Vikas Rathi",
      driverMobile: "9876543228",
    },
    {
      id: 20,
      name: "Jaguar XF",
      cabType: "Luxury",
      image: carimage,
      rate: "35 Rs/km",
      fixedCharges: 2000,
      driverName: "Rahul Kapoor",
      driverMobile: "9876543229",
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
// Open OTP Login Modal
const openOtpLogin = (car) => {
  setSelectedCar(car); // Set the selected car
  setIsOtpLoginOpen(true); // Open the OTP Login modal
};

// Close OTP Login Modal
const closeOtpLogin = () => {
  setIsOtpLoginOpen(false); // Close the OTP Login modal
  setIsModalOpen(true); // Open the car details modal after successful OTP login
};

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
    setFormData((prev) => ({
      ...prev,
      passengers: "", // Reset passengers field
    }));
  };

  const handlePayNow = () => {
    setIsModalOpen(false); // Close car details modal
    setIsConfirmationOpen(true); // Open confirmation modal
  };
const navigate = useNavigate()
  const handleProceed = () => {
    setIsConfirmationOpen(false); // Close confirmation modal
    navigate("/passangers")
    // Proceed with booking logic
  };

  const handleDownload = () => {
    const bookingDetails = `
      Booking Confirmation:
      Cab: ${selectedCar.name}
      Type: ${selectedCar.cabType}
      Date: ${formData.date}
      Time: ${formData.timing}
      Hours: ${formData.hours}
      Charges: ${parseInt(selectedCar.rate) * parseInt(formData.hours) || 0} Rs
    `;
    const blob = new Blob([bookingDetails], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "BookingConfirmation.txt";
    link.click();
  };


  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Set the current time as the default value
  useEffect(() => {
    setFormData((prev) => ({ ...prev, timing: getCurrentTime() }));
  }, []);


  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
    return formattedDate.replace(",", ""); // Remove any unwanted commas
  };


  return (
    <>
  <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start">
      {/* Form Section */}
      <form
        className="w-full md:w-2/5 bg-gradient-to-br from-white to-[#f4f7fb] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-600 mb-2">
          Book a Cab
        </h1>

        {/* Cab Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="cabType">
            Cab Type
          </label>
          <select
            id="cabType"
            name="cabType"
            value={formData.cabType}
            onChange={handleChange}
            required
            className="py-2 px-3 w-full rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
          >
            <option value="" disabled>
              Select Cab Type
            </option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="date">
            Journey Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="py-2 px-3 w-full rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="timing">
            Journey Time
          </label>
          <input
            type="time"
            id="timing"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            required
            placeholder="hh:mm"
            className="py-2 px-3 w-full rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
          />
        </div>

        {/* Hours */}
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="hours">
            Approximate Hours
          </label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            placeholder="Enter duration in hours"
            required
            className="py-2 px-3 w-full rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
            min={1}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 mt-3 rounded-md bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors shadow-md focus:ring-4 focus:ring-teal-300"
        >
          Book Now
        </button>
      </form>

      {/* Filtered Cars Section */}
      <div className="mt-4 md:mt-0 flex flex-col gap-4">
      {filteredCars.map((car) => (
  <div
    key={car.id}
    className="flex flex-col md:flex-row w-full items-start md:items-center border border-gray-300 rounded-lg shadow-lg bg-white p-4 md:gap-48"
  >
    {/* Car Details */}
    <div className="flex-1">
      <p>
        <span className="bg-green-50 text-green-800 text-xl font-bold me-2 px-2.5 mb-3 py-0.5 rounded">
          {car.name}
        </span>
      </p>
      <div
        className="flex flex-col md:flex-row md:items-center bg-gray-100 p-4 mt-2 rounded-lg shadow-sm space-y-2 mb-5 md:space-y-0 md:space-x-10"
      >
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-teal-600">Type:</span> {car.cabType}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-teal-600">Rate:</span> {car.rate}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-teal-600">Fix Charges:</span> ₹
          {car.fixedCharges}
        </p>
      </div>
    </div>

    {/* Book Now Button */}
    <div className="w-full md:w-auto">
      <button
        onClick={() => openOtpLogin(car)}
        className="w-full py-2 px-4 md:mt-7 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition md:w-auto"
      >
       Continue
      </button>
    </div>
  </div>
))}


      </div>
    </div>


      {/* {isOtpLoginOpen && <OTPLogin onClose={closeOtpLogin} />} */}
<div className="m-5">
{isOtpLoginOpen && (
  <OTPLogin
    onClose={closeOtpLogin}
    mobileNumber={mobileNumber}
    setMobileNumber={setMobileNumber}
  />
)}
</div>

{isModalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
    <div className="relative bg-white p-6 md:p-8 rounded-lg w-full max-w-sm md:max-w-3xl shadow-xl">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        onClick={closeModal}
      >
        ✖
      </button>

      <div className="flex flex-col gap-6">
        {/* Car Details and Booking Info */}
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center md:text-left">
            {selectedCar.name}
          </h3>

          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              readOnly
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md mb-4"
            />
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
            />
           <input
  type="number"
  placeholder="Enter number of passengers"
  className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
  value={formData.passengers || ""}
  onChange={(e) => {
    const value = Math.min(Number(e.target.value), 10); // Restrict value to a maximum of 10
    setFormData((prev) => ({
      ...prev,
      passengers: value,
    }));
  }}
  max="10" // This restricts input to 10 in browsers that respect the `max` attribute
/>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
            />
          </div>

          {/* Charges Section */}
          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-800 text-sm md:text-base">
              <p>Fixed Charges:</p>
              <p>₹{selectedCar.fixedCharges || 500}</p>
            </div>
            <div className="flex justify-between text-gray-800 text-sm md:text-base">
              <p>Variable Charges:</p>
              <p>To be paid at the end of ride</p>
            </div>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={handlePayNow}
            className="mt-6 w-full py-3 px-6 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{isConfirmationOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs md:max-w-lg p-4 md:p-6">
      {/* Close Button */}
      <button
        onClick={() => setIsConfirmationOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-transform transform hover:scale-110"
      >
        ✖
      </button>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-4">
        Confirm Your Booking
      </h3>

      {/* Booking Details */}
      <div className="space-y-4">
        {[
          { label: "Booking Id", value: "CB001"},
          { label: "Booking Date", value: formatDate(formData.date) },
          { label: "Cab", value: selectedCar.name },
          { label: "Type", value: selectedCar.cabType },
          { label: "Ride Date", value: formatDate(formData.date) },
          { label: "Time", value: formData.timing },
          { label: "Approx Hours", value: formData.hours },
          { label: "Passengers", value: formData.passengers },
          { label: "Driver Name", value: selectedCar.driverName },
          { label: "Driver Contact", value: selectedCar.driverMobile },
          {
            label: "Charges",
            value: `₹${
              parseInt(selectedCar.rate) * parseInt(formData.hours) +
              (selectedCar.fixedCharges || 0) || 0
            }`,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-sm md:text-base border-b pb-1"
          >
            <span className="font-medium text-gray-500">{item.label}:</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Buttons Section */}
      <div className="mt-6 flex flex-col md:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-sm"
        >
          Download
        </button>
        <button
          onClick={handleProceed}
          className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
        >
          Proceed
        </button>
      </div>
    </div>
  </div>
)}




      {/* OTP Login */}
      {/* {isOtpLoginOpen && <OTPLogin onClose={() => setIsOtpLoginOpen(false)} />} */}
    </>
  );
};

export default OrderForm;
