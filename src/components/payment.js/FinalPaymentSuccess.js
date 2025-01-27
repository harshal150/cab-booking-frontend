import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";
import logo from "../../assets/Logo.png";
import CONFIG from "../../config";

const FinalPaymentSuccess = () => {
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const amount = sessionStorage.getItem("fare");
  const txnId = sessionStorage.getItem("txnId");
  const DOMAIN = CONFIG.REACT_APP_API_DOMAIN;

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

      let decryptedQuery = null;
      try {
        decryptedQuery = decryptData(encryptedQuery, privateValue, privateKey);
        console.log("Decrypted Query:", decryptedQuery);
        const queryParams = new URLSearchParams(decryptedQuery);





        // Extract transaction details from the query
        const transId = queryParams.get("transId");
        const amount = queryParams.get("amount");
        const payInstrument = queryParams.get("payInstrument");
        const txnDate = queryParams.get("txnDate");
        const receiptNumber = queryParams.get("receiptNumber");
        const status = queryParams.get("status");

        console.log({
          transId,
          amount,
          payInstrument,
          txnDate,
          receiptNumber,
          status,
        });


              
        setTransactionDetails((prev) => ({
          ...prev,
          TransactionID: transId,
          Amount: amount,
        }));
        // Update transaction using API call
        const transactionId = localStorage.getItem("transactiongetid"); // Retrieve stored transaction ID
        if (!transactionId) {
          alert("Transaction ID not found. Please try again.");
          return;
        }
        console.log(transactionId)
        if (transactionId) {
          const updatePayload = {
            transaction_id: transId,
            status: status,
            amount: parseFloat(amount),
            payment_method: payInstrument,
            receipt_number: receiptNumber,
          };
          console.log(updatePayload)

          const response = await fetch(`${DOMAIN}/api/transactions/aftertransaction/${transactionId}`, {
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

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <img src={logo} alt="Company Logo" className="h-20 w-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-700 mb-8">
        Smart City Jhansi - Cab Booking
      </h2>
      <button
        onClick={downloadReceipt}
        className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg shadow-lg mb-8 transition duration-200"
      >
        Download Receipt
      </button>

      <div className="flex items-center justify-center">
        {bookingDetails ? (
          <div className="w-full max-w-4xl p-6 rounded-xl shadow-lg border bg-gray-100 border-gray-200">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    className="py-4 px-6 text-2xl font-bold text-center rounded-t-xl"
                  >
                    Booking Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              <tr>
  <td className="py-4 px-6 text-gray-600">Transaction ID</td>
  <td className="py-4 px-6 text-gray-900 font-medium">
    {transactionDetails?.TransactionID || "N/A"}
  </td>
</tr>



                <tr>
                  <td className="py-4 px-6 text-gray-600">Booking ID</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {bookingDetails.booking_id}
                  </td>
                </tr>
                <tr>
  <td className="py-4 px-6 text-gray-600">Paid Amount</td>
  <td className="py-4 px-6 text-gray-900 font-medium">
    ₹{transactionDetails?.Amount || "N/A"}
  </td>
</tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Cab Name</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {bookingDetails.cab_name}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">User Name</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {bookingDetails.user_name}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Mobile Number</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {bookingDetails.user_mobile_no}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading booking details...</p>
        )}
      </div>

      <button
        onClick={goToHome}
        className="py-2 px-6 bg-green-500 mt-8 hover:bg-green-600 text-white text-lg font-medium rounded-lg shadow-lg mb-8 transition duration-200"
      >
        Go to home
      </button>
    </div>
  );
};

export default FinalPaymentSuccess;
