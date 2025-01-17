// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const FinalPaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [lastBookingId, setLastBookingId] = useState(null);

//   useEffect(() => {
//     const fetchAndSetLastBookingId = async () => {
//       try {
//         // Fetch all bookings from the API
//         const response = await axios.get("https://cabapi.payplatter.in/api/bookings");
//         const data = response.data;

//         if (data.length > 0) {
//           // Sort bookings by creation date (assuming `booking_date` is a valid timestamp)
//           const sortedBookings = data.sort(
//             (a, b) => new Date(b.booking_date) - new Date(a.booking_date)
//           );

//           // Get the last created booking
//           const lastBooking = sortedBookings[0];

//           // Set the last booking ID in state
//           setLastBookingId(lastBooking.booking_id);
//           console.log("Last Booking ID:", lastBooking.booking_id);
//         } else {
//           console.log("No bookings found.");
//         }
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       }
//     };

//     const saveTransaction = async () => {
//       const user_id = sessionStorage.getItem("user_id");
//       const amount = sessionStorage.getItem("fare");
//       const payment_method = "credit_card";
//       const status = "success";
//        const txnId = sessionStorage.getItem("txnId")
//        console.log(txnId)
//       if (!user_id || !lastBookingId || !amount) {
//         console.error("Missing required transaction details.");
//         return;
//       }

//       const payload = {
//         user_id: parseInt(user_id),
//         booking_id: lastBookingId, // Use the dynamically fetched last booking ID
//         amount: parseFloat(amount),
//         payment_method,
//         status,
//       };

//       try {
//         const response = await fetch("https://cabapi.payplatter.in/api/transactions", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to save transaction record.");
//         }

//         console.log("Transaction saved successfully.");
//         navigate("/");
//       } catch (error) {
//         console.error("Error saving transaction:", error);
//         // alert("An error occurred while saving the transaction. Please try again.");
//       }
//     };

//     fetchAndSetLastBookingId(); // Fetch the last booking ID
//     if (lastBookingId) {
//       saveTransaction(); // Save the transaction once the booking ID is available
//     }
//   }, [navigate, lastBookingId]); // Re-run the effect when lastBookingId changes

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
//         <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
//         <p className="text-gray-700 text-lg mb-6">
//           Your booking and payment details have been saved successfully!
//         </p>
//         <button
//           onClick={() => navigate("/")}
//           className="py-2 px-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md transition duration-200"
//         >
//           Back to Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FinalPaymentSuccess;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import logo from '../../assets/Logo.png'
const FinalPaymentSuccess = () => {
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
      const amount = sessionStorage.getItem("fare");
      const user_id = sessionStorage.getItem("user_id");
      const booking_id = sessionStorage.getItem("bookingId");
    const txnId = sessionStorage.getItem("txnId");
console.log("userid",user_id)
console.log("bookingid",booking_id)
    const paymentMethod = "cash"; // Static value
    const paymentStatus = "success"; // Static value

    // Set details in state
    if (user_id && amount && txnId) {
      setTransactionDetails({
        TransactionID: txnId,
        Amount: amount,
        PaymentMethod: paymentMethod,
        PaymentStatus: paymentStatus,
      });
    }
  }, []);

  const downloadReceipt = () => {
    if (!transactionDetails) return;

    const receiptData = `
      Transaction Receipt\n
      Transaction ID: ${transactionDetails.TransactionID}\n
      Amount: ${transactionDetails.Amount}\n
      Payment Method: ${transactionDetails.PaymentMethod}\n
      Payment Status: ${transactionDetails.PaymentStatus}\n
    `;

    const blob = new Blob([receiptData], { type: "text/plain;charset=utf-8;" });
    saveAs(blob, "receipt.txt");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:mt-16">
      {/* Company Logo */}
      <img
        src={logo}
        alt="Company Logo"
        className="h-20 w-auto mb-4"
      />

      {/* Heading Text */}
      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        Smart City Jhansi - Cab Booking
      </h2>

      {/* Download Receipt Button */}
      <button
        onClick={downloadReceipt}
        className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md mb-8 transition duration-200"
      >
        Download Receipt
      </button>

      {/* Card for Transaction Details */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Transaction Details
        </h1>
        {transactionDetails ? (
          <div className="text-left space-y-2">
            <p>
              <strong>Transaction ID:</strong> {transactionDetails.TransactionID}
            </p>
            <p>
              <strong>Amount:</strong> ₹{transactionDetails.Amount}
            </p>
            <p>
              <strong>Payment Method:</strong> {transactionDetails.PaymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong> {transactionDetails.PaymentStatus}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Loading transaction details...</p>
        )}
      </div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 py-2 px-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md transition duration-200"
      >
        Back to Home
      </button>
    </div>
  );
};

export default FinalPaymentSuccess;
