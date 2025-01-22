

// import React, { useState } from "react";
// import logo from "../assets/Logo.png";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   // Function to send OTP
//   const handleSendOtp = async () => {
//     if (!/^\d{10}$/.test(mobileNumber)) {
//       setErrorMessage("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     setErrorMessage("");

//     try {
//       // Generate a random 4-digit OTP
//       const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
//       const smsMessage = `OTP to login JSCL Mobile App is ${generatedOtp}`;
//       console.log(generatedOtp);

//       // Store OTP and mobile number locally
//       localStorage.setItem("generatedOtp", generatedOtp);
//       sessionStorage.setItem("updatedmobilenumber", mobileNumber);

//       // Send OTP via API
//       const apiUrl = `https://payplatter.in/otpSend.php?mobileNos=${encodeURIComponent(
//         mobileNumber
//       )}&message=${encodeURIComponent(smsMessage)}`;

//       const response = await fetch(apiUrl, { method: "GET" });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       console.log("OTP sent successfully");
//       setIsOtpSent(true);
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       setErrorMessage("Failed to send OTP. Please try again.");
//     }
//   };

//   // Function to verify OTP
//   const handleVerifyOtp = () => {
//     const enteredOtp = otp.join(""); // Combine OTP digits

//     if (enteredOtp.length !== 4 || !/^\d{4}$/.test(enteredOtp)) {
//       setErrorMessage("Please enter a valid 4-digit OTP.");
//       return;
//     }

//     const storedOtp = localStorage.getItem("generatedOtp");

//     if (enteredOtp === storedOtp) {
//       localStorage.removeItem("generatedOtp"); // Clear stored OTP
//       setErrorMessage("");
//       setShowModal(false);
//       navigate("/passangers"); // Navigate to passengers page
//     } else {
//       setErrorMessage("Invalid OTP. Please try again.");
//     }
//   };

//   // Function to handle OTP input changes
//   const handleOtpChange = (value, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = value.slice(-1); // Only keep the last digit
//     setOtp(newOtp);

//     // Automatically focus on the next input
//     if (value && index < 3) {
//       document.getElementById(`otp-box-${index + 1}`).focus();
//     }
//   };

//   return (
//     <>
//       <nav className="bg-[#FBF8EF] shadow-md hover:shadow-lg sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-24">
//             {/* Logo Section */}
//             <div className="flex items-center">
//               <a href="/">
//                 <img src={logo} alt="Logo" className="h-16" />
//               </a>
//             </div>

//             {/* Spacer */}
//             <div className="flex-grow"></div>

//             {/* My Bookings Button */}
//             <button
//               onClick={() => setShowModal(true)}
//               className="py-2 px-6 bg-teal-500 text-white font-semibold hover:bg-teal-600 text-lg rounded-lg shadow-lg transition duration-200"
//             >
//               My Bookings
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Modal for OTP Login */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
//           <div className="relative bg-white p-6 md:p-8 rounded-lg w-full max-w-sm md:max-w-md shadow-xl">
//             {!isOtpSent ? (
//               <>
//                 <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6">
//                   Enter Mobile Number
//                 </h2>
//                 <input
//                   type="tel"
//                   placeholder="Enter your mobile number"
//                   value={mobileNumber}
//                   maxLength={10}
//                   onChange={(e) => {
//                     const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
//                     setMobileNumber(value);
//                   }}
//                   className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md mb-2"
//                 />
//                 {errorMessage && (
//                   <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
//                 )}
//                 <button
//                   onClick={handleSendOtp}
//                   className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
//                 >
//                   Send OTP
//                 </button>
//               </>
//             ) : (
//               <>
//                 <h2 className="text-md md:text-xl font-bold text-gray-800 text-center mb-4">
//                   Enter OTP
//                 </h2>
//                 <div className="flex justify-between gap-2 mb-4">
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       id={`otp-box-${index}`}
//                       type="text"
//                       maxLength="1"
//                       value={digit}
//                       onChange={(e) => handleOtpChange(e.target.value, index)}
//                       className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-semibold focus:ring-1 focus:ring-[#78B3CE] focus:outline-none shadow-md"
//                     />
//                   ))}
//                 </div>
//                 {errorMessage && (
//                   <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
//                 )}
//                 <button
//                   onClick={handleVerifyOtp}
//                   className="w-full py-3 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md"
//                 >
//                   Verify & Login
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;



import React, { useState } from "react";
import logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Function to send OTP
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setErrorMessage("");

    try {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const smsMessage = `OTP to login JSCL Mobile App is ${generatedOtp}`;
      console.log(generatedOtp);

      localStorage.setItem("generatedOtp", generatedOtp);
      sessionStorage.setItem("updatedmobilenumber", mobileNumber);
      console.log(mobileNumber)
// console.log("stored mob number" ,sessionStorage.setItem("updatedmobilenumber", mobileNumber))
      const apiUrl = `https://payplatter.in/otpSend.php?mobileNos=${encodeURIComponent(
        mobileNumber
      )}&message=${encodeURIComponent(smsMessage)}`;

      const response = await fetch(apiUrl, { method: "GET" });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("OTP sent successfully");
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4 || !/^\d{4}$/.test(enteredOtp)) {
      setErrorMessage("Please enter a valid 4-digit OTP.");
      return;
    }

    const storedOtp = localStorage.getItem("generatedOtp");

    if (enteredOtp === storedOtp) {
      localStorage.removeItem("generatedOtp");
      setErrorMessage("");
      setShowModal(false);
      navigate("/passangers");
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  // Function to handle OTP input changes
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-box-${index + 1}`).focus();
    }
  };

  return (
    <>
      <nav className="bg-[#FBF8EF] shadow-md hover:shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <a href="/">
                <img src={logo} alt="Logo" className="h-16" />
              </a>
            </div>

            <div className="flex-grow"></div>

            <button
              onClick={() => setShowModal(true)}
              className="py-2 px-6 bg-teal-500 text-white font-semibold hover:bg-teal-600 text-lg rounded-lg shadow-lg transition duration-200"
            >
              My Bookings
            </button>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 md:p-8 rounded-lg w-full max-w-sm md:max-w-md shadow-xl">
            {/* Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-lg"
            >
              ✖
            </button>

            {!isOtpSent ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6">
                  Enter Mobile Number
                </h2>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
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
                  Enter OTP
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
      )}
    </>
  );
};

export default Navbar;
