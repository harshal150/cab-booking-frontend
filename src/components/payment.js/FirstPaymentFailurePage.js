



// import React, { useEffect, useState ,useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import CryptoJS from "crypto-js";
// import { useLocation } from "react-router-dom";
// const FirstPaymentFailurePage = () => {
//   const location = useLocation();

//   // Extract the status query parameter from the URL
//   const queryParams = new URLSearchParams(location.search);
//   const encryptedQuery = queryParams.get("query");
//   const bookingInProgress = useRef(false); // Guard to prevent duplicate API calls
//   const [decryptedData, setDecryptedData] = useState(null);
//   const navigate = useNavigate();
// const [transId , setTransId] = useState(null);
// const [amount , setAmount] = useState(null);
// const [mtxnId , setmtxnId] = useState(null);
// const [status , setStatus] = useState("");
// const decryptData = (encryptedData, iv, key) => {
//   const keyBytes = CryptoJS.enc.Utf8.parse(key.padEnd(16, "0").slice(0, 16));
//   const ivBytes = CryptoJS.enc.Utf8.parse(iv);
//   const decrypted = CryptoJS.AES.decrypt(encryptedData, keyBytes, {
//     iv: ivBytes,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// };

// const privateKey = "Wq0F6lS7A5tIJU90"; // Replace with your actual private key
// const privateValue = "lo4syhqHnRjm4L0T"; // Replace with your actual private value
// const privateKey = "7R7WkmrgZilbokoB";
// // const privateValue = "x8mYTSawyBGpM9iq";
// useEffect(() => {
//   if (encryptedQuery && privateKey && privateValue) {
//     // Decrypt the data using the EncryptDecrypt class
//     const decryptedText = decryptData(
//       encryptedQuery,
//       privateValue,
//       privateKey
//     );

//     // Parse the decrypted data
//     const decryptedValues = decryptedText
//       .split("&")
//       .reduce((acc, item) => {
//         const [key, value] = item.split("=");
//         acc[key] = value;
//         return acc;
//       }, {});

//     setDecryptedData(decryptedValues);
//   }
// }, [encryptedQuery, privateKey, privateValue]);


// console.log(decryptedData);



//   const submitTransactionDetails = async (decryptedQuery, bookingId, userId) => {
//     try {
//       const queryParams = new URLSearchParams(decryptedQuery);
//       const transId = queryParams.get("transId");
//       setTransId(transId)
//       const amount = parseFloat(queryParams.get("amount"));
//       setAmount(amount)
//       const txnDateTime = queryParams.get("txnDate");
//       const txnDate = txnDateTime ? txnDateTime.split(" ")[0] : null;
//       const formattedTxnDate = txnDate
//         ? txnDate.split("-").reverse().join("-") // Convert "21-01-2025" to "2025-01-21"
//         : null;
//       const payInstrument = queryParams.get("payInstrument");
//       const pgTransId = queryParams.get("pgTransId");
//       const mtxnId = queryParams.get("mtxnId");
//       setmtxnId(mtxnId);
//       const receiptNumber = queryParams.get("receiptNumber");
//       const status = queryParams.get("status") || "Failed"; // Take status from decrypted query or default to "Failed"
//       setStatus(status);

//       const transactionData = {
//         user_id: userId,
//         transaction_id: transId,
//         booking_id: bookingId,
//         amount: amount,
//         transaction_date: formattedTxnDate,
//         payment_method: payInstrument,
//         status: status,
//         pgTransId: pgTransId,
//         mtxnId: mtxnId,
//         receiptNumber: receiptNumber,
//       };

//       console.log(transactionData)

//       const response = await fetch("https://cabapi.payplatter.in/api/transactions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(transactionData),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to submit transaction details.");
//       }

//       console.log("Transaction details submitted successfully:", transactionData);
//     } catch (error) {
//       console.error("Error submitting transaction details:", error);
//     }
//   };

//   const handlePaymentFailure = async () => {
//     if (bookingInProgress.current) {
//       console.warn("Booking already in progress. Skipping duplicate call.");
//       return;
//     }
//     bookingInProgress.current = true;

//     const encryptedQuery = new URLSearchParams(window.location.search).get("query");
  

//     let decryptedQuery;
//     try {
//       decryptedQuery = decryptData(encryptedQuery, privateValue, privateKey);
//     } catch (error) {
//       console.error("Failed to decrypt query:", error);
//       bookingInProgress.current = false;
//       return;
//     }

//     const queryParams = new URLSearchParams(decryptedQuery);

//     // Extract required data
//     const txn_id = decryptedData?.transId;
//     const status = decryptedData?.status;;
//     const amount = decryptedData?.amount;
//     const bookingId = decryptedData?.mtxnId;;

//     if (!txn_id || !amount || !bookingId) {
//       console.error("Incomplete booking details detected.");
//       alert("Booking details are incomplete. Please try again.");
//       bookingInProgress.current = false;
//       return;
//     }

//     // Construct payload
//     const payload = {
//       txn_id,
//       status,
//       amount,
//       bookingId,
//     };
// console.log(payload)
//     try {
//       // Make PUT API call
//       const response = await fetch(`https://cabapi.payplatter.in/api/bookings/${payload.bookingId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update booking with failed status.");
//       }

//       console.log("Payment failure details submitted successfully:", payload);
//     } catch (error) {
//       console.error("Error during payment failure handling:", error);
//       alert("An error occurred while updating the booking status. Please contact support.");
//     } finally {
//       bookingInProgress.current = false;
//     }
//   };

  
  

