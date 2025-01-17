import React from 'react';
import { useNavigate } from 'react-router-dom';

const FinalPaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Not Completed</h1>
                <p className="text-gray-600 mb-6">
                    Sorry, your payment could not be processed. Please try again later or contact support if the issue persists.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default FinalPaymentFailure;
