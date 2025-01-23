


import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { all } from "axios";

const PaymentSuccess = () => {
  const bookingInProgress = useRef(false); // Prevent duplicate API calls
  const navigate = useNavigate();


  const [decryptedQuery, setDecryptedQuery] = useState(null); // State for decrypted query
  const [latestBooking, setLatestBooking] = useState(null);   // State for latest booking



  const decryptData = (encryptedData, iv, key) => {
    const keyBytes = CryptoJS.enc.Utf8.parse(key.padEnd(16, "0").slice(0, 16));
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };




  useEffect(() => {
    // Step 1: Extract encrypted query from URL
    const encryptedQuery = new URLSearchParams(window.location.search).get("query");

    if (!encryptedQuery) {
      console.error("No query parameter found in URL.");
      return;
    }
console.log(encryptedQuery)
    // Step 2: Define decryption keys (must match the encryption process)
    const privateKey = "Wq0F6lS7A5tIJU90"; // Replace with your actual private key
    const privateValue = "lo4syhqHnRjm4L0T"; // Replace with your actual private value

    try {
      // Step 3: Decrypt the query
      const decryptedQuery = decryptData(encryptedQuery, privateValue, privateKey);
      const parsedQuery = new URLSearchParams(decryptedQuery);
      setDecryptedQuery(parsedQuery); // Update state with the parsed query
      // Step 4: Parse and log the query data
      console.log(decryptedQuery)
      const queryParams = new URLSearchParams(decryptedQuery);
      queryParams.forEach((value, key) => {
        console.log(`${key}: ${value}`);
        // console.log(queryParams[0].transaction_id)
      });
    } catch (error) {
      console.error("Failed to decrypt query:", error);
    }
  }, []);







  const handlePaymentSuccess = async () => {
    if (bookingInProgress.current) {
      console.warn("Booking already in progress. Skipping duplicate call.");
      return;
    }
    bookingInProgress.current = true;
  
    const txnId = new URLSearchParams(window.location.search).get("txnId");
    const payment_method = new URLSearchParams(window.location.search).get("payment_method");
    console.log(payment_method)
  
    if (!txnId) {
      alert("Invalid transaction. Please try again.");
      bookingInProgress.current = false;
      return;
    }


    const encryptedQuery = new URLSearchParams(window.location.search).get("query");
    const privateKey = "Wq0F6lS7A5tIJU90"; // Replace with your actual private key
    const privateValue = "lo4syhqHnRjm4L0T"; // Replace with your actual private value
    let decryptedQuery;
    try {
      decryptedQuery = decryptData(encryptedQuery, privateValue, privateKey);
    } catch (error) {
      console.error("Failed to decrypt query:", error);
      bookingInProgress.current = false;
      return;
    }

    const queryParams = new URLSearchParams(decryptedQuery);

    // Extract required data
    const txn_id = queryParams.get("transId");
    const status = queryParams.get("status") || "Failed";
    const amount = parseFloat(queryParams.get("amount"));
    const bookingId = queryParams.get("mtxnId");

  console.log(queryParams)
  
    // Retrieve sessionStorage data
    const cabId = sessionStorage.getItem("cabId");
    const driverId = sessionStorage.getItem("driverId");
    const userId = sessionStorage.getItem("userId");
    const rideDate = sessionStorage.getItem("rideDate");
    const rideTime = sessionStorage.getItem("rideTime");
    // const amount = sessionStorage.getItem("amount");
   
  
    console.log({
      cabId,
      driverId,
      userId,
      rideDate,
      rideTime,
      amount,
    }); // Log sessionStorage data for debugging
  
    if (!txn_id || !amount || !bookingId) {
      console.error("Incomplete booking details detected.");
      alert("Booking details are incomplete. Please try again.");
      bookingInProgress.current = false;
      return;
    }
    const payload = {
      txn_id,
      status,
      amount,
      bookingId,
    };
console.log(payload)

    try {
      // Proceed with booking logic...
    
      const response = await fetch(`https://cabapi.payplatter.in/api/bookings/${payload.bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create booking.");
      }
  
      console.log("Booking created successfully.");
  
      // Fetch latest booking details and proceed with transaction submission
      const fetchAllBookingsResponse = await fetch(
        `https://cabapi.payplatter.in/api/bookings/${payload.bookingId}`
      );
      
      const allBookings = await fetchAllBookingsResponse.json(); // Fetch the booking data
      console.log("Fetched booking data:", allBookings);
      
      // Directly assign the fetched booking data to latestBooking
      const latestBooking = allBookings; // Since `allBookings` is already a single object
      setLatestBooking(latestBooking); // Update the state with the booking details
      
      console.log("Latest booking set:", latestBooking);
      
  
      if (!latestBooking) {
        throw new Error("No bookings found.");
      }
  
      // const transactionData = {
      //   user_id: userId,
      //   transaction_id: txnId,
      //   booking_id: latestBooking.booking_id,
      //   amount: parseFloat(amount),
      //   transaction_date: new Date().toISOString().split("T")[0],
      //   payment_method: "Credit Card",
      //   status: "Success",
      // };
  
      // await submitTransactionDetails(decryptedQuery, latestBooking, userId);

  
      sendNotifications(latestBooking);
  
     
    } catch (error) {
      console.error("Error during booking confirmation:", error);
      alert("An error occurred while confirming your booking.");
    } finally {
      bookingInProgress.current = false;
    }
  };
  

  const submitTransactionDetails = async (decryptedQuery, latestBooking, userId) => {
    try {

      // Parse the decrypted query string into an object
      const queryParams = new URLSearchParams(decryptedQuery);
      const transId = queryParams.get("transId");
      const amount = parseFloat(queryParams.get("amount"));
      const txnDateTime = queryParams.get("txnDate");
      const txnDate = txnDateTime ? txnDateTime.split(" ")[0] : null;
      const formattedTxnDate = txnDate
        ? txnDate.split("-").reverse().join("-") // Convert "21-01-2025" to "2025-01-21"
        : null;
  
      const payInstrument = queryParams.get("payInstrument");
      const status = queryParams.get("status");
      const pgTransId = queryParams.get("pgTransId");
      const mtxnId = queryParams.get("mtxnId");
      const receiptNumber = queryParams.get("receiptNumber");
  
      // Construct the transaction data object
      const transactionData = {
        user_id: userId,
        transaction_id: transId,
        booking_id: latestBooking.booking_id,
        amount: amount,
        transaction_date: formattedTxnDate,
        payment_method: payInstrument,
        status: status,
        pgTransId: pgTransId,
        mtxnId: mtxnId,
        receiptNumber: receiptNumber,
      };
  
      // Send the transaction data to the API
      const response = await fetch("https://cabapi.payplatter.in/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit transaction details.");
      }
  
      console.log("Transaction details submitted successfully:", transactionData);
    } catch (error) {
      console.error("Error submitting transaction details:", error);
    }
  };
  

  const sendNotifications = async (booking) => {
    const sendSMS = async (mobile, message) => {
      try {
        const apiUrl = `https://payplatter.in/otpSend.php?mobileNos=${encodeURIComponent(
          mobile
        )}&message=${encodeURIComponent(message)}`;
        const response = await fetch(apiUrl, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Failed to send SMS to ${mobile}`);
        }

        console.log(`SMS sent to ${mobile}:`, await response.text());
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    };

    try {
      console.log("Sending SMS to user and driver...");

      // Extract details from the booking
      const {
        user_mobile_no: userMobile,
        user_name: userName,
        driver_mobile_no: driverMobile,
        driver_name: driverName,
        booking_date: rideDate,
        booking_time: rideTime,
        booking_id: bookingId,
      } = booking;

      if (!userMobile || !userName || !driverMobile || !driverName) {
        throw new Error("Incomplete data for sending SMS.");
      }

      // SMS to the User
      const userSmsMessage = `Dear ${userName}, Your cab booking is confirmed! Booking ID/Date/Time: ${bookingId} / ${rideDate} ${rideTime} Driver Name/Contact: ${driverName} - ${driverMobile} Jhansi Smart City - Larsen and Toubro Limited`;

      await sendSMS(userMobile, userSmsMessage);

      // SMS to the Driver
      const driverSmsMessage = `Dear Driver, You have a new ride request! Booking ID: ${bookingId} Pickup Date/Time: ${rideDate} ${rideTime} Customer Name/Contact: ${userName} - ${userMobile} Jhansi Smart City - Larsen and Toubro Limited`;

      await sendSMS(driverMobile, driverSmsMessage);

      console.log("SMS notifications sent successfully.");
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  };

  useEffect(() => {
    const txnId = new URLSearchParams(window.location.search).get("txnId");

    // Check if the user has already visited this page
    if (sessionStorage.getItem(`visited_${txnId}`)) {
      console.log("Already visited PaymentSuccess page. Skipping logic.");
      return;
    }
  
    // Mark as visited
    sessionStorage.setItem(`visited_${txnId}`, true);
  
  
    handlePaymentSuccess();
  }, []);


  // useEffect(() => {
  //   const alreadyVisited = sessionStorage.getItem("paymentProcessed");
  
  //   if (alreadyVisited) {
  //     navigate("/passengers", { replace: true }); // Redirect to Booking Details
  //   } else {
  //     sessionStorage.setItem("paymentProcessed", true); // Mark as visited
  //   }
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
      <p className="text-gray-700 text-lg mb-6">
        Your booking has been confirmed, and SMS notifications have been sent to you and the driver.
      </p>
  
      {/* Receipt Details */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4 text-left">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Receipt Details</h2>
        <p className="mb-2"><strong>Transaction ID:</strong> {decryptedQuery?.get("transId") || "N/A"}</p>
        <p className="mb-2"><strong>Booking ID:</strong> {latestBooking?.booking_id || "N/A"}</p>
        <p className="mb-2"><strong>Amount Paid:</strong> ₹{decryptedQuery?.get("amount") || "N/A"}</p>
        <p className="mb-2"><strong>Payment Method:</strong> {decryptedQuery?.get("payInstrument") || "N/A"}</p>
        <p className="mb-2"><strong>Payment Status:</strong> {decryptedQuery?.get("status") || "N/A"}</p>
        <p className="mb-2"><strong>Transaction Date:</strong> {decryptedQuery?.get("txnDate") || "N/A"}</p>
        <p className="mb-2"><strong>Receipt Number:</strong> {decryptedQuery?.get("receiptNumber") || "N/A"}</p>
        <p className="mb-2"><strong>Booking Date:</strong> {latestBooking?.booking_date || "N/A"}</p>
      </div>
  
      {/* User and Ride Details */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4 text-left">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Ride Details</h2>
        <p className="mb-2"><strong>User Name:</strong> {latestBooking?.user_name || "N/A"}</p>
        <p className="mb-2"><strong>Driver Name:</strong> {latestBooking?.driver_name || "N/A"}</p>
        <p className="mb-2"><strong>Driver Mobile:</strong> {latestBooking?.driver_mobile_no || "N/A"}</p>
        <p className="mb-2"><strong>Cab Name:</strong> {latestBooking?.cab_name || "N/A"}</p>
        {/* <p className="mb-2"><strong>Ride Date:</strong> {latestBooking?.ride_date || "N/A"}</p> */}
      </div>
  
      <button
        // onClick={() => navigate("/passangers", { replace: true })}
        className="py-2 px-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md transition duration-200 mt-6"
      >
        Booking Details
      </button>
      <div className="flex items-center justify-center mt-3">
        <p className="font-semibold">
          {/* Please go to Booking details. You will be able to see your booked rides using your mobile number. You can
          start your ride there. */}
          {`To see your booking you may visit to https://smartcityjhansi.com/  Services->Booking->Tourist Cab Booking-> My Bookings. You will be able to see your booked rides using your mobile number. You can start your ride from here.
`}
        </p>
      </div>
    </div>
  </div>
  
  
  );
};

export default PaymentSuccess;
