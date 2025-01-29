// import { useState } from "react";

// const OTPLogin = ({ onClose, mobileNumber, setMobileNumber }) => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSendOtp = async () => {
//     if (!/^\d{10}$/.test(mobileNumber)) {
//       setErrorMessage("Please enter a valid 10-digit mobile number.");
//       return;
//     }
  
//     setErrorMessage("");
  
//     const randomOtp = Math.floor(1000 + Math.random() * 9000);
//     console.log("Generated OTP:", randomOtp); // Debugging OTP generation
//     localStorage.setItem("generatedOtp", randomOtp.toString());
//     try {
//       const response = await fetch(
//         `https://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=OTP%20to%20login%20JSCL%20Mobile%20App%20is%20${randomOtp}&senderId=JSICCC&routeId=1&mobileNos=${mobileNumber}&smsContentType=english`,
//         { method: "GET" }
//       );
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
  
//       const responseData = await response.json();
//       console.log("API Response:", responseData);
  
//       if (responseData.responseCode === "success") {
//         setIsOtpSent(true);
      
//         console.log("Stored OTP in localStorage:", localStorage.getItem("generatedOtp")); // Debugging storage
//       } else {
//         setIsOtpSent(true);
//       }
//     } catch (error) {
//       setIsOtpSent(true);
//     }
//   };
  

//   const handleOtpChange = (value, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = value.slice(-1); // Only keep the last digit
//     setOtp(newOtp);

//     // Automatically focus on the next box if a digit is entered
//     if (value && index < 3) {
//       document.getElementById(`otp-box-${index + 1}`).focus();
//     }
//   };

//   const handleLogin = () => {
//     const enteredOtp = otp.join(""); // Combine OTP digits into a single string
//     const storedOtp = localStorage.getItem("generatedOtp"); // Retrieve OTP from localStorage
  
//     console.log("Entered OTP:", enteredOtp); // Debugging log
//     console.log("Stored OTP:", storedOtp); // Debugging log
  
//     // Validate OTP
//     if (enteredOtp.length !== 4 || !/^\d{4}$/.test(enteredOtp)) {
//       setErrorMessage("Please enter a valid 4-digit OTP.");
//       return;
//     }
  
//     if (enteredOtp === storedOtp) {
//       setErrorMessage("");
//       localStorage.removeItem("generatedOtp"); // Clear OTP from localStorage after successful login
//       onClose(); // Proceed to the next step or close the OTP screen
//     } else {
//       setErrorMessage("Invalid OTP. Please try again.");
//     }
//   };
  

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
//       <div className="relative bg-white p-6 md:p-8 rounded-lg w-full max-w-sm md:max-w-md shadow-xl">
//         {!isOtpSent ? (
//           <>
//             <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6">
//               Passenger Information
//             </h2>
//             <input
//               type="tel"
//               placeholder="Enter your mobile number"
//               value={mobileNumber}
//               maxLength={10}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
//                 setMobileNumber(value);
//               }}
//               className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md mb-2"
//             />
//             {errorMessage && (
//               <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
//             )}
//             <button
//               onClick={handleSendOtp}
//               className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
//             >
//               Send OTP
//             </button>
//           </>
//         ) : (
//           <>
//             <h2 className="text-md md:text-xl font-bold text-gray-800 text-center mb-4">
//               Enter your OTP
//             </h2>
//             <div className="flex justify-between gap-2 mb-4">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-box-${index}`}
//                   type="text"
//                   maxLength="1"
//                   value={digit}
//                   onChange={(e) => handleOtpChange(e.target.value, index)}
//                   className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-semibold focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
//                 />
//               ))}
//             </div>
//             {errorMessage && (
//               <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
//             )}
//             <button
//               onClick={handleLogin}
//               className="w-full py-3 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md"
//             >
//               Verify & Login
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OTPLogin;





import { useState } from "react";

const OTPLogin = ({ onClose, mobileNumber, setMobileNumber }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Send OTP to the backend API
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
  
    setErrorMessage("");
  
    try {
      // Generate a random 4-digit OTP
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const smsMessage = `OTP to login JSCL Mobile App is ${generatedOtp}`;
  console.log("otp = " ,generatedOtp)
      // Store the OTP locally for verification later
      localStorage.setItem("generatedOtp", generatedOtp);
  
      // Construct the URL with query parameters
      const apiUrl = `https://payplatter.in/otpSend.php?mobileNos=${encodeURIComponent(
        mobileNumber
      )}&message=${encodeURIComponent(smsMessage)}`;
  
      // Send the OTP via the API
      const response = await fetch(apiUrl, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log("OTP Send API Response:", responseData);
      setIsOtpSent(true); // Move to OTP input step
      // Check the response and update the state accordingly
    
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("An error occurred while sending the OTP. Please try again.");
    }
  };
  

  // Verify OTP via the backend API
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join(""); // Combine OTP digits into a single string
  
    if (enteredOtp.length !== 4 || !/^\d{4}$/.test(enteredOtp)) {
      setErrorMessage("Please enter a valid 4-digit OTP.");
      return;
    }
  
    // Retrieve the generated OTP from localStorage
    const storedOtp = localStorage.getItem("generatedOtp");
  
    if (enteredOtp === storedOtp) {
      setErrorMessage(""); // Clear error messages
      alert("OTP verified successfully!"); // Or handle successful login
      localStorage.removeItem("generatedOtp"); // Clear OTP after successful verification
      onClose(); // Proceed to the next step or close the OTP screen
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };
  

  // Handle OTP digit input changes
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep the last digit
    setOtp(newOtp);

    // Automatically focus on the next box if a digit is entered
    if (value && index < 3) {
      document.getElementById(`otp-box-${index + 1}`).focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 md:p-8 rounded-lg w-full max-w-sm md:max-w-md shadow-xl">
        {!isOtpSent ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6">
              Passenger Information
            </h2>
            <input
              type="tel"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                setMobileNumber(value);
              }}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md mb-2"
            />
            {errorMessage && (
              <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
            )}
            <button
              onClick={handleSendOtp}
              className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h2 className="text-md md:text-xl font-bold text-gray-800 text-center mb-4">
              Enter your OTP
            </h2>
            <div className="flex justify-between gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-box-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-semibold focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
                />
              ))}
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
            )}
            <button
              onClick={handleVerifyOtp}
              className="w-full py-3 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md"
            >
              Verify & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPLogin;
