import React, { useState, useRef, useEffect } from "react";
import {
  FaCarAlt,
  FaUserAlt,
  FaClock,
  FaCalendarAlt,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

const PassengersDetails = () => {
  const [activeTab, setActiveTab] = useState("myRides");
  const [rideStatus, setRideStatus] = useState({}); // Tracks the state of each ride (started/ended)
  const [startReading, setStartReading] = useState({});
  const [endReading, setEndReading] = useState({});
  const [rideOtp, setRideOtp] = useState({});
  const [totalFare, setTotalFare] = useState({}); // Tracks fare for each ride
  const [bookings, setBookings] = useState([]); // Stores booking data fetched from API
  const otpRefs = useRef([]);
  const mobileNumber = sessionStorage.getItem("mobileNumber");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("https://cabapi.payplatter.in/api/bookings");
        const data = response.data;

        // Filter bookings based on the mobile number
        const filteredBookings = data.filter(
          (booking) => booking.user_mobile_no === mobileNumber
        );

        setBookings(filteredBookings);
        console.log(filteredBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (mobileNumber) {
      fetchBookings(); // Fetch bookings only when a mobile number is provided
    }
  }, [mobileNumber]); // Re-run the effect when the mobile number changes

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate(); // Day without leading zero
    const month = date.toLocaleString("en-US", { month: "short" }); // Short month name
    const year = date.getFullYear(); // Full year
    return `${day} ${month} ${year}`;
  };

  const rate = 10;

  // Handles start reading submission
  const handleStartReadingSubmit = (id) => {
    if (!startReading[id] || startReading[id].trim() === "") {
      alert("Please enter the start reading!");
      return;
    }
    setRideStatus((prev) => ({ ...prev, [id]: "startReadingDone" }));
  };

  const handleEndReadingSubmit = (id, rate) => {
    if (!endReading[id] || endReading[id].trim() === "") {
      alert("Please enter the end reading!");
      return;
    }
    if (parseInt(endReading[id]) <= parseInt(startReading[id])) {
      alert("End reading must be greater than start reading!");
      return;
    }

    const distance = parseInt(endReading[id]) - parseInt(startReading[id]); // Calculate distance
    const fare = distance * rate; // Calculate fare

    setTotalFare((prev) => ({ ...prev, [id]: fare })); // Store fare in state
    setRideStatus((prev) => ({ ...prev, [id]: "endReadingDone" })); // Mark end reading as done
  };

  // Handles OTP submission for starting or ending a ride
  const handleOtpSubmit = (id, type) => {
    const otp = rideOtp[id];
    if (!otp || otp.length !== 4 || isNaN(otp)) {
      alert("Please enter a valid 4-digit OTP!");
      return;
    }

    if (type === "start") {
      alert(`OTP submitted for starting the ride!`);
      setRideStatus((prev) => ({ ...prev, [id]: "rideStarted" }));
      setRideOtp((prev) => ({ ...prev, [id]: "" })); // Reset OTP
    } else if (type === "end") {
      alert(`OTP submitted for ending the ride!`);
      setRideStatus((prev) => ({ ...prev, [id]: "rideEnded" }));
      setRideOtp((prev) => ({ ...prev, [id]: "" })); // Reset OTP
    }
  };

  const navigate = useNavigate();


  const handleGoHome = (rideId) => {
    // Pass any relevant payment data here, such as rideId or fare
    navigate(`/`);
  };




