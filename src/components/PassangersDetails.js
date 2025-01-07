


import React, { useState } from "react";
import { FaCarAlt, FaUserAlt, FaClock, FaCalendarAlt } from "react-icons/fa";

const PassengersDetails = () => {
  const [activeTab, setActiveTab] = useState("myRides");
  const [rideStatus, setRideStatus] = useState({}); // Tracks the state of each ride (started/ended)
  const [startReading, setStartReading] = useState({});
  const [endReading, setEndReading] = useState({});
  const [rideOtp, setRideOtp] = useState({});
  const [startRideComplete, setStartRideComplete] = useState(false); // Toggles End Ride button state

  const upcomingRides = [
    {
      id: 1,
      date: "2025-01-08",
      time: "10:00 AM",
      driver: "Tejas Khadke",
      Cab: "Toyota Prius",
    },
    {
      id: 2,
      date: "2025-01-10",
      time: "2:00 PM",
      driver: "Bhargav Kalrapudi",
      Cab: "Honda Civic",
    },
  ];

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const handleStartReadingSubmit = (id) => {
    if (!startReading[id] || startReading[id].trim() === "") {
      alert("Please enter the start reading!");
      return;
    }
    setRideStatus((prev) => ({ ...prev, [id]: "startReadingDone" }));
  };

  const handleEndReadingSubmit = (id) => {
    if (!endReading[id] || endReading[id].trim() === "") {
      alert("Please enter the end reading!");
      return;
    }
    setRideStatus((prev) => ({ ...prev, [id]: "endReadingDone" }));
  };

  const handleOtpSubmit = (id, type) => {
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
  
  
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Dashboard
        </h2>
        <div className="space-y-4">
          <button
            onClick={() => setActiveTab("myRides")}
            className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition ${
              activeTab === "myRides"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            My Rides
          </button>
          <button
            onClick={() => setActiveTab("bookRide")}
            className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition ${
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
      <div className="w-3/4 p-6">
        {activeTab === "myRides" && (
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">
              Upcoming Rides
            </h3>
            {upcomingRides.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {upcomingRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition"
                  >
                    {/* Buttons on Top */}
                    <div className="flex justify-between gap-1 mb-10">
                    <button
  disabled={rideStatus[ride.id] === "rideStarted"}
  onClick={() => setRideStatus((prev) => ({ ...prev, [ride.id]: "start" }))}
  className={`flex-1 px-3 py-2 text-sm text-white rounded-md shadow-md transition ${
    rideStatus[ride.id] === "rideStarted"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  Start Ride
</button>

<button
  disabled={rideStatus[ride.id] !== "rideStarted"}
  onClick={() => setRideStatus((prev) => ({ ...prev, [ride.id]: "end" }))}
  className={`flex-1 px-3 py-2 text-sm text-white rounded-md shadow-md transition ${
    rideStatus[ride.id] === "rideStarted"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  End Ride
</button>


</div>

                    {/* Ride Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaCalendarAlt className="text-blue-500" />
                        <span className="text-lg font-semibold">
                          Date: {formatDate(ride.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaClock className="text-blue-500" />
                        <span className="text-lg font-semibold">
                          {ride.time}
                        </span>
                      </div>
                    </div>
                                  <div className="flex items-center gap-4 mb-4">
                       <div className="flex items-center gap-2 text-gray-600">
                         <FaUserAlt className="text-green-500" />
                         <span className="font-medium">Driver: {ride.driver}</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-600">
                         <FaCarAlt className="text-yellow-500" />
                         <span className="font-medium">Cab: {ride.Cab}</span>
                       </div>
                     </div>
                    {/* Divider */}
                    <hr className="my-4 border-gray-300" />
                    {/* Start Reading */}
                    {rideStatus[ride.id] === "start" && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Enter Start Reading:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter Start Reading"
                            value={startReading[ride.id] || ""}
                            onChange={(e) =>
                              setStartReading((prev) => ({
                                ...prev,
                                [ride.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleStartReadingSubmit(ride.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Go
                          </button>
                        </div>
                      </div>
                    )}
                    {/* OTP Section */}
                    {rideStatus[ride.id] === "startReadingDone" && (
                      <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Enter OTP:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter OTP"
                            value={rideOtp[ride.id] || ""}
                            onChange={(e) =>
                              setRideOtp((prev) => ({
                                ...prev,
                                [ride.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleOtpSubmit(ride.id, "start")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Submit OTP
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Message */}
                    {rideStatus[ride.id] === "rideStarted" && (
                      <p className="mt-4 text-green-500 font-semibold">
                        Your ride has started!!
                      </p>
                    )}
                    {/* End Reading */}
                    {rideStatus[ride.id] === "end" && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Enter End Reading:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter End Reading"
                            value={endReading[ride.id] || ""}
                            onChange={(e) =>
                              setEndReading((prev) => ({
                                ...prev,
                                [ride.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleEndReadingSubmit(ride.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Go
                          </button>
                        </div>
                      </div>
                    )}
                    {rideStatus[ride.id] === "endReadingDone" && (
                      <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">
                          Enter OTP:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter OTP"
                            value={rideOtp[ride.id] || ""}
                            onChange={(e) =>
                              setRideOtp((prev) => ({
                                ...prev,
                                [ride.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleOtpSubmit(ride.id, "end")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Submit OTP
                          </button>
                        </div>
                      </div>
                    )}
                    {rideStatus[ride.id] === "rideEnded" && (
                      <p className="mt-4 text-red-500 font-semibold">
                        Ride ended successfully!
                      </p>
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
            <p className="text-gray-600">Ride booking functionality will be here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengersDetails;
