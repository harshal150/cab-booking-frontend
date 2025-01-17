import React, { useState } from "react";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import "react-toastify/dist/ReactToastify.css";

const PaymentComponent = () => {
  const [cabName, setCabName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Direct values (replace with actual values)
  const RouterDomain = "https://test.payplatter.in/Router/initiateTransaction"; // Replace with actual router domain
  const merchantCode = "THE265";
  const username = "MPANKA261";
  const password = "[C@445aba30";
  const privateKey = "Wq0F6lS7A5tIJU90";
  const privateValue = "lo4syhqHnRjm4L0T";
  const successURL = "http://localhost:3000/";
  const failureURL = "http://localhost:3000/payment-failure";

  const encryptData = (data, iv, key) => {
    const keyBytes = CryptoJS.enc.Utf8.parse(key.padEnd(16, "0").slice(0, 16));
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);
    const encrypted = CryptoJS.AES.encrypt(data, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  };

  const handlePaymentInitialization = async () => {
    if (!cabName || !userEmail || !mobileNumber || !paymentAmount) {
      toast.error("Please fill all the fields to proceed.");
      return;
    }

    try {
      const txnId = `txn_${Date.now()}`;
      const settlementSplit = `online_${paymentAmount}~`;

      let query = `?mcode=${merchantCode}&uname=${username}&psw=${password}&amount=${paymentAmount}&settlement_split=${settlementSplit}&mtxnId=${txnId}&pfname=${cabName}&plname=&pmno=${mobileNumber}&pemail=${userEmail}&padd=&surl=${successURL}&furl=${failureURL}&udf6=`;

      // Encrypt the query string
      const encryptedQuery = encryptData(query, privateValue, privateKey).replace(
        /\+/g,
        "%2B"
      );
      const finalURL = `${RouterDomain}?query=${encryptedQuery}&mcode=${merchantCode}`;

      // Redirect to payment URL
      window.location.href = finalURL;
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Manrope",
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Cab Payment Details</h3>
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="cabName" style={{ fontWeight: "bold" }}>
          Cab Name:
        </label>
        <input
          id="cabName"
          type="text"
          placeholder="Enter Cab Name"
          value={cabName}
          onChange={(e) => setCabName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="userEmail" style={{ fontWeight: "bold" }}>
          User Email:
        </label>
        <input
          id="userEmail"
          type="email"
          placeholder="Enter User Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="mobileNumber" style={{ fontWeight: "bold" }}>
          Mobile Number:
        </label>
        <input
          id="mobileNumber"
          type="text"
          placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="paymentAmount" style={{ fontWeight: "bold" }}>
          Payment Amount (₹):
        </label>
        <input
          id="paymentAmount"
          type="number"
          placeholder="Enter Payment Amount"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
      </div>

      <button
        onClick={handlePaymentInitialization}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default PaymentComponent;
