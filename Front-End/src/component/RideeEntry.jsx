import React, { useState } from "react";

import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import { Link } from "react-router-dom";

const RiderEntry = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/rides", { state: { source, destination } });
  };

  return (
    <>
      <div className="flex justify-end p-4 text-3xl font-bold hover:text-gray-500 cursor-pointer hover:underline transition duration-300">
        <Link to="/rideprogress">RideProgress</Link>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center px-6 h-screen">
        {/* Left Side - Input Fields */}
        <div className="w-full lg:w-1/3 p-8 bg-white shadow-xl rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-3">
            Request a ride for now or later
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Select your locations on the map or enter them manually.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-center border border-gray-300 rounded-md px-3 py-2">
              <MapPin className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Enter source location"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full focus:outline-none"
              />
            </div>

            <div className="mb-6 flex items-center border border-gray-300 rounded-md px-3 py-2">
              <MapPin className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Enter destination location"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300"
            >
              Request Ride
            </button>
          </form>
        </div>

        <div className="w-full lg:w-2/3 p-4">
          <MapComponent setSource={setSource} setDestination={setDestination} />
        </div>
      </div>
    </>
  );
};

export default RiderEntry;
