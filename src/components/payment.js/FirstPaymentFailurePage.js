import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FirstPaymentFailurePage = () => {
  const bookingInProgress = useRef(false); // Guard to prevent duplicate API calls
  const navigate = useNavigate();

  const handlePaymentFailure = async () => {
    if (bookingInProgress.current) {
      console.warn("Booking already in progress. Skipping duplicate call.");
      return; // Prevent duplicate execution
    }
    bookingInProgress.current = true;

    try {
      // Retrieve sessionStorage data
      const cabId = sessionStorage.getItem("cabId");
      const driverId = sessionStorage.getItem("driverId");
      const userId = sessionStorage.getItem("userId");
      const rideDate = sessionStorage.getItem("rideDate");
      const rideTime = sessionStorage.getItem("rideTime");
   
      const txnId = new URLSearchParams(window.location.search).get("txnId");

      if (!cabId || !driverId || !userId || !txnId) {
        console.error("Incomplete booking details.");
        bookingInProgress.current = false; // Allow retries
        return;
      }

      // Construct booking payload
      const payload = {
        booking_date: rideDate,
        booking_time: rideTime,
        cab_id: cabId,
        driver_id: driverId,
        user_id: userId,
       
        txn_id: txnId, // Unique transaction ID
        status: "Pending", // Status for failed payment
      };

      // Make API call to create a pending booking
      const response = await fetch("https://cabapi.payplatter.in/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking with pending status.");
      }

      console.log("Pending booking created successfully.");
    } catch (error) {
      console.error("Error during payment failure handling:", error);
    } finally {
      bookingInProgress.current = false; // Reset guard for potential retries
    }
  };

  useEffect(() => {
    handlePaymentFailure();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment was not successful. A pending booking has been created. You can retry the payment or contact support if the issue persists.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default FirstPaymentFailurePage;
