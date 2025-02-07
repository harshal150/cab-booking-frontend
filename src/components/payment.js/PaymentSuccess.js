import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { all } from "axios";
import CONFIG from "../../config";
const PaymentSuccess = () => {
  const bookingInProgress = useRef(false); // Prevent duplicate API calls
  const navigate = useNavigate();
  const DOMAIN = CONFIG.REACT_APP_API_DOMAIN;

  const [decryptedQuery, setDecryptedQuery] = useState(null); // State for decrypted query
  const [latestBooking, setLatestBooking] = useState(null); // State for latest booking
  const [newstatus, setStatus] = useState(null); // State for latest booking
  const [newtxnId, setnewtxnId] = useState(null); // State for latest booking
  const [newAmount, setnewAmount] = useState(null); // State for latest booking
  const [newbooking, setnewbooking] = useState(null); // State for latest booking
  const BookingId = sessionStorage.getItem("bookingId");

  const decryptData = (encryptedData, iv, key) => {
    try {
      // Ensure key is exactly 16 bytes
      const keyBytes = CryptoJS.enc.Utf8.parse(
        key.padEnd(16, "0").slice(0, 16)
      );
      const ivBytes = CryptoJS.enc.Utf8.parse(iv.padEnd(16, "0").slice(0, 16));

      // Ensure encrypted data is Base64 decoded
      const encryptedHexStr = CryptoJS.enc.Base64.parse(encryptedData);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedHexStr },
        keyBytes,
        {
          iv: ivBytes,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const result = decrypted.toString(CryptoJS.enc.Utf8);
      if (!result) throw new Error("Decryption resulted in an empty string.");
      return result;
    } catch (error) {
      console.error("Decryption Error:", error.message);
      return null;
    }
  };

  useEffect(() => {
    // Step 1: Extract encrypted query from URL
    const encryptedQuery = new URLSearchParams(window.location.search).get(
      "query"
    );
    if (!encryptedQuery) {
      console.error("No query parameter found in URL.");
      return;
    }

    // Decode URI Component before decryption
    const decodedQuery = decodeURIComponent(encryptedQuery);
    console.log("Decoded Query:", decodedQuery);

    // Step 2: Define decryption keys (must match the encryption process)
    // const privateKey = "Wq0F6lS7A5tIJU90"; // Replace with your actual private key
    // const privateValue = "lo4syhqHnRjm4L0T"; // Replace with your actual private value

    // const privateKey = "7R7WkmrgZilbokoB";
    // const privateValue = "x8mYTSawyBGpM9iq";

    // const privateKey ="Wq0F6lS7A5tIJU90";
    // const privateValue ="lo4syhqHnRjm4L0T";

    const privateKey = process.env.REACT_APP_PRIVATE_VALUE_PRIVATEKEY_KEY;
    const privateValue = process.env.REACT_APP_PRIVATE_VALUE_PRIVATEVALUE_KEY;
    console.log(privateKey);
    console.log(privateValue);

    try {
      // Step 3: Decrypt the query
      const decryptedQuery = decryptData(
        encryptedQuery,
        privateValue,
        privateKey
      );
      const parsedQuery = new URLSearchParams(decryptedQuery);
      setDecryptedQuery(parsedQuery); // Update state with the parsed query
      // Step 4: Parse and log the query data
      console.log(decryptedQuery);
      const queryParams = new URLSearchParams(decryptedQuery);
      queryParams.forEach((value, key) => {
        console.log(`${key}: ${value}`);
        // console.log(queryParams[0].transaction_id)
      });

      const txn_id = queryParams.get("transId");
      const status = queryParams.get("status") || "pending";
      const amount = parseFloat(queryParams.get("amount"));
      // const bookingId = queryParams.get("mtxnId");
      const randomId = queryParams.get("mtxnId"); // Replace bookingId with randomId

      console.log(status);
      console.log(txn_id);
      console.log(amount);
      console.log(randomId);
      setStatus(status);
      setnewAmount(amount);
      setnewbooking(randomId);
      setnewtxnId(txn_id);
    } catch (error) {
      console.error("Failed to decrypt query:", error);
    }
  }, []);

  useEffect(() => {
    const fetchAndHandlePaymentSuccess = async () => {
      try {
        // Step 1: Extract and decode query
        const encryptedQuery = new URLSearchParams(window.location.search).get(
          "query"
        );
        if (!encryptedQuery) {
          console.error("No query parameter found in URL.");
          return;
        }

        console.log("Encrypted Query from URL:", encryptedQuery);
        const decodedQuery = decodeURIComponent(encryptedQuery);
        console.log("Decoded Query:", decodedQuery);




          
    const privateKey = process.env.REACT_APP_PRIVATE_VALUE_PRIVATEKEY_KEY;
    const privateValue = process.env.REACT_APP_PRIVATE_VALUE_PRIVATEVALUE_KEY;


        console.log("Using Key:", privateKey);
        console.log("Using IV:", privateValue);

        // Step 3: Decrypt
        const decryptedQuery = decryptData(
          decodedQuery,
          privateValue,
          privateKey
        );
        if (!decryptedQuery) {
          throw new Error("Decryption failed. Check key and IV.");
        }

        console.log("Decrypted Query:", decryptedQuery);

        // Step 4: Parse the query parameters
        const queryParams = new URLSearchParams(decryptedQuery);
        const txn_id = queryParams.get("transId");
        const status = queryParams.get("status") || "pending";
        const amount = parseFloat(queryParams.get("amount"));
        const randomidfromquery = queryParams.get("mtxnId");

        console.log({ txn_id, status, amount, randomidfromquery });

        if (!txn_id || !amount || !randomidfromquery) {
          console.error("Incomplete booking details detected.");
          alert("Booking details are incomplete. Please try again.");
          return;
        }

        // Step 5: Handle payment success
        await handlePaymentSuccess({ txn_id, status, amount, randomidfromquery });
      } catch (error) {
        console.error("Failed to process payment:", error.message);
      }
    };

    fetchAndHandlePaymentSuccess();
  }, []);

  const handlePaymentSuccess = async ({ txn_id, status, amount, randomidfromquery }) => {
    console.log("Starting payment success process...");

    if (bookingInProgress.current) {
        console.warn("Booking already in progress. Skipping duplicate call.");
        return;
    }
    bookingInProgress.current = true;

    try {
        // Create payload
        const payload = { txn_id, status, amount, randomidfromquery };
        console.log("Payload:", payload);

        // Update booking via API using `randomId`
        const response = await fetch(`${DOMAIN}/api/bookings/update-booking/${payload.randomidfromquery}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error("Failed to update booking.");
        }

        console.log("Booking updated successfully.");

        // Fetch the latest booking details using `randomId`
        const bookingResponse = await fetch(`${DOMAIN}/api/bookings/${BookingId}`);
      const latestBooking = await bookingResponse.json();

        console.log("Fetched booking data:", latestBooking);


        const formattedDate = latestBooking.booking_date; // Directly use it

        console.log("Corrected Booking Date (Final Fix - No Timezone Shift):", formattedDate);


        setLatestBooking(latestBooking);

        if (!latestBooking) {
            throw new Error("No bookings found.");
        }

        // Send SMS notifications
        await sendNotifications(latestBooking);
    } catch (error) {
        console.error("Error during booking confirmation:", error);
        alert("An error occurred while confirming your booking.");
    } finally {
        bookingInProgress.current = false;
    }
};


  const submitTransactionDetails = async (decryptedQuery, latestBooking, userId) => {
    try {
        const queryParams = new URLSearchParams(decryptedQuery);
        const transId = queryParams.get("transId");
        const amount = parseFloat(queryParams.get("amount"));
        const txnDateTime = queryParams.get("txnDate");
        const txnDate = txnDateTime ? txnDateTime.split(" ")[0] : null;
        const formattedTxnDate = txnDate ? txnDate.split("-").reverse().join("-") : null;
        const payInstrument = queryParams.get("payInstrument");
        const status = queryParams.get("status");
        const pgTransId = queryParams.get("pgTransId");
        const randomId = queryParams.get("mtxnId"); // Now using `randomId`
        const receiptNumber = queryParams.get("receiptNumber");

        const transactionData = {
            user_id: userId,
            transaction_id: transId,
            booking_random_id: randomId,  // Use randomId here
            amount: amount,
            transaction_date: formattedTxnDate,
            payment_method: payInstrument,
            status: status,
            pgTransId: pgTransId,
            mtxnId: randomId, // Use randomId instead of bookingId
            receiptNumber: receiptNumber,
        };

        // Send the transaction data to the API
        const response = await fetch(`${DOMAIN}/api/transactions`, {
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

      console.log( "booking_date" , rideDate)

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
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Your booking has been confirmed, and SMS notifications have been sent
          to you and the driver.
        </p>

        {/* Receipt Details */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Receipt Details
          </h2>
          <p className="mb-2">
            <strong>Transaction ID:</strong>{" "}
            {decryptedQuery?.get("transId") || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Booking ID:</strong> {latestBooking?.booking_id || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Amount Paid:</strong> ₹
            {decryptedQuery?.get("amount") || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Payment Method:</strong>{" "}
            {decryptedQuery?.get("payInstrument") || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Payment Status:</strong>{" "}
            {decryptedQuery?.get("status") || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Transaction Date:</strong>{" "}
            {decryptedQuery?.get("txnDate") || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Receipt Number:</strong>{" "}
            {decryptedQuery?.get("receiptNumber") || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Booking Date:</strong>{" "}
            {latestBooking?.booking_date || "N/A"}
          </p>
        </div>

        {/* User and Ride Details */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Ride Details
          </h2>
          <p className="mb-2">
            <strong>User Name:</strong> {latestBooking?.user_name || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Driver Name:</strong> {latestBooking?.driver_name || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Driver Mobile:</strong>{" "}
            {latestBooking?.driver_mobile_no || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Cab Name:</strong> {latestBooking?.cab_name || "N/A"}
          </p>
          {/* <p className="mb-2"><strong>Ride Date:</strong> {latestBooking?.ride_date || "N/A"}</p> */}
        </div>

        <button
          onClick={() => navigate("/passangers")}
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
