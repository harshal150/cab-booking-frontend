import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FinalPaymentSuccess = () => {
  const navigate = useNavigate();
  const [lastBookingId, setLastBookingId] = useState(null);

  useEffect(() => {
    const fetchAndSetLastBookingId = async () => {
      try {
        // Fetch all bookings from the API
        const response = await axios.get("https://cabapi.payplatter.in/api/bookings");
        const data = response.data;

        if (data.length > 0) {
          // Sort bookings by creation date (assuming `booking_date` is a valid timestamp)
          const sortedBookings = data.sort(
            (a, b) => new Date(b.booking_date) - new Date(a.booking_date)
          );

          // Get the last created booking
          const lastBooking = sortedBookings[0];

          // Set the last booking ID in state
          setLastBookingId(lastBooking.booking_id);
          console.log("Last Booking ID:", lastBooking.booking_id);
        } else {
          console.log("No bookings found.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const saveTransaction = async () => {
      const user_id = sessionStorage.getItem("user_id");
      const amount = sessionStorage.getItem("fare");
      const payment_method = "credit_card";
      const status = "success";

      if (!user_id || !lastBookingId || !amount) {
        console.error("Missing required transaction details.");
        return;
      }

      const payload = {
        user_id: parseInt(user_id),
        booking_id: lastBookingId, // Use the dynamically fetched last booking ID
        amount: parseFloat(amount),
        payment_method,
        status,
      };

      try {
        const response = await fetch("https://cabapi.payplatter.in/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to save transaction record.");
        }

        console.log("Transaction saved successfully.");
        navigate("/");
      } catch (error) {
        console.error("Error saving transaction:", error);
        // alert("An error occurred while saving the transaction. Please try again.");
      }
    };

    fetchAndSetLastBookingId(); // Fetch the last booking ID
    if (lastBookingId) {
      saveTransaction(); // Save the transaction once the booking ID is available
    }
  }, [navigate, lastBookingId]); // Re-run the effect when lastBookingId changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
        <p className="text-gray-700 text-lg mb-6">
          Your booking and payment details have been saved successfully!
        </p>
        <button
          onClick={() => navigate("/")}
          className="py-2 px-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default FinalPaymentSuccess;
