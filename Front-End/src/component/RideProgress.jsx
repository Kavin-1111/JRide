import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const RideProgress = () => {
    const [rideDetails, setRideDetails] = useState(null);
    const [riderDetails, setRiderDetails] = useState(null);
    const [driverDetails, setDriverDetails] = useState(null);
    const [error, setError] = useState(null); // For error handling
    const [loading, setLoading] = useState(true); // For loading state
    const { id } = useParams();
    const navigate= useNavigate();
    console.log(id);

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/rides/${id}`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
                });
                setRideDetails(response.data);
            } catch (error) {
                setError('Error fetching ride details.');
                console.error("Error fetching ride details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRideDetails();
    }, [id]);

    useEffect(() => {
        if (rideDetails && rideDetails.riderId) {
            const fetchRiderDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/users/user/${rideDetails.riderId}`, {
                        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
                    });
                    setRiderDetails(response.data);
                } catch (error) {
                    setError('Error fetching rider details.');
                    console.error("Error fetching rider details:", error);
                }
            };
            fetchRiderDetails();
        }
    }, [rideDetails]);

    useEffect(() => {
        if (rideDetails && rideDetails.driverId) {
            const fetchDriverDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/users/user/${rideDetails.driverId}`, {
                        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
                    });
                    setDriverDetails(response.data);
                } catch (error) {
                    setError('Error fetching driver details.');
                    console.error("Error fetching driver details:", error);
                }
            };
            fetchDriverDetails();
        }
    }, [rideDetails]);

    // Show loading screen until data is fetched
    if (loading) {
        return <p>Loading ride details...</p>;
    }

    // Show error message if there's an issue
    if (error) {
        return <p>{error}</p>;
    }

    const handleClick = (e)=>{
        e.preventDefault();
        navigate(`/feedback/${rideDetails.id}`);
    }

    // Show the actual ride progress details
    return (
        <div className="ride-progress p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Ride Progress</h2>
            <div className="ride-details p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg text-black font-medium">Ride ID: {rideDetails.id}</h3>
                {riderDetails && (
                    <>
                        <p><strong>Rider Name:</strong> {riderDetails.name}</p>
                        <p><strong>Rider Phone:</strong> {riderDetails.phone}</p>
                    </>
                )}
                {driverDetails && (
                    <>
                        <p><strong>Driver Name:</strong> {driverDetails.name}</p>
                        <p><strong>Driver Phone:</strong> {driverDetails.phone}</p>
                    </>
                )}
                <p><strong>Pickup Location:</strong> {rideDetails.src}</p>
                <p><strong>Drop Location:</strong> {rideDetails.dest}</p>
                <p><strong>Status:</strong> {rideDetails.status}</p>

                <button type="button" className='m-2 px-2 border-2 rounded-md cursor-pointer bg-blue-500 text-white' onClick={handleClick}>Complete The Ride</button>
            </div>

        </div>
    );
};

export default RideProgress;
