import { useState } from "react";

const OTPLogin = ({ onClose, mobileNumber, setMobileNumber }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMessage("");
    setIsOtpSent(true); // Simulate OTP sent
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep the last digit
    setOtp(newOtp);

    // Automatically focus on the next box if a digit is entered
    if (value && index < 3) {
      document.getElementById(`otp-box-${index + 1}`).focus();
    }
  };

  const handleLogin = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4 || !/^\d{4}$/.test(enteredOtp)) {
      setErrorMessage("Please enter a valid 4-digit OTP.");
      return;
    }
    setErrorMessage("");
    alert("Login successful!"); // Simulate successful login
    onClose(); // Close the OTP screen
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Passenger Login
        </h2>

        {!isOtpSent ? (
          <>
            {/* Enter Mobile Number */}
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

            {/* Send OTP Button */}
            <button
              onClick={handleSendOtp}
              className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            {/* Enter OTP */}
            <div className="flex justify-between mb-4">
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

            {/* Verify and Login Button */}
            <button
              onClick={handleLogin}
              className="w-full py-3 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md"
            >
              Verify & Login
            </button>
            <p className="mt-3 font-semibold"> Enter OTP as 1234</p>
          </>
        )}

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default OTPLogin;
