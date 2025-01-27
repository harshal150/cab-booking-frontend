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
import CONFIG from "../config";
const PassengersDetails = () => {
  const [activeTab, setActiveTab] = useState("myRides");
  const [rideStatus, setRideStatus] = useState({}); // Tracks status per booking
  const [startReading, setStartReading] = useState({}); // Tracks start reading per booking
  const [endReading, setEndReading] = useState({}); // Tracks end reading per booking
  const [rideOtp, setRideOtp] = useState({}); // Tracks OTP per booking
  const [totalFare, setTotalFare] = useState({}); // Tracks fare per booking
  const [bookings, setBookings] = useState([]); // Stores booking data fetched from API
  const [transactionId, setTransactionId] = useState(null); // State to store the transaction ID
  const [randomNumber, setRandomNumber] = useState("");
  const [calculatedNewAmount, setcalculatedNewAmount] = useState("");

  const otpRefs = useRef([]);
  const mobileNumber = sessionStorage.getItem("mobileNumber");

  const DOMAIN = CONFIG.REACT_APP_API_DOMAIN;
  useEffect(() => {
    fetchMyRides(); // Initial load of bookings
  }, []);
  

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         // Retrieve the mobile number from sessionStorage
//         const mobileNumber = sessionStorage.getItem("updatedmobilenumber");
// console.log(mobileNumber)
//         if (!mobileNumber) {
//           console.warn("No mobile number found in sessionStorage.");
//           return;
//         }

//         const response = await axios.get(
//           "h${DOMAIN}/api/bookings"
//         );
//         const data = response.data || [];

//         // Filter bookings based on the mobile number and booking status
//         const filteredBookings = data.filter(
//           (booking) =>
//             booking.user_mobile_no === mobileNumber &&
//             booking.status === "success" && 
//             booking.ride_status === "not started"
//         );

//         setBookings(filteredBookings);
//         console.log("Filtered Bookings:", filteredBookings); // Debug log
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       }
//     };

