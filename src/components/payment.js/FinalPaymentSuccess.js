


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import logo from "../../assets/Logo.png";

const FinalPaymentSuccess = () => {
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const amount = sessionStorage.getItem("fare");
    const user_id = sessionStorage.getItem("user_id");
    const txnId = sessionStorage.getItem("txnId");

    // Static values
    const paymentMethod = "Cash";
    const paymentStatus = "Success";

    // Set transaction details in state
    if (user_id && amount && txnId) {
      setTransactionDetails({
        TransactionID: txnId,
        Amount: amount,
        PaymentMethod: paymentMethod,
        PaymentStatus: paymentStatus,
      });
    }

    // Retrieve and set booking details from localStorage
    const storedBookingDetails = localStorage.getItem("bookingDetails");
    if (storedBookingDetails) {
      setBookingDetails(JSON.parse(storedBookingDetails));
    }

    console.log(storedBookingDetails.user_id)
  }, []);


  const downloadReceipt = () => {
    if (!transactionDetails || !bookingDetails) return;

    const receiptData = `
      Transaction Receipt\n
      Transaction ID: ${transactionDetails.TransactionID}\n
      Paid Amount: ₹${transactionDetails.Amount}\n
      Payment Method: ${transactionDetails.PaymentMethod}\n
      Payment Status: ${transactionDetails.PaymentStatus}\n
      Cab Name: ${bookingDetails.cab_name}\n
      Booking Date: ${bookingDetails.booking_date}\n
      User Name: ${bookingDetails.user_name}\n
      User Mobile No: ${bookingDetails.user_mobile_no}\n
    `;

    const blob = new Blob([receiptData], { type: "text/plain;charset=utf-8;" });
    saveAs(blob, "receipt.txt");
  };



  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      {/* Logo */}
      <img src={logo} alt="Company Logo" className="h-20 w-auto mb-6" />

      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-700 mb-8">
        Smart City Jhansi - Cab Booking
      </h2>

      {/* Download Receipt Button */}
      <button
        onClick={downloadReceipt}
        className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg shadow-lg mb-8 transition duration-200"
      >
        Download Receipt
      </button>

{/* Receipt Card */}
<div className="bg-gradient-to-r from-white via-gray-100 to-white p-6 rounded-xl shadow-lg w-full max-w-xl border border-gray-200">
  <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
    Transaction Receipt
  </h1>
  {transactionDetails && bookingDetails ? (
    <div className="text-gray-700 space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <span className="font-medium">Transaction ID:</span>
        <span>{transactionDetails.TransactionID}</span>
      </div>
      <div className="flex justify-between items-center border-b pb-3">
        <span className="font-medium">Paid Amount:</span>
        <span className="text-green-600 font-semibold">₹{transactionDetails.Amount}</span>
      </div>
      <div className="flex justify-between items-center border-b pb-3">
        <span className="font-medium">Payment Method:</span>
        <span>{transactionDetails.PaymentMethod}</span>
      </div>
      <div className="flex justify-between items-center border-b pb-3">
        <span className="font-medium">Payment Status:</span>
        <span className="text-green-600 font-semibold">{transactionDetails.PaymentStatus}</span>
      </div>
      <div className="flex justify-between items-center border-b pb-3">
        <span className="font-medium">Cab Name:</span>
        <span>{bookingDetails.cab_name}</span>
      </div>
      <div className="flex justify-between items-center border-b pb-3">
        <span className="font-medium">Booking Date:</span>
        <span>{bookingDetails.booking_date}</span>
      </div>
      <div className="flex justify-between items-center border-b pb-3">
        <span className="font-medium">User Name:</span>
        <span>{bookingDetails.user_name}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-medium">User Mobile No:</span>
        <span>{bookingDetails.user_mobile_no}</span>
      </div>


      <div className="flex items-center justify-center ">
  <button
    onClick={() => navigate("/")}
    className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-lg shadow-lg transition duration-200"
  >
    Back to Home
  </button>
</div>

    </div>
  ) : (
    <p className="text-gray-500 text-center">
      Loading transaction and booking details...
    </p>
  )}
</div>


      {/* Back to Home Button */}
     
    </div>
  );
};

export default FinalPaymentSuccess;
