// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const FinalPaymentFailure = () => {
//     const navigate = useNavigate();

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white shadow-lg rounded-lg p-8 text-center">
//                 <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Not Completed</h1>
//                 <p className="text-gray-600 mb-6">
//                     Sorry, your payment could not be processed. Please try again later or contact support if the issue persists.
//                 </p>
//                 <button
//                     onClick={() => navigate('/')}
//                     className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
//                 >
//                     Go to Home
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default FinalPaymentFailure;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const FinalPaymentFailure = () => {
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);



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
    const fetchTransactionDetails = async () => {
      const encryptedQuery = new URLSearchParams(window.location.search).get("query");
      // const privateKey = "Wq0F6lS7A5tIJU90"; // Replace with your actual private key
      // const privateValue = "lo4syhqHnRjm4L0T"; // Replace with your actual private value

      // const privateKey = "7R7WkmrgZilbokoB";
      // const privateValue = "x8mYTSawyBGpM9iq";

      
    const privateKey ="3md6uPicmLlZmlVG";
    const privateValue ="xVJSbcqImp2utNzi";

      try {
        // Decrypt the query
        const decryptedQuery = decryptData(encryptedQuery, privateValue, privateKey);
        console.log("Decrypted Query:", decryptedQuery);

        const queryParams = new URLSearchParams(decryptedQuery);

        // Extract transaction details from the query
        const transId = queryParams.get("transId");
        const amount = queryParams.get("amount");
        const payInstrument = queryParams.get("payInstrument");
        const txnDate = queryParams.get("txnDate");
        const receiptNumber = queryParams.get("receiptNumber");
        const status = queryParams.get("status"); // Dynamically fetch status from query

        console.log({
          transId,
          amount,
          payInstrument,
          txnDate,
          receiptNumber,
          status,
        });

        setTransactionDetails({
          TransactionID: transId,
          Amount: amount,
          PaymentMethod: payInstrument,
          PaymentStatus: status,
        });

        // Update transaction using API call
        const transactionId = localStorage.getItem("transactiongetid");
        console.log(transactionId);
        if (transactionId) {
          const updatePayload = {
            transaction_id: transId,
            status: status,
            amount: parseFloat(amount),
            payment_method: payInstrument,
            receipt_number: receiptNumber,
          };
          console.log(updatePayload);

          const response = await fetch(`https://cabapi.payplatter.in/api/transactions/aftertransaction/${transactionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          });

          if (response.ok) {
            console.log("Transaction updated successfully:", updatePayload);
          } else {
            console.error("Failed to update transaction.");
          }
        } else {
          console.error("No transaction ID found in localStorage.");
        }
      } catch (error) {
        console.error("Failed to decrypt query or update transaction:", error);
      }
    };

    fetchTransactionDetails();

    // Load booking details from localStorage
    const storedBookingDetails = localStorage.getItem("bookingDetails");
    if (storedBookingDetails) {
      setBookingDetails(JSON.parse(storedBookingDetails));
    }


    const timer = setTimeout(() => {
        navigate("/", { replace: true }); // Redirect and replace history
      }, 3000);
  
      return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [navigate]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Payment Not Completed</h1>
      <p className="text-gray-700 text-lg mb-6">
        Sorry, your payment could not be processed. Please try again later or contact support if the issue persists.
      </p>

      <div className="flex items-center justify-center">
        {transactionDetails && bookingDetails ? (
          <div className="w-full max-w-4xl p-6 rounded-xl shadow-lg border bg-gray-100 border-gray-200">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    className="py-4 px-6 text-2xl font-bold text-center rounded-t-xl"
                  >
                    Transaction Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-600">Transaction ID</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {transactionDetails.TransactionID || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Paid Amount</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    ₹{transactionDetails.Amount || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Payment Method</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {transactionDetails.PaymentMethod || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Payment Status</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {transactionDetails.PaymentStatus || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Cab Name</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {bookingDetails.cab_name || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">User Name</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {bookingDetails.user_name || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Mobile Number</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {bookingDetails.user_mobile_no || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading transaction details...</p>
        )}
      </div>

      <button
        onClick={() => navigate("/", { replace: true })}
        className="py-2 px-6 bg-blue-500 mt-8 hover:bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg mb-8 transition duration-200"
      >
        Go to Home
      </button>
    </div>
  );
};

export default FinalPaymentFailure;
