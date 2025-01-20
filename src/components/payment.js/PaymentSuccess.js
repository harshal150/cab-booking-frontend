



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const PaymentSuccess = () => {
//   const [isBookingCreated, setIsBookingCreated] = useState(false); // Prevent duplicate booking
//   const navigate = useNavigate();

//   const handlePaymentSuccess = async () => {
//     if (isBookingCreated) return; // Prevent duplicate booking creation

//     const txnId = new URLSearchParams(window.location.search).get("txnId");

//     if (!txnId) {
//       alert("Invalid transaction. Please try again.");
//       return;
//     }

//     try {
//       // Retrieve sessionStorage data
//       const cabId = sessionStorage.getItem("cabId");
//       const driverId = sessionStorage.getItem("driverId");
//       const userId = sessionStorage.getItem("userId");
//       const rideDate = sessionStorage.getItem("rideDate");
//       const rideTime = sessionStorage.getItem("rideTime");
//       const approxHours = sessionStorage.getItem("approxHours");

//       if (!cabId || !driverId || !userId) {
//         throw new Error("Incomplete booking details. Please contact support.");
//       }

//       // Construct booking payload
//       const payload = {
//         booking_date: rideDate,
//         booking_time: rideTime,
//         cab_id: cabId,
//         driver_id: driverId,
//         user_id: userId,
//         approx_hours: parseFloat(approxHours),
//         status: "booked", // Mark as booked after successful payment
//       };

//       // Submit booking to the backend
//       const response = await fetch("https://cabapi.payplatter.in/api/bookings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create booking.");
//       }

//       console.log("Booking created successfully.");

//       // Fetch all bookings to find the latest one
//       const fetchAllBookingsResponse = await fetch(
//         "https://cabapi.payplatter.in/api/bookings"
//       );

//       if (!fetchAllBookingsResponse.ok) {
//         throw new Error("Failed to fetch all bookings.");
//       }

//       const allBookings = await fetchAllBookingsResponse.json();

//       // Get the latest booking by finding the one with the highest ID
//       const latestBooking = allBookings.reduce((latest, booking) =>
//         booking.booking_id > latest.booking_id ? booking : latest
//       );

//       console.log("Latest booking:", latestBooking);

//       if (!latestBooking) {
//         throw new Error("No bookings found.");
//       }

//       // Fetch the full details of the latest booking
//       const fetchLatestBookingResponse = await fetch(
//         `https://cabapi.payplatter.in/api/bookings/${latestBooking.booking_id}`
//       );

//       if (!fetchLatestBookingResponse.ok) {
//         throw new Error("Failed to fetch the latest booking details.");
//       }

//       const booking = await fetchLatestBookingResponse.json();
//       console.log("Fetched latest booking details:", booking);

//       // Mark booking as created to prevent duplicates
//       setIsBookingCreated(true);

//       // Send SMS notifications
//       sendNotifications(booking);

//       alert("Booking confirmed successfully!");
//     } catch (error) {
//       console.error("Error during booking confirmation:", error);
//       alert("An error occurred while confirming your booking.");
//     }
//   };

//   const sendNotifications = async (booking) => {
//     const sendSMS = async (mobile, message) => {
//       try {
//         const apiUrl = `https://payplatter.in/otpSend.php?mobileNos=${encodeURIComponent(
//           mobile
//         )}&message=${encodeURIComponent(message)}`;
//         const response = await fetch(apiUrl, {
//           method: "GET",
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to send SMS to ${mobile}`);
//         }

//         console.log(`SMS sent to ${mobile}:`, await response.text());
//       } catch (error) {
//         console.error("Error sending SMS:", error);
//       }
//     };

//     try {
//       console.log("Sending SMS to user and driver...");

//       // Extract details from the booking
//       const {
//         user_mobile_no: userMobile,
//         user_name: userName,
//         driver_mobile_no: driverMobile,
//         driver_name: driverName,
//         booking_date: rideDate,
//         booking_time: rideTime,
//         booking_id: bookingId,
//       } = booking;

//       // Log data for debugging
//       console.log("User Mobile:", userMobile);
//       console.log("User Name:", userName);
//       console.log("Driver Mobile:", driverMobile);
//       console.log("Driver Name:", driverName);
//       console.log("Ride Date:", rideDate);
//       console.log("Ride Time:", rideTime);
//       console.log("Booking ID:", bookingId);

//       if (!userMobile || !userName || !driverMobile || !driverName) {
//         throw new Error("Incomplete data for sending SMS.");
//       }

//       // SMS to the User
//       const userSmsMessage = `Dear ${userName}, Your cab booking is confirmed! Booking ID/Date/Time: ${bookingId} / ${rideDate} ${rideTime} Driver Name/Contact: ${driverName} - ${driverMobile} Jhansi Smart City - Larsen and Toubro Limited`;

//       await sendSMS(userMobile, userSmsMessage);

//       // SMS to the Driver
//       const driverSmsMessage = `Dear Driver, You have a new ride request! Booking ID: ${bookingId} Pickup Date/Time: ${rideDate} ${rideTime} Customer Name/Contact: ${userName} - ${userMobile} Jhansi Smart City - Larsen and Toubro Limited`;

//       await sendSMS(driverMobile, driverSmsMessage);

//       console.log("SMS notifications sent successfully.");
//     } catch (error) {
//       console.error("Error sending notifications:", error);
//     }
//   };

//   useEffect(() => {
//     handlePaymentSuccess();
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
//         <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
//         <p className="text-gray-700 text-lg mb-6">
//           Your booking has been confirmed, and SMS notifications have been sent to you and the driver.
//         </p>
//         <button
//           onClick={() => navigate("/passangers")}
//           className="py-2 px-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md transition duration-200"
//         >
//           Booking Details
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;


import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const bookingInProgress = useRef(false); // Prevent duplicate API calls
  const navigate = useNavigate();

  const handlePaymentSuccess = async () => {
    // Prevent duplicate calls
    if (bookingInProgress.current) {
      console.warn("Booking already in progress. Skipping duplicate call.");
      return;
    }
    bookingInProgress.current = true;

    const txnId = new URLSearchParams(window.location.search).get("txnId");

    if (!txnId) {
      alert("Invalid transaction. Please try again.");
      bookingInProgress.current = false; // Allow retries
      return;
    }

    try {
      // Retrieve sessionStorage data
      const cabId = sessionStorage.getItem("cabId");
      const driverId = sessionStorage.getItem("driverId");
      const userId = sessionStorage.getItem("userId");
      const rideDate = sessionStorage.getItem("rideDate");
      const rideTime = sessionStorage.getItem("rideTime");

      if (!cabId || !driverId || !userId) {
        throw new Error("Incomplete booking details. Please contact support.");
      }

      // Construct booking payload
      const payload = {
        booking_date: rideDate,
        booking_time: rideTime,
        cab_id: cabId,
        driver_id: driverId,
        user_id: userId,
       
        txn_id: txnId, // Unique transaction ID to ensure idempotency
        status: "booked", // Mark as booked after successful payment
      };

      // Submit booking to the backend
      const response = await fetch("https://cabapi.payplatter.in/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking.");
      }

      console.log("Booking created successfully.");

      // Fetch all bookings to find the latest one
      const fetchAllBookingsResponse = await fetch(
        "https://cabapi.payplatter.in/api/bookings"
      );

      if (!fetchAllBookingsResponse.ok) {
        throw new Error("Failed to fetch all bookings.");
      }

      const allBookings = await fetchAllBookingsResponse.json();

      // Get the latest booking by finding the one with the highest ID
      const latestBooking = allBookings.reduce((latest, booking) =>
        booking.booking_id > latest.booking_id ? booking : latest
      );

      console.log("Latest booking:", latestBooking);

      if (!latestBooking) {
        throw new Error("No bookings found.");
      }

      // Fetch the full details of the latest booking
      const fetchLatestBookingResponse = await fetch(
        `https://cabapi.payplatter.in/api/bookings/${latestBooking.booking_id}`
      );

      if (!fetchLatestBookingResponse.ok) {
        throw new Error("Failed to fetch the latest booking details.");
      }

      const booking = await fetchLatestBookingResponse.json();
      console.log("Fetched latest booking details:", booking);

      // Send SMS notifications
      sendNotifications(booking);

      alert("Booking confirmed successfully!");
    } catch (error) {
      console.error("Error during booking confirmation:", error);
      alert("An error occurred while confirming your booking.");
    } finally {
      bookingInProgress.current = false; // Allow future attempts if needed
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
    handlePaymentSuccess();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
        <p className="text-gray-700 text-lg mb-6">
          Your booking has been confirmed, and SMS notifications have been sent to you and the driver.
        </p>
        <button
          onClick={() => navigate("/passangers")}
          className="py-2 px-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md transition duration-200"
        >
          Booking Details
        </button>
        <div className="flex items-center justify-center mt-3">
          <p className="font-semibold">Please go to Booking details. You will be able to see your booked rides using your mobile number. You can start your ride there.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