//     fetchBookings(); // Call the function to fetch and filter bookings
//   }, []);

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

    setTotalFare((prev) => ({ ...prev, [id]: fare })); // Update only for this booking
    setRideStatus((prev) => ({ ...prev, [id]: "endReadingDone" })); // Update only for this booking
  };

  // Handles OTP submission for starting or ending a ride
  const handleOtpSubmit = async (id, type) => {
    const otp = rideOtp[id]; // Get OTP for this booking
    const storedOtp =
      type === "start"
        ? localStorage.getItem(
            `otp_${bookings.find((b) => b.id === id).driver_mobile_no}`
          )
        : localStorage.getItem(
            `end_otp_${bookings.find((b) => b.id === id).driver_mobile_no}`
          );

    if (!otp || otp.length !== 4 || isNaN(otp)) {
      alert("Please enter a valid 4-digit OTP!");
      return;
    }

    if (otp === storedOtp) {
      if (type === "start") {
        alert(`OTP verified! Starting the ride.`);
        setRideStatus((prev) => ({ ...prev, [id]: "rideStarted" }));
        setRideOtp((prev) => ({ ...prev, [id]: "" })); // Reset OTP for this booking
      } else if (type === "end") {
        alert(`OTP verified! Ending the ride.`);
        setRideStatus((prev) => ({ ...prev, [id]: "rideEnded" }));
        setRideOtp((prev) => ({ ...prev, [id]: "" })); // Reset OTP for this booking
      }
    } else {
      alert("Incorrect OTP. Please enter the correct 4-digit OTP!");
    }
  };

  const navigate = useNavigate();

  const handleGoHome = (rideId) => {
    // Pass any relevant payment data here, such as rideId or fare
    navigate(`/`);
  };

  const handlePayment = (booking) => {
    console.log("Booking object in handlePayment:", booking); // Debug log
    const cabId = booking.cab_id;
    console.log(cabId);
    const driverid = booking.driverid;
    console.log(driverid);




    const calculatedAmount = calculatedNewAmount;
    const rideId = localStorage.getItem("rideId");

    console.log(calculatedAmount)
    console.log(rideId)

    if (!calculatedAmount || !rideId) {
      alert("Required payment details not found. Please try again.");
      return;
    }
    try {
      // Constants
      // const RouterDomain =
      //   "https://test.payplatter.in/Router/initiateTransaction";
      // const merchantCode = "THE265";
      // const username = "MPANKA261";
      // const password = "[C@445aba30";
      // const privateKey = "Wq0F6lS7A5tIJU90";
      // const privateValue = "lo4syhqHnRjm4L0T";
      // const successURL = "http://localhost:3000/finalpaymentsuccess";
      // const failureURL = "http://localhost:3000/finalpaymentfailure";

      // const RouterDomain = "https://bookings.smartcityjhansi.com/Router/initiateTransaction";
      // const merchantCode = "JHA434";
      // const username = "MJHANS434";
      // const password = "[C@1ba15716";
      // const privateKey = "7R7WkmrgZilbokoB";
      // const privateValue = "x8mYTSawyBGpM9iq";
      // const successURL = "https://cab.payplatter.in/finalpaymentsuccess";
      // const failureURL = "https://cab.payplatter.in/finalpaymentfailure";


      const RouterDomain = process.env.REACT_APP_ROUTER_DOMAIN;
const merchantCode = process.env.REACT_APP_MERCHANT_CODE;
const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const privateValue = process.env.REACT_APP_PRIVATE_VALUE;

// URLs without txnId
const successURL = process.env.REACT_APP_FINAL_SUCCESS_URL;
const failureURL = process.env.REACT_APP_FINAL_FAILURE_URL;

console.log("RouterDomain:", RouterDomain);
console.log("Success URL:", successURL);
console.log("Failure URL:", failureURL);


      // Payment Details
      const txnId = `txn_${Date.now()}`; // Unique transaction ID
      const amount = totalFare[booking.id]; // Adjust fare by subtracting ₹25

      // Encrypt Query String
      const query = `?mcode=${merchantCode}&uname=${username}&psw=${password}&amount=${calculatedAmount.toFixed(
      2
    )}&mtxnId=${rideId}&pfname=${booking.user_name}&pmno=${booking.user_mobile_no}&pemail=${booking.user_email}&surl=${successURL}&furl=${failureURL}`;
      const keyBytes = CryptoJS.enc.Utf8.parse(privateKey.padEnd(16, "0").slice(0, 16));
      const ivBytes = CryptoJS.enc.Utf8.parse(privateValue);
      const encryptedQuery = CryptoJS.AES.encrypt(query, keyBytes, {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      })
        .toString()
        .replace(/\+/g, "%2B");

      // Construct Final Payment URL
      const paymentUrl = `${RouterDomain}?query=${encryptedQuery}&mcode=${merchantCode}`;

      // Save Booking and Payment Details in SessionStorage and LocalStorage
      sessionStorage.setItem("fare", amount); // Set the adjusted fare
      sessionStorage.setItem("txnId", txnId); // Set the transaction ID

      // Store booking data in localStorage
      const bookingDetails = {
        booking_id: booking.booking_id,
        booking_date: booking.booking_date,
        cab_name: booking.cab_name,
        user_id: booking.user_id,
        user_name: booking.user_name,
        user_mobile_no: booking.user_mobile_no,
        cabId: cabId,
      };

      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

      // Log to confirm the data stored
      console.log("Booking Details Stored in LocalStorage:", bookingDetails);

      // Redirect to Payment Gateway
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert("An error occurred while processing payment. Please try again.");
    }
  };

  // const sendStartOtp = async (driverName, driverMobile, startReading, otp) => {
  //   try {
  //     if (!startReading || !otp) {
  //       alert("Start reading or OTP is missing!");
  //       return;
  //     }
  //     console.log("otp ride start", otp);

  //     // Replace template variables
  //     const message = encodeURIComponent(
  //       `Dear Driver,
  //     Kindly confirm the meter reading: ${startReading} and share the OTP ${otp} with the passenger to start the ride.
  //     Jhansi Smart City - Larsen and Toubro Limited`
  //     );

  //     // API URL
  //     const apiUrl = `https://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=${message}&senderId=JSICCC&routeId=1&mobileNos=${driverMobile}&smsContentType=english`;

  //     // Make API call
  //     const response = await axios.get(apiUrl);

  //     if (response.status === 200) {
  //       // Store the generated OTP in localStorage with a unique key
  //       localStorage.setItem(`otp_${driverMobile}`, otp);
  //       alert("Start OTP sent successfully!");
  //     } else {
  //       alert("Failed to send OTP. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending Start OTP:", error);
  //     alert("An error occurred while sending Start OTP.");
  //   }
  // };

  // const sendEndOtp = async (driverName, driverMobile, endReading, otp) => {
  //   try {
  //     if (!endReading || !otp) {
  //       alert("End reading or OTP is missing!");
  //       return;
  //     }

  //     // Replace template variables
  //     const message = encodeURIComponent(
  //       `Dear Driver,
  //     Kindly confirm the meter reading: ${endReading} and share the OTP ${otp} with the passenger to end the ride.
  //     Jhansi Smart City - Larsen and Toubro Limited`
  //     );

  //     // API URL
  //     const apiUrl = `https://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=${message}&senderId=JSICCC&routeId=1&mobileNos=${driverMobile}&smsContentType=english`;

  //     // Make API call
  //     const response = await axios.get(apiUrl);

  //     if (response.status === 200) {
  //       // Store the generated OTP in localStorage with a unique key
  //       localStorage.setItem(`end_otp_${driverMobile}`, otp);
  //       alert("End OTP sent successfully!");
  //     } else {
  //       alert("Failed to send OTP. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending End OTP:", error);
  //     alert("An error occurred while sending End OTP.");
  //   }
  // };

  const sendStartOtp = async (driverName, driverMobile, startReading, otp) => {
    try {
      if (!startReading || !otp) {
        alert("Start reading or OTP is missing!");
        return;
      }

      // Construct message for ride start
      const message = `Dear Driver, Kindly confirm the meter reading: ${startReading} and share OTP ${otp} with the passenger to start the ride. Jhansi Smart City - Larsen and Toubro Limited`;

      // API URL
      const apiUrl = `https://payplatter.in/otpSend.php?mobileNos=${encodeURIComponent(
        driverMobile
      )}&message=${encodeURIComponent(message)}`;

      // Make API call
      const response = await axios.get(apiUrl);
      console.log("Sending Start OTP and Reading:", {
        driverName,
        driverMobile,
        startReading,
        otp,
      });
      if (response.status === 200) {
        // Store the generated OTP in localStorage with a unique key
        localStorage.setItem(`otp_${driverMobile}`, otp);
        alert("Start OTP sent successfully!");
      } else {
        alert("Failed to send Start OTP. Please try again.");
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

      // Construct message for ride end
      const message = `Dear Driver, Kindly confirm the meter reading: ${endReading} and share OTP ${otp} with the passenger to end the ride. Jhansi Smart City - Larsen and Toubro Limited`;

      // API URL
      const apiUrl = `https://payplatter.in/otpSend.php?mobileNos=${encodeURIComponent(
        driverMobile
      )}&message=${encodeURIComponent(message)}`;

      // Make API call
      const response = await axios.get(apiUrl);
      console.log("Sending End OTP and Reading:", {
        driverName,
        driverMobile,
        endReading,
        otp,
      });

      if (response.status === 200) {
        // Store the generated OTP in localStorage with a unique key
        localStorage.setItem(`end_otp_${driverMobile}`, otp);
        alert("End OTP sent successfully!");
      } else {
        alert("Failed to send End OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending End OTP:", error);
      alert("An error occurred while sending End OTP.");
    }
  };

  const handleFetchCompletedRides = async () => {
    try {
      const mobileNumber = sessionStorage.getItem("updatedmobilenumber");

      if (!mobileNumber) {
        console.warn("No mobile number found in sessionStorage.");
        return;
      }

      const response = await axios.get(
        `${DOMAIN}/api/bookings`
      );
      const data = response.data || [];
console.log(mobileNumber)
      // Filter bookings based on the mobile number and booking status
      const filteredBookings = data.filter(
        (booking) =>
          booking.user_mobile_no === mobileNumber &&
          booking.ride_status === "ended"
      );

      setBookings(filteredBookings);
      console.log("Completed Bookings:", filteredBookings); // Debug log
    } catch (error) {
      console.error("Error fetching completed bookings:", error);
    }
  };



  const generateRandomNumber = () => {
    // Get the current date
    const now = new Date();

    // Format date as DDMMYY
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2); // Last two digits of the year

    // Get seconds
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Generate a random 2-digit number
    const randomDigits = Math.floor(Math.random() * 90 + 10); // Ensures two digits (10-99)

    // Combine all parts
    const generatedNumber = `${day}${month}${year}${seconds}${randomDigits}`;

    // Update state with the generated number
    setRandomNumber(generatedNumber);
  };



  const fetchMyRides = async () => {
    try {
      const mobileNumber = sessionStorage.getItem("updatedmobilenumber");
      console.log(mobileNumber);
      if (!mobileNumber) {
        console.warn("No mobile number found in sessionStorage.");
        return;
      }
  
      const response = await axios.get(`${DOMAIN}/api/bookings`)
      const data = response.data || [];
  
      // Filter bookings for "My Rides"
      const filteredBookings = data.filter(
        (booking) =>
          booking.user_mobile_no === mobileNumber &&
          booking.status === "success" &&
          booking.ride_status === "not started"
      );
  
      setBookings(filteredBookings);
      console.log("Filtered Bookings:", filteredBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
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
            // onClick={() => setActiveTab("myRides")}
            onClick={() => {
    setActiveTab("myRides");
    fetchMyRides(); // Fetch the bookings when switching to "My Rides"
  }}
            
            className={`w-full text-left px-3 py-2 md:px-4 md:py-3 rounded-lg text-base md:text-lg font-medium transition ${
              activeTab === "myRides"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            My Rides
          </button>

          <button
            onClick={() => {
              setActiveTab("completedRides");
              handleFetchCompletedRides(); // Fetch completed rides when this tab is clicked
            }}
            className={`w-full text-left px-3 py-2 md:px-4 md:py-3 rounded-lg text-base md:text-lg font-medium transition ${
              activeTab === "completedRides"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            Completed Rides
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

                      {/* <button
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
                      </button> */}

                      <button
  disabled={rideStatus[booking.id] === "rideStarted"}
  onClick={async () => {
    console.log(booking.booking_id)
    try {
      const response = await axios.put(
        `${DOMAIN}/api/bookings/update/${booking.booking_id}`, // API endpoint
        {
          ride_status: "running", // Data to update the status
        }
      );

      if (response.status === 200) {
        // Successfully updated the status
        alert("Ride status updated to 'running'!");
        setRideStatus((prev) => ({
          ...prev,
          [booking.id]: "start",
        }));
      } else {
        alert("Failed to update the ride status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating ride status:", error);
      alert("An error occurred while updating the ride status. Please try again.");
    }
  }}
  className={`flex-1 px-3 py-2 text-sm text-white rounded-md shadow-md transition ${
    rideStatus[booking.id] === "rideStarted"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  Start Ride
</button>


                      {/* <button
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
                      </button> */}

{/* 
                      <button
  disabled={rideStatus[booking.id] !== "rideStarted"}
  onClick={async () => {
    try {
      // Fetch all transactions
      const response = await axios.get(`${DOMAIN}/api/transactions")`

      if (response.status === 200) {
        const transactions = response.data; // Array of all transactions
        console.log("All Transactions:", transactions); // Debug log for all transactions

        // Find the transaction matching the current booking ID
        const matchingTransaction = transactions.find(
          (transaction) => transaction.booking_id === booking.booking_id
        );

        if (matchingTransaction) {
          console.log("Matching Transaction:", matchingTransaction);
          localStorage.setItem(
                "transactiongetid",
                matchingTransaction.id
              );
         
              localStorage.setItem(
                "CalculatedAmount",
                matchingTransaction.calculated_amount
              );

              // Update state with the transaction ID
              setTransactionId(matchingTransaction.id);

              console.log(
                "Transaction ID stored in state and localStorage:",
                matchingTransaction.id)
           
        } else {
          console.warn("No matching transaction found for the current booking.");
        }
      } else {
        console.warn("Failed to fetch transactions. Please try again.");
      }

      // Update ride status
      setRideStatus((prev) => ({
        ...prev,
        [booking.id]: "end",
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("An error occurred while fetching transactions. Please try again.");
    }
  }}
  className={`flex-1 px-3 py-2 text-sm text-white rounded-md shadow-md transition ${
    rideStatus[booking.id] === "rideStarted"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  End Ride
</button> */}


<button
  disabled={rideStatus[booking.id] !== "rideStarted"}
  onClick={async () => {
    try {
      // Fetch all transactions
      const response = await axios.get(`${DOMAIN}/api/transactions`)

      if (response.status === 200) {
        const transactions = response.data; // Array of all transactions
        console.log("All Transactions:", transactions); // Debug log for all transactions

        // Find the transaction matching the current booking ID
        const matchingTransaction = transactions.find(
          (transaction) => transaction.booking_id === booking.booking_id
        );

        if (matchingTransaction) {
          console.log("Matching Transaction:", matchingTransaction);
          localStorage.setItem(
            "transactiongetid",
            matchingTransaction.id
          );

          localStorage.setItem(
            "CalculatedAmount",
            matchingTransaction.calculated_amount
          );

          // Update state with the transaction ID
          setTransactionId(matchingTransaction.id);

          console.log(
            "Transaction ID stored in state and localStorage:",
            matchingTransaction.id
          );
        } else {
          console.warn("No matching transaction found for the current booking.");
        }
      } else {
        console.warn("Failed to fetch transactions. Please try again.");
      }

      // Call the API to update the booking status as "ended"
      const bookingUpdateResponse = await axios.put(
        `${DOMAIN}/api/bookings/update/${booking.booking_id}`,
        { ride_status: "ended" }
      );

      if (bookingUpdateResponse.status === 200) {
        console.log("Booking status updated to 'ended'");
        alert("Ride has ended successfully!");
      } else {
        console.warn("Failed to update booking status. Please try again.");
      }

      // Update ride status locally
      setRideStatus((prev) => ({
        ...prev,
        [booking.id]: "end",
      }));
    } catch (error) {
      console.error("Error during 'End Ride' process:", error);
      alert("An error occurred while processing 'End Ride'. Please try again.");
    }
  }}
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
                                const otp = Math.floor(
                                  1000 + Math.random() * 9000
                                ); // Generate OTP
                                await sendStartOtp(
                                  booking.driver_name,
                                  booking.driver_mobile_no,
                                  startReading[booking.id],
                                  otp
                                );
                                handleStartReadingSubmit(booking.id); // Call existing function
                              } catch (error) {
                                console.error(
                                  "Error handling Start Reading:",
                                  error
                                );
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
      const otp = rideOtp[booking.id]; // User-entered OTP
      const storedOtp = localStorage.getItem(
        `otp_${booking.driver_mobile_no}`
      ); // Retrieve stored OTP from localStorage

      // Validate the entered OTP
      if (!otp || otp.length !== 4 || isNaN(otp)) {
        alert("Please enter a valid 4-digit OTP!");
        return;
      }

      if (otp !== storedOtp) {
        alert("Incorrect OTP. Please enter the correct 4-digit OTP!");
        return;
      }

      const cabId = booking.cab_id; // Extract cab ID from booking data

      // Generate random ride_id
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = String(now.getFullYear()).slice(-2); // Last two digits of the year
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const randomDigits = Math.floor(Math.random() * 90 + 10); // Two-digit random number
      const rideId = `${day}${month}${year}${seconds}${randomDigits}`;

      // Make API call to update cab status
      const response = await axios.put(
        `${DOMAIN}/api/cars/${cabId}`,
        {
          ride_status: "started",
          status: "not available",
        }
      );

      if (response.status === 200) {
        // Call the API to update the transaction table
        const transactionResponse = await axios.post(
          `${DOMAIN}/api/transactions`,
          {
            created_date: new Date().toISOString().split("T")[0], // Current date
            user_id: booking.user_id, // Replace with actual user ID
            booking_id: booking.booking_id, // Current booking ID
            start_reading: startReading[booking.id], // Meter start reading value
            ride_id: rideId, // Randomly generated ride ID
          }
        );
        localStorage.setItem(
                "rideId", rideId
              );

    console.log("storednewid" ,rideId )

        if (transactionResponse.status === 201) {
          alert("Transaction updated successfully!");
          console.log("Transaction Data:", transactionResponse.data);

          // Handle OTP submission logic
          alert("OTP verified! Starting the ride.");
          setRideStatus((prev) => ({
            ...prev,
            [booking.id]: "rideStarted",
          }));
          setRideOtp((prev) => ({
            ...prev,
            [booking.id]: "",
          })); // Reset OTP
        } else {
          alert("Failed to update the transaction. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  }}
  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
>
  Submit OTP
</button>



                          {/* <button
                            onClick={async () => {
                              try {
                                const otp = rideOtp[booking.id]; // User-entered OTP
                                const storedOtp = localStorage.getItem(
                                  `otp_${booking.driver_mobile_no}`
                                ); // Retrieve stored OTP from localStorage

                                // Validate the entered OTP
                                if (!otp || otp.length !== 4 || isNaN(otp)) {
                                  alert("Please enter a valid 4-digit OTP!");
                                  return;
                                }

                                if (otp !== storedOtp) {
                                  alert(
                                    "Incorrect OTP. Please enter the correct 4-digit OTP!"
                                  );
                                  return;
                                }

                                const cabId = booking.cab_id; // Extract cab ID from booking data

                                // Make API call to update cab status
                                const response = await axios.put(
                                  `${DOMAIN}/api/cars/${cabId}`,
                                  {
                                    ride_status: "started",
                                    status: "not available",
                                  }
                                );

                                if (response.status === 200) {
                                  // Handle OTP submission logic
                                  alert("OTP verified! Starting the ride.");
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
                          </button> */}


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
                                const otp = Math.floor(
                                  1000 + Math.random() * 9000
                                ); // Generate OTP
                                await sendEndOtp(
                                  booking.driver_name,
                                  booking.driver_mobile_no,
                                  endReading[booking.id],
                                  otp
                                );
                                handleEndReadingSubmit(booking.id, rate); // Call existing function
                              } catch (error) {
                                console.error(
                                  "Error handling End Reading:",
                                  error
                                );
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



                          {/* <button
                            onClick={async () => {
                              try {
                                const otp = rideOtp[booking.id]; // User-entered OTP
                                const storedOtp = localStorage.getItem(
                                  `end_otp_${booking.driver_mobile_no}`
                                ); // Retrieve stored OTP

                                // Validate the entered OTP
                                if (!otp || otp.length !== 4 || isNaN(otp)) {
                                  alert("Please enter a valid 4-digit OTP!");
                                  return;
                                }

                                if (otp !== storedOtp) {
                                  alert(
                                    "Incorrect OTP. Please enter the correct 4-digit OTP!"
                                  );
                                  return;
                                }

                                const cabId = booking.cab_id; // Extract cab ID from booking data

                                // Make API call to update cab status
                                const response = await axios.put(
                                  `${DOMAIN}/api/cars/${cabId}`,
                                  {
                                    ride_status: "ended",
                                    status: "available",
                                  }
                                );

                                if (response.status === 200) {
                                  // Handle OTP submission logic
                                  alert("OTP verified! Ending the ride.");
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
                          </button> */}

                          <button
  onClick={async () => {
    try {
      const otp = rideOtp[booking.id]; // User-entered OTP
      const storedOtp = localStorage.getItem(
        `end_otp_${booking.driver_mobile_no}`
      ); // Retrieve stored OTP

      // Validate the entered OTP
      if (!otp || otp.length !== 4 || isNaN(otp)) {
        alert("Please enter a valid 4-digit OTP!");
        return;
      }

      if (otp !== storedOtp) {
        alert("Incorrect OTP. Please enter the correct 4-digit OTP!");
        return;
      }

      const cabId = booking.cab_id; // Extract cab ID from booking data

      // Make API call to update cab status
      const response = await axios.put(
        `${DOMAIN}/api/cars/${cabId}`,
        {
          ride_status: "ended",
          status: "available",
        }
      );

      if (response.status === 200) {
        // Update transaction data
        const transactionId = localStorage.getItem("transactiongetid"); // Retrieve stored transaction ID
        if (!transactionId) {
          alert("Transaction ID not found. Please try again.");
          return;
        }

        const startReadingValue = startReading[booking.id]; // Start reading value
        const endReadingValue = endReading[booking.id]; // End reading value

        if (!endReadingValue || parseInt(endReadingValue) <= parseInt(startReadingValue)) {
          alert("End reading must be greater than start reading!");
          return;
        }

        const readingDifference = parseInt(endReadingValue) - parseInt(startReadingValue);
        console.log("reading difference", readingDifference);
        const rate = 10; // Fixed rate
        const calculatedAmount = readingDifference * rate;
        setcalculatedNewAmount(calculatedAmount)
        console.log("Calculated amount", calculatedAmount);
        console.log("transactionId ", transactionId);
        console.log("readingDifference ", readingDifference);
        console.log("end_reading ", endReadingValue);
            

        const transactionUpdateResponse = await axios.put(
          `${DOMAIN}/api/transactions/${transactionId}`,
          {
            end_reading: endReadingValue,
            reading_difference: readingDifference,
            rate: rate,
            calculated_amount: calculatedAmount,
          }
        );

        if (transactionUpdateResponse.status === 200) {
          alert("Transaction updated successfully!");
          console.log("Updated Transaction Data:", transactionUpdateResponse.data);
        } else {
          console.warn("Failed to update the transaction. Please try again.");
        }

        // Handle OTP submission logic
        alert("OTP verified! Ending the ride.");
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
      console.error("Error updating ride or transaction:", error);
     console.log("hiiii")
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
                            Total Fare: ₹{totalFare[booking.id]}
                          </p>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                            onClick={() => handlePayment(booking)}
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

        {activeTab === "completedRides" && (
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">
              Completed Rides
            </h3>
            {bookings.length > 0 ? (
              <div className="">
                {bookings.map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="bg-white mb-5 shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition"
                  >
                    {/* Ride Details */}
                    <div className="flex justify-between items-center mb-4">
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
                          Cab: {booking.cab_name}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-2 text-gray-600">
                        <FaMoneyBillAlt className="text-green-500" />
                        <span className="font-medium text-sm">
                          Total Fare: ₹{booking.total_fare || "Not Provided"}
                        </span>
                      </div> */}
                    </div>
                    {/* Divider */}
                    <hr className="my-4 border-gray-300" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You have no completed rides.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengersDetails;
