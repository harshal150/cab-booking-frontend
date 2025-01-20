


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import logo from "../../assets/Logo.png";
import PassengersDetails from "../PassangersDetails";
const FinalPaymentSuccess = () => {
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const amount = sessionStorage.getItem("fare");
  console.log(amount)
  const txnId = sessionStorage.getItem("txnId");
  const storedBookingDetails = localStorage.getItem("bookingDetails");
console.log(storedBookingDetails.cabId)
const cab_id = storedBookingDetails.cabId
const driver_id = storedBookingDetails.driver_id



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

    const storedBookingDetails = localStorage.getItem("bookingDetails");

    if (storedBookingDetails) {
      const parsedDetails = JSON.parse(storedBookingDetails);
      setBookingDetails(parsedDetails);
console.log(parsedDetails)
console.log(parsedDetails.cabId)

      const bookingId = parsedDetails.booking_id;
      const bookingDateTime = new Date(parsedDetails.booking_date);
      const bookingDate = bookingDateTime.toISOString().split("T")[0]; // Extracts date in YYYY-MM-DD format
      const bookingTime = bookingDateTime.toTimeString().split(" ")[0]; // Extracts time in HH:mm:ss format
  
      // const updateStatus = async () => {

      //   const requestBody = {
      //     booking_date: bookingDate,
      //     booking_time: bookingTime,
      //     cab_id: cab_id, // Default to 2 if cab_id is missing
      //     driver_id: driver_id, // Default to 1 if driver_id is missing
      //     user_id: parsedDetails.user_id,
      //     status: "booked",
      //   };
  
      //   console.log("Request Body:", requestBody); // Log the request body
  
      //   try {
      //     const response = await fetch(
      //       `https://cabapi.payplatter.in/api/bookings/${bookingId}`,
      //       {
      //         method: "PUT",
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //         body: JSON.stringify(requestBody),
      //       }
      //     );

      //     if (!response.ok) {
      //       throw new Error("Failed to update booking status");
      //     }

      //     const result = await response.json();
      //     console.log("Booking status updated successfully:", result);
      //   } catch (error) {
      //     console.error("Error updating booking status:", error);
      //   }
      // };

      // updateStatus();
    }
  }, []);
  // useEffect(() => {
  //   const amount = sessionStorage.getItem("fare");
  //   const user_id = sessionStorage.getItem("user_id");
  //   const txnId = sessionStorage.getItem("txnId");

  //   // Static values
  //   const paymentMethod = "Cash";
  //   const paymentStatus = "Success";

  //   // Set transaction details in state
  //   if (user_id && amount && txnId) {
  //     setTransactionDetails({
  //       TransactionID: txnId,
  //       Amount: amount,
  //       PaymentMethod: paymentMethod,
  //       PaymentStatus: paymentStatus,
  //     });
  //   }

  //   const storedBookingDetails = localStorage.getItem("bookingDetails");
  
  //   if (storedBookingDetails) {
  //     const parsedDetails = JSON.parse(storedBookingDetails);
  //     console.log("Parsed storedBookingDetails:", parsedDetails); // Logs the object
      
  //     setBookingDetails(parsedDetails);  }
  // }, []);


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





  const goToHome = () => {
    navigate("/");
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

      <div className="flex items-center justify-center  ">
  {bookingDetails ? (
    <div className="w-full max-w-4xl  p-6 rounded-xl shadow-lg border bg-gray-100 border-gray-200">
      <table className="table-auto w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="b rounded-t-xl">
            <th
              colSpan="2"
              className="py-4 px-6 text-2xl font-bold text-center rounded-t-xl"
            >
              Booking Details
            </th>
          </tr>
          {/* <tr className="bg-gray-50">
            <th className="py-3 px-6 text-sm font-semibold text-gray-700 border-b">
              Field
            </th>
            <th className="py-3 px-6 text-sm font-semibold text-gray-700 border-b">
              Value
            </th>
          </tr> */}
        </thead>
        {/* Table Body */}
        <tbody className="divide-y divide-gray-200">

        <tr className="hover:bg-gray-50 transition">
            <td className="py-4 px-6 text-gray-600">Transaction ID</td>
            <td className="py-4 px-6 text-gray-900 font-medium">
              {txnId}
            </td>
          </tr>
          <tr className="hover:bg-gray-50 transition">
            <td className="py-4 px-6 text-gray-600">Booking ID</td>
            <td className="py-4 px-6 text-gray-900 font-medium">
              {bookingDetails.booking_id}
            </td>
          </tr>
          <tr className="hover:bg-gray-50 transition">
            <td className="py-4 px-6 text-gray-600">Booking Date</td>
            <td className="py-4 px-6 text-gray-900 font-medium">
              {new Date(bookingDetails.booking_date).toLocaleDateString()}
            </td>
          </tr>

          <tr className="hover:bg-gray-50 transition">
            <td className="py-4 px-6 text-gray-600">Paid Amount</td>
            <td className="py-4 px-6 text-gray-900 font-medium">
              {amount}
            </td>
          </tr>
          
          <tr className="hover:bg-gray-50 transition">
            <td className="py-4 px-6 text-gray-600">Cab Name</td>
            <td className="py-4 px-6 text-gray-900 font-medium">
              {bookingDetails.cab_name}
            </td>
          </tr>
         
          <tr className="hover:bg-gray-50 transition">
            <td className="py-4 px-6 text-gray-600">User Name</td>
            <td className="py-4 px-6 text-gray-900 font-medium">
              {bookingDetails.user_name}
            </td>
          </tr>
          <tr className="hover:bg-gray-50 transition">
            <td className="py-4 px-6 text-gray-600">Mobile Number</td>
            <td className="py-4 px-6 text-gray-900 font-medium">
              {bookingDetails.user_mobile_no}
            </td>
          </tr>
          {/* <tr className="hover:bg-gray-50 transition">
            <td className="py-4 px-6 text-gray-600">User Mobile No</td>
            <td className="py-4 px-6 text-gray-900 font-medium">
              {bookingDetails.user_mobile_no}
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-center text-gray-500">Loading booking details...</p>
  )}
</div>



<div className="flex justify-center items-center">
      <button
        onClick={goToHome}
        className="py-2 px-6 bg-green-500 mt-8 hover:bg-green-600 text-white text-lg font-medium rounded-lg shadow-lg mb-8 transition duration-200"
      >
        Go to home
      </button>
    </div>



      {/* Back to Home Button */}
     
    </div>
  );
};

export default FinalPaymentSuccess;
