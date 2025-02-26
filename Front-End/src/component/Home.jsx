import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem('userId');

  const handleButtonClick = () => {
    navigate(isLoggedIn ? '/car-or-bike-selection' : '/login');
  };

  return (
    <div className="home bg-cover bg-center min-h-screen bg-white-200">
      {/* Main Container */}
      <div className="flex justify-between items-center min-h-screen px-12">
        {/* Left - Image */}
        <div className="flex-1 flex justify-center">
          <div className="w-full h-full overflow-hidden">
            <img
              src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcfa4745e-d969-4ebb-a0bf-c5e15004e320_1200x630.gif"
              alt="Background"
              className="w-900 h-[900px] rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Right - Text Content */}
        <div className="flex-1 flex justify-center items-center">
          <div className="p-8 max-w-lg text-center space-y-5">
            {/* Card Wrapper for the Heading */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-3 border border--200">
              <h1 className="text-4xl font-bold text-rose-400 ">
                Seamless Ride-Sharing,<br /> Anytime, Anywhere!
              </h1>
            </div>

            <div className="text-lg text-gray-700 italic">
              <span className="text-2xl font-bold">"Find a Ride or Offer One with Ease!"</span> <br />
              <h3 className="text-xl ">"Connect with nearby riders and ridees effortlessly. Need a ride? Find trusted drivers in your area. Want to offer a ride? Register your details and start earning. Manage bookings, track rides, and enjoy a hassle-free travel experience—all in one platform!"</h3>
            </div>

            <div className="mt-5 flex justify-center">
              <button 
                onClick={handleButtonClick} 
                className="bg-blue-800 text-white px-6 py-3 text-lg rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
              >
                Uncover More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