//   useEffect(() => {
//     handlePaymentFailure();

//     // const redirectTimeout = setTimeout(() => {
//     //   navigate("/", { replace: true }); // Replace history entry to prevent going back
//     // }, 3000);

//     // // Cleanup timeout on component unmount
//     // return () => clearTimeout(redirectTimeout);
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8 text-center">
//         <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
//         <p className="text-gray-600 mb-6">
//           Unfortunately, your payment was not successful. You can retry the payment or contact support if the issue persists.
//         </p>
//         <button
//           // onClick={() => navigate("/")}
//           onClick={() => navigate("/")}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Go to Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FirstPaymentFailurePage;







import React, { useEffect, useState ,useRef } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const FirstPaymentFailurePage = () => {
  const bookingInProgress = useRef(false); // Guard to prevent duplicate API calls
  const navigate = useNavigate();
const [transId , setTransId] = useState(null);
const [amount , setAmount] = useState(null);
const [mtxnId , setmtxnId] = useState(null);
const [status , setStatus] = useState("");
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

  const submitTransactionDetails = async (decryptedQuery, bookingId, userId) => {
    try {
      const queryParams = new URLSearchParams(decryptedQuery);
      const transId = queryParams.get("transId");
      setTransId(transId)
      const amount = parseFloat(queryParams.get("amount"));
      setAmount(amount)
      const txnDateTime = queryParams.get("txnDate");
      const txnDate = txnDateTime ? txnDateTime.split(" ")[0] : null;
      const formattedTxnDate = txnDate
        ? txnDate.split("-").reverse().join("-") // Convert "21-01-2025" to "2025-01-21"
        : null;
      const payInstrument = queryParams.get("payInstrument");
      const pgTransId = queryParams.get("pgTransId");
      const mtxnId = queryParams.get("mtxnId");
      setmtxnId(mtxnId);
      const receiptNumber = queryParams.get("receiptNumber");
      const status = queryParams.get("status") || "Failed"; // Take status from decrypted query or default to "Failed"
      setStatus(status);

      const transactionData = {
        user_id: userId,
        transaction_id: transId,
        booking_id: bookingId,
        amount: amount,
        transaction_date: formattedTxnDate,
        payment_method: payInstrument,
        status: status,
        pgTransId: pgTransId,
        mtxnId: mtxnId,
        receiptNumber: receiptNumber,
      };

      console.log(transactionData)

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

  const handlePaymentFailure = async () => {
    if (bookingInProgress.current) {
      console.warn("Booking already in progress. Skipping duplicate call.");
      return;
    }
    bookingInProgress.current = true;

    const encryptedQuery = new URLSearchParams(window.location.search).get("query");
    // const privateKey = "Wq0F6lS7A5tIJU90"; // Replace with your actual private key
    // const privateValue = "lo4syhqHnRjm4L0T"; // Replace with your actual private value

    // const privateKey = "7R7WkmrgZilbokoB";
    // const privateValue = "x8mYTSawyBGpM9iq";
    console.log(encryptedQuery)

    const privateKey ="3md6uPicmLlZmlVG";
    const privateValue ="xVJSbcqImp2utNzi";

    let decryptedQuery;
    try {
      decryptedQuery = decryptData(encryptedQuery, privateValue, privateKey);
      console.log(decryptedQuery);
    } catch (error) {
      console.error("Failed to decrypt query:", error);
      bookingInProgress.current = false;
      return;
    }

    const queryParams = new URLSearchParams(decryptedQuery);

    // Extract required data
    const txn_id = queryParams.get("transId");
    const status = queryParams.get("status") || "Failed";
    const amount = parseFloat(queryParams.get("requestedAmount"));
    const bookingId = queryParams.get("mtxnId");


    // pgTransId=null&transId=230125890311&amount=null&requestedAmount=25.0&mtxnId=362&firstName=Tata Tiago EV-UP93CT5232&
    // lastName=null&payInstrument=null&email=&contact=&respCode=0999&mcode=JHA434&txnDate=23-01-2025 14:25:12&
    // status=pending&rmsg=RC_EAZYPAY_E00335&udf1=null&udf2=null&udf3=null&udf4=null&udf5=null&udf6=null&udf7=nul

    if (!txn_id || !amount || !bookingId) {
      console.error("Incomplete booking details detected.");
      alert("Booking details are incomplete. Please try again.");
      bookingInProgress.current = false;
      return;
    }

    // Construct payload
    const payload = {
      txn_id,
      status,
      amount,
      bookingId,
    };
console.log(payload)
    try {
      // Make PUT API call
      const response = await fetch(`https://cabapi.payplatter.in/api/bookings/${payload.bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking with failed status.");
      }

      console.log("Payment failure details submitted successfully:", payload);
    } catch (error) {
      console.error("Error during payment failure handling:", error);
      alert("An error occurred while updating the booking status. Please contact support.");
    } finally {
      bookingInProgress.current = false;
    }
  };

  
  

  useEffect(() => {
    handlePaymentFailure();

    // const redirectTimeout = setTimeout(() => {
    //   navigate("/", { replace: true }); // Replace history entry to prevent going back
    // }, 3000);

    // // Cleanup timeout on component unmount
    // return () => clearTimeout(redirectTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment was not successful. You can retry the payment or contact support if the issue persists.
        </p>
        <button
          // onClick={() => navigate("/")}
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