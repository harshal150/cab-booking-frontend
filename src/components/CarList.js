import React from "react";

const CarList = ({ cars }) => {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cars.length === 0 ? (
        <p className="text-center text-gray-500">
          No matching cars found. Select a cab type and search.
        </p>
      ) : (
        cars.map((car) => (
          <div
            key={car.id}
            className="flex border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            {/* Image Section */}
            <div className="w-1/2">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="w-1/2 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{car.name}</h3>
                <p className="text-gray-500">Type: {car.cabType}</p>
                <p className="text-gray-500">Rate: {car.rate}</p>
              </div>
              <button
                className="mt-4 px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => alert(`Booking ${car.name}!`)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CarList;
