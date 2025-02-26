import React, { useState, useEffect } from 'react';
import axios from 'axios';

// filepath: /c:/Coding/JMAN/Web Development/JRide/Front-End/src/component/RideProgress.jsx

const RideProgress = () => {
    const [rideDetails, setRideDetails] = useState(null);

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rides/current', {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
                });
                setRideDetails(response.data);
            } catch (error) {
                console.error("Error fetching ride details:", error);
            }
        };

        fetchRideDetails();
    }, []);

    if (!rideDetails) {
        return <p>Loading ride details...</p>;
    }

    return (
        <div className="ride-progress p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Ride Progress</h2>
            <div className="ride-details p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg text-black font-medium">Ride ID: {rideDetails.id}</h3>
                <p><strong>Rider Name:</strong> {rideDetails.rider.name}</p>
                <p><strong>Rider Phone:</strong> {rideDetails.rider.phone}</p>
                <p><strong>Driver Name:</strong> {rideDetails.driver.name}</p>
                <p><strong>Driver Phone:</strong> {rideDetails.driver.phone}</p>
                <p><strong>Pickup Location:</strong> {rideDetails.src}</p>
                <p><strong>Drop Location:</strong> {rideDetails.dest}</p>
                <p><strong>Status:</strong> {rideDetails.status}</p>
            </div>
        </div>
    );
};

export default RideProgress;