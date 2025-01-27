import { useState, useEffect } from "react";
import carimage from "../assets/JhansiElectricCab.jpeg";
import "./common.css";
import { useNavigate } from "react-router-dom";
import OTPLogin from "./OtpLogin";
import CryptoJS from "crypto-js";
import CONFIG from "../config";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    date: "",
    timing: "",
    name: "", // For user_name
    email: "", // For email
  });
const DOMAIN = CONFIG.REACT_APP_API_DOMAIN;
console.log(DOMAIN);



  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // To manage selected car details
  const [isModalOpen, setIsModalOpen] = useState(false); // To manage modal visibility
  const [isOtpLoginOpen, setIsOtpLoginOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // Confirmation box visibility
  const [mobileNumber, setMobileNumber] = useState(""); // Shared state for mobile number
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(false); // To manage button state
  const [bookingId, setBookingId] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${DOMAIN}/api/cars?booking_date=${formData.date}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch car data");
      }

      const data = await response.json();
      console.log(data);
      // Map API data to include required fields
      const carsWithImage = data.map((car) => ({
        ...car,
        CarImg: carimage,
        name: car.car_name,
        rate: `${car.rate_per_km} Rs/km`,
        fixedCharges: car.fixed_charges,
        status:
          car.availability === "Not Available" ? "Not Available" : "Available",
      }));

      setFilteredCars(carsWithImage);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Open OTP Login Modal
  const openOtpLogin = (car) => {
    setSelectedCar(car); // Set the selected car, which includes all car and driver details
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

  // const [mobileNumber, setMobileNumber] = useState(""); // Mobile number typed in OTP modal
  const [modalFormData, setModalFormData] = useState({
    name: "",
    email: "",
    num_passengers: 0,
  });

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    num_passengers: "",
  });

  const handlePayNow = async () => {
    setFormErrors({
      name: "",
      email: "",
      num_passengers: "",
    });

    let isValid = true;

    // Validate all fields and set error messages
    if (!modalFormData.name) {
      setFormErrors((prev) => ({ ...prev, name: "Name is required" }));
      isValid = false;
    }

    if (!modalFormData.email) {
      setFormErrors((prev) => ({ ...prev, email: "Email is required" }));
      isValid = false;
    }

    if (!mobileNumber) {
      setFormErrors((prev) => ({
        ...prev,
        mobileNumber: "Mobile number is required",
      }));
      isValid = false;
    }

    if (!modalFormData.num_passengers) {
      setFormErrors((prev) => ({
        ...prev,
        num_passengers: "Number of passengers is required",
      }));
      isValid = false;
    }

    if (!isValid) {
      return; // If form is invalid, do not proceed
    }

    const payload = {
      user_name: modalFormData.name,
      email: modalFormData.email,
      mobile_no: mobileNumber,
      num_passengers: modalFormData.num_passengers,
    };

    sessionStorage.setItem("updatedmobilenumber", payload.mobile_no);

    try {
      // Create user
      const createResponse = await fetch(
        `${DOMAIN}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!createResponse.ok) {
        throw new Error("Failed to create user");
      }

      const createdUser = await createResponse.json();
      console.log("User created:", createdUser);
      const userId = createdUser?.userId;

      console.log("User created id:", userId);

      // Prepare booking data
      const bookingData = {
        booking_date: formData.date,
        booking_time: formData.timing,
        cab_id: selectedCar.car_id,
        driver_id: selectedCar.assigned_driver_id,
        user_id: userId,
        status: "Pending",
      };

      // Call createBooking and store the result
      const bookingResponse = await createBooking(bookingData);

      if (bookingResponse) {
        setIsModalOpen(false);
        setIsConfirmationOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  const createBooking = async (bookingData) => {
    try {
      // Create the booking
      const response = await fetch(`${DOMAIN}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      // Parse the booking response
      const bookingResponse = await response.json();
      console.log("Booking created successfully:", bookingResponse);

      // Extract the bookingId from the response
      const bookingId = bookingResponse.bookingId;
      setBookingId(bookingId);
      if (bookingId) {
        console.log("Generated Booking ID:", bookingId);

        // Store the booking ID in localStorage
        localStorage.setItem("pendingBookingId", bookingId);
      } else {
        console.error("Booking ID not found in response");
      }

      return bookingResponse;
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.message || "An error occurred while creating the booking.");
    }
  };

  const navigate = useNavigate();

  const handleProceed = () => {
    setIsConfirmationOpen(false); // Close confirmation modal
    navigate("/passangers");
    // Proceed with booking logic
  };


  // const getCurrentTime = () => {
  //   const now = new Date();
  //   const hours = String(now.getHours()).padStart(2, "0");
  //   const minutes = String(now.getMinutes()).padStart(2, "0");
  //   return ${hours}:${minutes};
  // };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
  
    // If the current time is earlier than 10:00, return 10:00
    if (hours < 10) return "10:00";
  
    // If the current time is later than 17:00, return 17:00
    if (hours >= 17) return "17:00";
  
    // Otherwise, return the current time in HH:MM format
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

  const submitBooking = async () => {
    setLoading(true); // Disable button when clicked
    const paymentAmount = 25.0; // Fixed payment amount
    // const txnId = `txn_${Date.now()}`;
    const txnId = bookingId;
    console.log(txnId);
    const cabName = selectedCar?.name || "Cab Booking";



    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2); // Last two digits of the year
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const randomDigits = Math.floor(Math.random() * 90 + 10); // Two-digit random number
    const rideId = `${day}${month}${year}${seconds}${randomDigits}`;


    const RouterDomain = process.env.REACT_APP_ROUTER_DOMAIN;
    const merchantCode = process.env.REACT_APP_MERCHANT_CODE;
    const username = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    const privateValue = process.env.REACT_APP_PRIVATE_VALUE;
    const successURL = `${process.env.REACT_APP_SUCCESS_URL}${txnId}`;
    const failureURL = `${process.env.REACT_APP_FAILURE_URL}${txnId}`;
    
    console.log("RouterDomain:", RouterDomain); // Debugging purpose
    


    // const RouterDomain = "https://bookings.smartcityjhansi.com/Router/initiateTransaction";
    // const merchantCode = "JHA434";
    // const username = "MJHANS434";
    // const password = "[C@1ba15716";
    // const privateKey = "7R7WkmrgZilbokoB";
    // const privateValue = "x8mYTSawyBGpM9iq";
    // const successURL = `https://cab.payplatter.in/payment-success?txnId=${txnId}`;
    // const failureURL = `https://cab.payplatter.in/payment-failure?txnId=${txnId}`;

    // const RouterDomain =
    //   "https://test.payplatter.in/Router/initiateTransaction";
    // const merchantCode = "THE265";
    // const username = "MPANKA261";
    // const password = "[C@445aba30";
    // const privateKey = "Wq0F6lS7A5tIJU90";
    // const privateValue = "lo4syhqHnRjm4L0T";
    // const successURL = `http://localhost:3000/payment-success?txnId=${txnId}`;
    // const failureURL = `http://localhost:3000/payment-failure?txnId=${txnId}`;

    const encryptData = (data, iv, key) => {
      const keyBytes = CryptoJS.enc.Utf8.parse(
        key.padEnd(16, "0").slice(0, 16)
      );
      const ivBytes = CryptoJS.enc.Utf8.parse(iv);
      const encrypted = CryptoJS.AES.encrypt(data, keyBytes, {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    };

    // Construct payment query
    let query = `?mcode=${merchantCode}&uname=${username}&psw=${password}&amount=${paymentAmount.toFixed(
      2
    )}&mtxnId=${txnId}&pfname=${cabName}&surl=${successURL}&furl=${failureURL}`;

    // Encrypt the query
    const encryptedQuery = encryptData(query, privateValue, privateKey).replace(
      /\+/g,
      "%2B"
    );

    // Redirect to the payment gateway
    const paymentUrl = `${RouterDomain}?query=${encryptedQuery}&mcode=${merchantCode}`;
    console.log("Redirecting to Payment URL:", paymentUrl);

    // Save minimal data to sessionStorage for use after payment
    sessionStorage.setItem("txnId", txnId);
    sessionStorage.setItem("cabId", selectedCar?.car_id);
    sessionStorage.setItem("driverId", selectedCar?.assigned_driver_id);
    sessionStorage.setItem("userId", newUser?.id);
    sessionStorage.setItem("rideDate", formData.date);
    sessionStorage.setItem("rideTime", formData.timing);

    // Redirect to payment
    window.location.href = paymentUrl;
    setTimeout(() => {
      window.location.href = paymentUrl;
      setLoading(false); // Re-enable button after redirection
    }, 9000); // Simulate delay before redirection
  };

  // const submitBooking = async () => {
  //   const payload = {
  //     booking_date: formData.date, // Ride Date
  //     booking_time: formData.timing, // Journey Time
  //     cab_id: selectedCar?.car_id, // Cab ID
  //     driver_id: selectedCar?.assigned_driver_id, // Driver ID
  //     user_id: newUser?.id, // User ID (from the created user)
  //     status: "booked", // Booking status
  //     approx_hours: parseFloat(formData.hours), // Approx Hours
  //   };

  //   try {
  //     // Submit the booking
  //     const postResponse = await fetch(
  //       "https://cabapi.payplatter.in/api/bookings",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       }
  //     );
  //     console.log(postResponse);
  //     console.log(payload);
  //     if (!postResponse.ok) {
  //       throw new Error("Failed to submit booking");
  //     }

  //     console.log("Booking submitted successfully.");

  //     const getResponse = await fetch(
  //       "https://cabapi.payplatter.in/api/bookings",
  //       {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );

  //     if (!getResponse.ok) {
  //       throw new Error("Failed to fetch bookings");
  //     }

  //     const bookings = await getResponse.json();
  //     console.log("All bookings:", bookings);

  //     // Get the latest booking (assuming the last booking in the array is the latest)
  //     const latestBooking = bookings[bookings.length - 1];
  //     if (!latestBooking) {
  //       throw new Error("No bookings found");
  //     }

  //     console.log("Latest booking:", latestBooking);
  //     console.log("Latest id:", latestBooking.booking_id);

  //     // Store the bookingId and other details in sessionStorage
  //     sessionStorage.setItem("bookingId", latestBooking.booking_id);
  //     sessionStorage.setItem("mobileNumber", mobileNumber);
  //     sessionStorage.setItem("userName", modalFormData.name);
  //     sessionStorage.setItem("rideDate", formData.date);
  //     sessionStorage.setItem("rideTime", formData.timing);
  //     sessionStorage.setItem("driverName", selectedCar?.assigned_driver_name);
  //     sessionStorage.setItem(
  //       "driverMobile",
  //       selectedCar?.assigned_driver_mobile
  //     );

  //     console.log("Session Storage Values:");
  //     console.log("Booking ID:", latestBooking.booking_id);
  //     console.log("Mobile Number:", mobileNumber);
  //     console.log("User Name:", modalFormData.name);
  //     console.log("Ride Date:", formData.date);
  //     console.log("Ride Time:", formData.timing);
  //     console.log("Driver Name:", selectedCar?.assigned_driver_name);
  //     console.log("Driver Mobile:", selectedCar?.assigned_driver_mobile);

  //     // Update car status to "not available"
  //     await updateCarStatus(selectedCar.car_id, "not available", formData.date);

  //     // Proceed with payment logic
  //     const paymentAmount = 25.0; // Fixed payment amount
  //     const txnId = `txn_${Date.now()}`;
  //     const settlementSplit = `online_${paymentAmount}~`;
  //     const cabName = selectedCar?.name || "Cab Booking";

  //     // const RouterDomain = "https://test.payplatter.in/Router/initiateTransaction";
  //     // const merchantCode = "THE265";
  //     // const username = "MPANKA261";
  //     // const password = "[C@445aba30";
  //     // const privateKey = "Wq0F6lS7A5tIJU90";
  //     // const privateValue = "lo4syhqHnRjm4L0T";
  //     // const successURL = "http://localhost:3000/payment-success";
  //     // const failureURL = "https://cab.payplatter.in/payment-failure";

  //     const RouterDomain =
  //       "https://bookings.smartcityjhansi.com/Router/initiateTransaction";
  //     const merchantCode = "JHA434";
  //     const username = "MJHANS434";
  //     const password = "[C@1ba15716";
  //     const privateKey = "7R7WkmrgZilbokoB";
  //     const privateValue = "x8mYTSawyBGpM9iq";
  //     const successURL = "https://cab.payplatter.in/payment-success";
  //     const failureURL = "https://cab.payplatter.in/payment-failure";

  //     const encryptData = (data, iv, key) => {
  //       const keyBytes = CryptoJS.enc.Utf8.parse(
  //         key.padEnd(16, "0").slice(0, 16)
  //       );
  //       const ivBytes = CryptoJS.enc.Utf8.parse(iv);
  //       const encrypted = CryptoJS.AES.encrypt(data, keyBytes, {
  //         iv: ivBytes,
  //         mode: CryptoJS.mode.CBC,
  //         padding: CryptoJS.pad.Pkcs7,
  //       });
  //       return encrypted.toString();
  //     };

  //     // Construct query string for payment
  //     let query = `?mcode=${merchantCode}&uname=${username}&psw=${password}&amount=${paymentAmount.toFixed(
  //       2
  //     )}&settlement_split=${settlementSplit}&mtxnId=${txnId}&pfname=${cabName}&plname=&pmno=${mobileNumber}&pemail=${
  //       modalFormData.email
  //     }&padd=&surl=${successURL}&furl=${failureURL}&udf6=`;

  //     // Encrypt the query string
  //     const encryptedQuery = encryptData(
  //       query,
  //       privateValue,
  //       privateKey
  //     ).replace(/\+/g, "%2B");

  //     // Construct the final payment URL
  //     const paymentUrl = `${RouterDomain}?query=${encryptedQuery}&mcode=${merchantCode}`;
  //     console.log("Redirecting to Payment URL:", paymentUrl);

  //     // Redirect to payment gateway
  //     window.location.href = paymentUrl;
  //   } catch (error) {
  //     console.error("Error submitting booking or initiating payment:", error);
  //     alert(error.message || "An error occurred while submitting the booking.");
  //   }
  // };

  const updateCarStatus = async (carId, status, bookingDate) => {
    try {
      const response = await fetch(
        `${DOMAIN}/api/cars/${carId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status, // Set car status
            unavailable_date: bookingDate, // Specific date for unavailability
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update car status");
      }

      console.log(
        `Car status updated to "${status}" for booking date ${bookingDate}`
      );
    } catch (error) {
      console.error("Error updating car status:", error);
      alert("Failed to update car status. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-6 md:flex-row  md:items-start">
        {/* Form Section */}
        <form
          className="w-full md:w-3/5 bg-gradient-to-br from-white to-[#f4f7fb] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-600 mb-2">
            Book Your Cab
          </h1>

          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="date"
            >
              Journey Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]} // Set the minimum date to today
              className="py-2 px-3 w-full rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
              onInput={(e) => {
                const date = new Date(e.target.value);
                if (date.getDay() === 1) {
                  e.target.setCustomValidity("Cabs Unavailable on Monday");
                } else {
                  e.target.setCustomValidity("");
                }
              }}
            />
          </div>

          {/* Time */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="timing"
            >
              Journey start time
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
              min={
                formData.date === new Date().toISOString().split("T")[0]
                  ? getCurrentTime()
                  : "10:00"
              }
              max="17:00"
            />
          </div>

          {/* Hours */}
          {/* <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="hours"
            >
              Approximate Hours
            </label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={(e) => {
                const value = Math.min(Math.max(e.target.value, 0), 24); // Restrict value between 0 and 24
                handleChange({ target: { name: "hours", value } });
              }}
              placeholder="Enter duration in hours"
              required
              className="py-2 px-3 w-full rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
              min={0} // Minimum value is 0
              max={24} // Maximum value is 24
            />
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-3 rounded-md bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors shadow-md focus:ring-4 focus:ring-teal-300"
          >
            Continue
          </button>

          <div className="font-normal justify-start">
            <p className="font-semibold">Please note the following:</p>
            <ol>
              <li>1) Cabs Unavailable on Monday</li>
              <li>
                2) Booking charge is Rs 25/-, which will NOT be adjusted to the
                total fare at the end of trip. If booking is cancelled, then
                booking charge will not be refunded.
              </li>
              <li>
                3) Fare is 10 rs/km from the source place of user. Source of
                trip can be in Jhansi Municipal Area only.
              </li>
              <li>
                4) ⁠Maximum allowed trip distance (one side) is 50 KMs. So
                please plan your journey accordingly.
              </li>
              <li>
                5) Wait time of 10 mins is allowed only when passenger is in cab, else passenger needs to end the trip and rebook cab.
              </li>
              <li>6) Toll charges are not included in the booking</li>
            </ol>
          </div>
        </form>

        {/* Filtered Cars Section */}
        <div className="mt-8 space-y-4 md:w-3/5">
          {filteredCars
            .sort((a, b) =>
              a.status === "Available" && b.status !== "Available" ? -1 : 1
            )
            .map((car) => (
              <div
                key={car.id}
                className={`flex items-center w-full p-4 border rounded-lg shadow-md transition-shadow ${
                  car.status === "Available"
                    ? "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-lg"
                    : "bg-gray-200 border-gray-300"
                }`}
              >
                {/* Car Image */}
                <img
                  src={car.CarImg}
                  alt={car.name}
                  className="w-24 h-16 object-contain rounded-full mr-4"
                />

                {/* Car Details */}
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      car.status === "Available"
                        ? "text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {car.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Rate:</span> {car.rate}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Fixed Charges:</span> ₹
                    {car.fixedCharges}
                  </p>
                  <p
                    className={`mt-1 inline-block px-2 py-1 text-sm rounded-full font-semibold ${
                      car.status === "Available"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {car.status}
                  </p>
                </div>

                {/* Book Now Button */}
                {car.status === "Available" && (
                  <button
                    onClick={() => openOtpLogin(car)}
                    className="py-2 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-300 transition"
                  >
                    Book Now
                  </button>
                )}
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

      <div className="m-5">
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 md:p-6 rounded-lg w-full max-w-xs md:max-w-2xl shadow-lg">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                onClick={closeModal}
              >
                ✖
              </button>
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 text-center md:text-left">
                    {selectedCar.name}
                  </h3>

                  <div className="space-y-3">
                    {/* Mobile Number (Read Only) */}
                    <div>
                      <label
                        htmlFor="mobileNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mobile Number
                      </label>
                      <input
                        id="mobileNumber"
                        type="tel"
                        placeholder="Mobile Number"
                        value={mobileNumber} // Autofilled from OTP modal
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-sm"
                      />
                      {formErrors.mobileNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.mobileNumber}
                        </p>
                      )}
                    </div>

                    {/* Name Input */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={modalFormData.name}
                        onChange={handleModalInputChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-sm"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={modalFormData.email}
                        onChange={handleModalInputChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-sm"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Number of Passengers Input */}
                    <div>
                      <label
                        htmlFor="num_passengers"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Number of Passengers (Age above 5 years)
                      </label>
                      <input
                        id="num_passengers"
                        type="number"
                        name="num_passengers"
                        placeholder="Enter Number of passengers age above 5yrs"
                        value={modalFormData.num_passengers}
                        onChange={(e) => {
                          const value = Math.min(Number(e.target.value), 4); // Restrict max passengers to 4
                          setModalFormData((prev) => ({
                            ...prev,
                            num_passengers: value,
                          }));
                        }}
                        max="4"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-sm"
                      />
                      {formErrors.num_passengers && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.num_passengers}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Charges Section */}
                  <div className="mt-5 border-t pt-3 space-y-1">
                    <div className="flex justify-between text-gray-800 text-sm md:text-base">
                      <p>Booking Charges:</p>
                      <p>₹{selectedCar?.fixedCharges || 500}</p>
                    </div>

                    <div className="flex justify-between text-gray-800 text-sm md:text-base">
                      <p>Variable Charges:</p>
                      <p className="font-semibold">
                        {selectedCar?.rate
                          ? `${
                              selectedCar.rate.split("km ")[0]
                            } (To be paid at end of Ride)`
                          : "To be paid at end of Ride"}
                      </p>
                    </div>
                  </div>

                  {/* Pay Now Button */}
                  <button
                    onClick={handlePayNow}
                    className="mt-5 w-full py-2 px-4 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
                { label: "Booking Date", value: formatDate(new Date()) },
                { label: "Cab", value: selectedCar?.name || "N/A" },

                { label: "Ride Date", value: formatDate(formData.date) },
                { label: "Journey Time", value: formData.timing },
                {
                  label: "Passengers",
                  value: modalFormData.num_passengers || "N/A",
                },

                {
                  label: "Driver Name",
                  value: selectedCar?.assigned_driver_name || "N/A",
                },
                {
                  label: "Driver Contact",
                  value: selectedCar?.assigned_driver_mobile || "N/A",
                },
                {
                  label: "Booking Charges",
                  value: `₹ ${selectedCar?.fixedCharges || 0}`,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm md:text-base border-b pb-1"
                >
                  <span className="font-medium text-gray-500">
                    {item.label}:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons Section */}
            <div className="mt-6 flex flex-col md:flex-row gap-3">
              <button
                onClick={() => {
                  submitBooking();
                  setLoading(true); // Disable the button and change its color after clicking
                }}
                disabled={loading} // Disable only after clicking
                className={`w-full py-2 text-white font-semibold rounded-lg transition-all duration-300 shadow-md ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed" // Gray background when loading
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                }`}
              >
                {loading ? "Processing..." : "Confirm and Pay Now"}
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
