import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

const RideRequests = () => {
  const [requests, setRequests] = useState([]);
  const [rider, setRider] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRideRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rides/available', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        setRequests(response.data);

      } catch (error) {
        console.error("Error fetching ride requests:", error);
      }
    };

    fetchRideRequests();
  }, []);
  const updateRideStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/rides/${id}/book`, {}, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: 'Booked' } : request
        )
      );
      navigate(`/rideprogress/${id}`);
    } catch (error) {
      console.error(`Error updating the ride status to ${status}:`, error);
    }
  };

  return (
    <div className="ride-requests p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Ride Requests</h2>
      <div className="requests-list">
        {requests.length === 0 ? (
          <p className="text-gray-600">No available ride requests</p>
        ) : (
          requests.map(({ id, src, dest, status, riderId }) => (
            <div key={id} className="request-item p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-lg text-black font-medium">Ride ID: {id}</h3>
              <p><strong>Rider Id:</strong> {riderId}</p>
              <p><strong>Rider Name:</strong> {rider ? rider.name : 'N/A'}</p>
              <p><strong>Rider Phone:</strong> {rider ? rider.phone : 'N/A'}</p>
              <p><strong>Pickup:</strong> {src}</p>
              <p><strong>Drop:</strong> {dest}</p>
              <p><strong>Status:</strong> {status}</p>
              <div className="buttons mt-2">
                <button
                  onClick={() => updateRideStatus(id, 'accept')}
                  className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600"
                  disabled={status !== 'pending'}
                >
                  Accept
                </button>
                <button
                  onClick={() => updateRideStatus(id, 'reject')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={status !== 'pending'}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideRequests;
