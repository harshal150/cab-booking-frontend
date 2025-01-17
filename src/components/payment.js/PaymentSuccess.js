import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  // Retrieve booking details from sessionStorage
  const bookingId = sessionStorage.getItem("bookingId");
  const mobileNumber = sessionStorage.getItem("mobileNumber"); // User's mobile number
  const userName = sessionStorage.getItem("userName");
  const date = sessionStorage.getItem("rideDate");
  const time = sessionStorage.getItem("rideTime");
  const driverName = sessionStorage.getItem("driverName");
  const driverMobile = sessionStorage.getItem("driverMobile");

  console.log("User Mobile:", mobileNumber);
  console.log("Driver Mobile:", driverMobile);
  console.log("booking id :", bookingId);

  useEffect(() => {
    const sendSMS = async () => {
      try {
        console.log("Sending SMS to user and driver...");

        // 1. SMS to the User
        const userSmsMessage = `Dear ${userName}, Your cab booking is confirmed! Booking ID/Date/Time: ${bookingId} / ${date} ${time} Driver Name/Contact: ${driverName} - ${driverMobile} Jhansi Smart City - Larsen and Toubro Limited`;

        const userSmsUrl = `http://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=${encodeURIComponent(
          userSmsMessage
        )}&senderId=JSICCC&routeId=1&mobileNos=${mobileNumber}&smsContentType=english`;
console.log(userSmsUrl)
        const userSmsResponse = await fetch(userSmsUrl, { method: "GET" });

        if (!userSmsResponse.ok) {
          throw new Error("Failed to send SMS to user");
        }

        console.log("User SMS sent successfully:", await userSmsResponse.text());

        // 2. SMS to the Driver
        const driverSmsMessage = `Dear Driver, You have a new ride request! Booking ID: ${bookingId} Pickup Date/Time: ${date} ${time} Customer Name/Contact: ${userName} - ${mobileNumber} Jhansi Smart City - Larsen and Toubro Limited`;

        const driverSmsUrl = `http://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=${encodeURIComponent(
          driverSmsMessage
        )}&senderId=JSICCC&routeId=1&mobileNos=${driverMobile}&smsContentType=english`;
        console.log(driverSmsUrl)

        const driverSmsResponse = await fetch(driverSmsUrl, { method: "GET" });

        if (!driverSmsResponse.ok) {
          throw new Error("Failed to send SMS to driver");
        }

        console.log("Driver SMS sent successfully:", await driverSmsResponse.text());
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    };

    sendSMS();
  }, [bookingId, mobileNumber, userName, date, time, driverName, driverMobile]);

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
      </div>
    </div>
  );
};

export default PaymentSuccess;