const handlePayment = (booking) => {
  try {
    // Constants
    const RouterDomain = "https://test.payplatter.in/Router/initiateTransaction";
    const merchantCode = "THE265";
    const username = "MPANKA261";
    const password = "[C@445aba30";
    const privateKey = "Wq0F6lS7A5tIJU90";
    const privateValue = "lo4syhqHnRjm4L0T";
    const successURL = "https://cab.payplatter.in/finalpaymentsuccess";
    const failureURL = "http://localhost:3000/payment-failure";

    // Payment Details
    const txnId = `txn_${Date.now()}`; // Unique transaction ID
    const amount = (totalFare[booking.id] - 25).toFixed(2); // Adjust fare by subtracting ₹25

    // Encrypt Query String
    const query = `?mcode=${merchantCode}&uname=${username}&psw=${password}&amount=${amount}&mtxnId=${txnId}&pfname=${booking.user_name}&pmno=${booking.user_mobile_no}&pemail=${booking.user_email}&surl=${successURL}&furl=${failureURL}`;
    const keyBytes = CryptoJS.enc.Utf8.parse(privateKey.padEnd(16, "0").slice(0, 16));
    const ivBytes = CryptoJS.enc.Utf8.parse(privateValue);
    const encryptedQuery = CryptoJS.AES.encrypt(query, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString().replace(/\+/g, "%2B");

    // Construct Final Payment URL
    const paymentUrl = `${RouterDomain}?query=${encryptedQuery}&mcode=${merchantCode}`;

    // Save Details in SessionStorage
    sessionStorage.setItem("user_id", booking.user_id); // Set the user ID
    sessionStorage.setItem("bookingId", booking.booking_id); 
    sessionStorage.setItem("fare", amount); // Set the adjusted fare

    // Redirect to Payment Gateway
    window.location.href = paymentUrl;
  } catch (error) {
    console.error("Error initializing payment:", error);
    alert("An error occurred while processing payment. Please try again.");
  }
};



const sendStartOtp = async (driverName, driverMobile, startReading, otp) => {
  try {
    if (!startReading || !otp) {
      alert("Start reading or OTP is missing!");
      return;
    }

    // Replace template variables
    const message = encodeURIComponent(
      `Dear Driver, 
      Kindly confirm the meter reading: ${startReading} and share the OTP ${otp} with the passenger to start the ride. 
      Jhansi Smart City - Larsen and Toubro Limited`
    );

    // API URL
    const apiUrl = `https://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=${message}&senderId=JSICCC&routeId=1&mobileNos=${driverMobile}&smsContentType=english`;

    // Make API call
    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      alert("Start OTP sent successfully!");
    } else {
      alert("Failed to send OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error sending Start OTP:", error);
    alert("An error occurred while sending Start OTP.");
  }
};


const sendEndOtp = async (driverName, driverMobile, endReading, otp) => {
  try {
    if (!endReading || !otp) {
      alert("End reading or OTP is missing!");
      return;
    }

    // Replace template variables
    const message = encodeURIComponent(
      `Dear Driver, 
      Kindly confirm the meter reading: ${endReading} and share the OTP ${otp} with the passenger to end the ride. 
      Jhansi Smart City - Larsen and Toubro Limited`
    );

    // API URL
    const apiUrl = `https://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=${message}&senderId=JSICCC&routeId=1&mobileNos=${driverMobile}&smsContentType=english`;

    // Make API call
    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      alert("End OTP sent successfully!");
    } else {
      alert("Failed to send OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error sending End OTP:", error);
    alert("An error occurred while sending End OTP.");
  }
};




  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white shadow-lg p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-4 md:mb-6">
          Dashboard
        </h2>
        <div className="space-y-3 md:space-y-4">
          <button
            onClick={() => setActiveTab("myRides")}
            className={`w-full text-left px-3 py-2 md:px-4 md:py-3 rounded-lg text-base md:text-lg font-medium transition ${
              activeTab === "myRides"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            My Rides
          </button>
          <button
            // onClick={() => setActiveTab("bookRide")}
            onClick={handleGoHome}
            className={`w-full text-left px-3 py-2 md:px-4 md:py-3 rounded-lg text-base md:text-lg font-medium transition ${
              activeTab === "bookRide"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            Book a Ride
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-1/2 p-6">
        {activeTab === "myRides" && (
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">
              Upcoming Rides
            </h3>
            {bookings.length > 0 ? (
              <div className="">
                {bookings.map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="bg-white mb-5 shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition"
                  >
                    {/* Buttons on Top */}
                    <div className="flex justify-between gap-1 mb-10">
                      <button
                        disabled={rideStatus[booking.id] === "rideStarted"}
                        onClick={() =>
                          setRideStatus((prev) => ({
                            ...prev,
                            [booking.id]: "start",
                          }))
                        }
                        className={`flex-1 px-3 py-2 text-sm text-white rounded-md shadow-md transition ${
                          rideStatus[booking.id] === "rideStarted"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        Start Ride
                      </button>

                      <button
                        disabled={rideStatus[booking.id] !== "rideStarted"}
                        onClick={() =>
                          setRideStatus((prev) => ({
                            ...prev,
                            [booking.id]: "end",
                          }))
                        }
                        className={`flex-1 px-3 py-2 text-sm text-white rounded-md shadow-md transition ${
                          rideStatus[booking.id] === "rideStarted"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        End Ride
                      </button>
                    </div>

                    {/* Ride Header */}
                    <div className="flex justify-between items-center mb-4 md:mb-8">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaCalendarAlt className="text-blue-500" />
                        <span className="text-lg font-semibold">
                          Date: {formatDate(booking.booking_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaClock className="text-blue-500" />
                        <span className="text-lg font-semibold">
                          {booking.booking_time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUserAlt className="text-green-500" />
                        <span className="font-medium text-sm">
                          Driver: {booking.driver_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCarAlt className="text-yellow-500" />
                        <span className="font-medium text-sm">
                          {" "}
                          Cab: {booking.cab_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaMoneyBillAlt className="text-green-500" />{" "}
                        {/* Rate icon */}
                        <span className="font-medium text-sm">
                          Rate: {rate} Rs/Km
                        </span>
                      </div>
                    </div>
                    {/* Divider */}
                    <hr className="my-4 border-gray-300" />
                    {/* Start Reading */}
                    {(rideStatus[booking.id] === "start" ||
                      rideStatus[booking.id] === "startReadingDone") && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Enter Start Reading:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter Start Reading"
                            value={startReading[booking.id] || ""}
                            onChange={(e) =>
                              setStartReading((prev) => ({
                                ...prev,
                                [booking.id]: e.target.value,
                              }))
                            }
                          />
                       <button
  onClick={async () => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000); // Generate OTP
      await sendStartOtp(booking.driver_name, booking.driver_mobile_no, startReading[booking.id], otp);
      handleStartReadingSubmit(booking.id); // Call existing function
    } catch (error) {
      console.error("Error handling Start Reading:", error);
    }
  }}
  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
>
  Go
</button>

                        </div>
                      </div>
                    )}
                    {/* OTP Section */}
                    {rideStatus[booking.id] === "startReadingDone" && (
                      <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Enter OTP:
                        </label>

                        <div className="flex items-center gap-2 mt-2">
                          {Array(4)
                            .fill("")
                            .map((_, index) => (
                              <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-blue-400 text-lg font-normal"
                                ref={(el) => (otpRefs.current[index] = el)} // Add ref for each input
                                value={rideOtp[booking.id]?.[index] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d?$/.test(value)) {
                                    // Allow only one digit
                                    const otpArray = rideOtp[booking.id]?.split(
                                      ""
                                    ) || ["", "", "", ""];
                                    otpArray[index] = value;
                                    setRideOtp((prev) => ({
                                      ...prev,
                                      [booking.id]: otpArray.join(""),
                                    }));
                                    // Move focus to the next box
                                    if (value && index < 3) {
                                      otpRefs.current[index + 1].focus();
                                    }
                                  }
                                }}
                                onKeyDown={(e) => {
                                  // Handle backspace to go to the previous box
                                  if (
                                    e.key === "Backspace" &&
                                    !e.target.value &&
                                    index > 0
                                  ) {
                                    otpRefs.current[index - 1].focus();
                                  }
                                }}
                              />
                            ))}
                          <button
                            onClick={async () => {
                              try {
                                const otp = rideOtp[booking.id];
                                if (!otp || otp.length !== 4 || isNaN(otp)) {
                                  alert("Please enter a valid 4-digit OTP!");
                                  return;
                                }

                                const cabId = booking.cab_id; // Extract cab ID from booking data

                                // Make API call to update cab status
                                const response = await axios.put(
                                  `https://cabapi.payplatter.in/api/cars/${cabId}`,
                                  {
                                    ride_status: "started",
                                    status: "not available",
                                  }
                                );

                                if (response.status === 200) {
                                  // Handle OTP submission logic
                                  alert("OTP submitted for starting the ride!");
                                  setRideStatus((prev) => ({
                                    ...prev,
                                    [booking.id]: "rideStarted",
                                  }));
                                  setRideOtp((prev) => ({
                                    ...prev,
                                    [booking.id]: "",
                                  })); // Reset OTP
                                }
                              } catch (error) {
                                console.error(
                                  "Error updating ride status:",
                                  error
                                );
                                alert(
                                  "Failed to start the ride. Please try again."
                                );
                              }
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Submit OTP
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Message */}
                    {rideStatus[booking.id] === "rideStarted" && (
                      <div className="mt-4">
                        <p className="text-green-500 font-semibold">
                          Your ride has started!!
                        </p>
                        <p className="text-gray-700 font-semibold mt-3">
                          Start Reading:{" "}
                          {startReading[booking.id] || "Not provided"}
                        </p>
                      </div>
                    )}

                    {/* End Reading */}
                    {(rideStatus[booking.id] === "end" ||
                      rideStatus[booking.id] === "endReadingDone") && (
                      <div>
                        <p className="text-gray-700 font-semibold mt-3 mb-5">
                          Start Reading:{" "}
                          <span className="font-bold">
                            {startReading[booking.id] || "Not provided"}
                          </span>
                        </p>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Enter End Reading:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter End Reading"
                            value={endReading[booking.id] || ""}
                            onChange={(e) =>
                              setEndReading((prev) => ({
                                ...prev,
                                [booking.id]: e.target.value,
                              }))
                            }
                          />
                          <button
  onClick={async () => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000); // Generate OTP
      await sendEndOtp(booking.driver_name, booking.driver_mobile_no, endReading[booking.id], otp);
      handleEndReadingSubmit(booking.id, rate); // Call existing function
    } catch (error) {
      console.error("Error handling End Reading:", error);
    }
  }}
  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
>
  Go
</button>

                        </div>
                      </div>
                    )}
                    {rideStatus[booking.id] === "endReadingDone" && (
                      <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Enter OTP:
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                          {Array(4)
                            .fill("")
                            .map((_, index) => (
                              <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-blue-400 text-lg font-normal"
                                ref={(el) => (otpRefs.current[index] = el)} // Add ref for each input
                                value={rideOtp[booking.id]?.[index] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d?$/.test(value)) {
                                    // Allow only one digit
                                    const otpArray = rideOtp[booking.id]?.split(
                                      ""
                                    ) || ["", "", "", ""];
                                    otpArray[index] = value;
                                    setRideOtp((prev) => ({
                                      ...prev,
                                      [booking.id]: otpArray.join(""),
                                    }));
                                    // Move focus to the next box
                                    if (value && index < 3) {
                                      otpRefs.current[index + 1].focus();
                                    }
                                  }
                                }}
                                onKeyDown={(e) => {
                                  // Handle backspace to go to the previous box
                                  if (
                                    e.key === "Backspace" &&
                                    !e.target.value &&
                                    index > 0
                                  ) {
                                    otpRefs.current[index - 1].focus();
                                  }
                                }}
                              />
                            ))}
                          <button
                            onClick={async () => {
                              try {
                                const otp = rideOtp[booking.id];
                                if (!otp || otp.length !== 4 || isNaN(otp)) {
                                  alert("Please enter a valid 4-digit OTP!");
                                  return;
                                }

                                const cabId = booking.cab_id; // Extract cab ID from booking data

                                // Make API call to update cab status
                                const response = await axios.put(
                                  `https://cabapi.payplatter.in/api/cars/${cabId}`,
                                  {
                                    ride_status: "ended",
                                    status: "available",
                                  }
                                );

                                if (response.status === 200) {
                                  // Handle OTP submission logic
                                  alert("OTP submitted for ending the ride!");
                                  setRideStatus((prev) => ({
                                    ...prev,
                                    [booking.id]: "rideEnded",
                                  }));
                                  setRideOtp((prev) => ({
                                    ...prev,
                                    [booking.id]: "",
                                  })); // Reset OTP
                                }
                              } catch (error) {
                                console.error(
                                  "Error updating ride status:",
                                  error
                                );
                                alert(
                                  "Failed to end the ride. Please try again."
                                );
                              }
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Submit OTP
                          </button>
                        </div>
                      </div>
                    )}

                    {rideStatus[booking.id] === "rideEnded" && (
                      <p className="mt-4 text-red-500 font-semibold">
                        Ride ended successfully!
                      </p>
                    )}
                    {rideStatus[booking.id] === "rideEnded" && (
  <>
    <div className="mt-4 flex items-center justify-between">
      <p className="text-red-500 font-semibold">
        Total Fare: ₹{totalFare[booking.id] ? totalFare[booking.id] - 25 : 0}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  </>
)}

                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You have no upcoming rides.</p>
            )}
          </div>
        )}

        {activeTab === "bookRide" && (
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              Book a Ride
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengersDetails;
