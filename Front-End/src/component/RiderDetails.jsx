import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const RiderDetails = () => {
  const location = useLocation();
  const { source, destination } = location.state;

  const [filters, setFilters] = useState({ vehicleType: "", totalSeats: "", gender: "" });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/drivers/", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });
        setRides(response.data || []);
      } catch (error) {
        console.error("Error fetching rides:", error);
        setRides([]);
      }
      setLoading(false);
    };
    fetchRides();
  }, [source, destination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredRides = rides.filter((ride) => {
    return (
      ride.origin.toLowerCase().includes(source.toLowerCase()) &&
      ride.destination.toLowerCase().includes(destination.toLowerCase()) &&
      (filters.vehicleType ? ride.vehicleType.toLowerCase() === filters.vehicleType.toLowerCase() : true) &&
      (filters.totalSeats ? ride.availability >= parseInt(filters.totalSeats) : true)
    );
  });

  const bookRide = async (ride) => {
    setWaiting(true);
    try {
      const response = await axios.post("http://localhost:5000/api/rides/", {
        driverId: ride.userId,
        riderId: sessionStorage.getItem("userId"),
        seatsAvailable: parseInt(ride.availability),
        price: parseFloat(ride.price),
        src: source,
        dest: destination,
        vehicleType: ride.vehicleType,
        status: 'pending',
      }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      if (response.status === 201) {
        setSelectedRide(response.data);
        console.log("Ride booked successfully:", response.data);
      } else {
        console.error("Failed to book ride:", response.status);
      }
    } catch (error) {
      console.error("Error booking ride:", error);
    }
  };

  return (
    <div className="flex gap-10 p-10">
      {!waiting ? (
        <>
          <div className="p-4 w-1/4 bg-white shadow-xl rounded-lg">
            <h2 className="text-lg font-bold mb-2">Get Rides</h2>
            <p><strong>Source:</strong> {source}</p>
            <p><strong>Destination:</strong> {destination}</p>
            <label className="block font-semibold mt-2">Vehicle Type:</label>
            <select name="vehicleType" value={filters.vehicleType} onChange={handleChange} className="border rounded p-1 w-full bg-gray-200">
              <option value="">Select</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
            {filters.vehicleType === "car" && (
              <>
                <label className="block font-semibold mt-2">Number of Seats:</label>
                <input type="number" name="totalSeats" min="1" value={filters.totalSeats} onChange={handleChange} className="border rounded p-1 w-full bg-gray-200" />
              </>
            )}
          </div>

          <div className="p-4 w-2/4 bg-white shadow-xl rounded-lg">
            <h2 className="text-lg font-bold mb-4">Available Rides</h2>
            {loading ? (
              <p>Loading rides...</p>
            ) : filteredRides.length === 0 ? (
              <p>No rides found for this route.</p>
            ) : (
              filteredRides.map((ride) => (
                <div key={ride.ride_id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-lg cursor-pointer hover:bg-gray-200">
                  <div className="flex items-center gap-4">
                    <img src={ride.profile_pic} alt={ride.licenseHolderName} className="w-12 h-12 rounded-full" />
                    <div>
                      <h3 className="text-lg font-semibold">{ride.licenseHolderName}</h3>
                      <p className="text-sm text-gray-600">{ride.availability} Seat | {ride.vehicleType}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={() => bookRide(ride)}>
                    Request Ride
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-screen w-full bg-gray-100">
          <div className="text-center">
            <p className="text-xl font-bold">Waiting for Ride Confirmation...</p>
            <p className="text-gray-500">Please wait while we connect you with the rider.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderDetails;
