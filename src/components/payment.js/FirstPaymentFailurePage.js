import React from 'react';
import { useNavigate } from 'react-router-dom';

const FirstPaymentFailurePage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
                <p className="text-gray-600 mb-6">
                    Unfortunately, your payment was not successful. Please try again or contact support if the issue persists.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default FirstPaymentFailurePage;
