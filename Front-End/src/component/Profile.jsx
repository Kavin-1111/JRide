import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import RideRequests from "./RideRequest";

const Navbar = ({ toggleRideRequests, isRideRequestVisible }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-black w-full py-4 px-6 flex justify-between items-center text-white shadow-md relative">
            <h2 className="text-xl font-semibold">Share the ride, Share the joy</h2>
            <div className="flex items-center gap-x-1">
                <FaUserCircle size={28} />
                <FaChevronDown
                    size={18}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{ cursor: "pointer" }}
                />
            </div>
            {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border z-50">
                    <ul className="text-black">
                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={toggleRideRequests}>Request</li>
                        {isRideRequestVisible && (
                            <div className="absolute bg-white shadow-lg mt-2 rounded-lg w-48 z-10">
                                <RideRequests />
                            </div>
                        )}
                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-200">Log Out</li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [rides, setRides] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                });
                setUser(userResponse.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchRideData = async () => {
            try {
                const rideResponse = await axios.get("http://localhost:5000/api/rides/available", {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                });
                setRides(rideResponse.data);
            } catch (error) {
                console.error("Error fetching ride data:", error);
            }
        };

        fetchUserData();
        fetchRideData();
    }, []);

    return (
        <div className="bg-gray-100 h-screen">
            <Navbar />
            <div className="flex justify-around items-center w-full h-full p-6">
                <div className=" flex flex-col justify-between items-center p-6 bg-white shadow-xl rounded-lg mt-6 w-1/5 h-1/2">
                    <h2 className="text-xl font-bold text-center h-1/5">User Profile</h2>
                    {user ? (
                        <div className=" text-left mt-4 h-4/5 gap-5">
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                            <p><strong>Age:</strong> {user.age}</p>
                            <p><strong>Gender:</strong> {user.gender}</p>
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>
                <div className="p-6 w-3/4 bg-white shadow-xl rounded-lg mt-6">
                    <h2 className="text-xl font-bold text-center">Ride History</h2>
                    {rides.length > 0 ? (
                        <ul className="mt-4">
                            {rides.map((ride) => (
                                <li key={ride.id} className="flex gap-5 justify-between p-4 border-b">
                                    <p><strong>Origin:</strong> {ride.src}</p>
                                    <p><strong>Destination:</strong> {ride.dest}</p>
                                    <p><strong>Price:</strong> ₹{ride.price}</p>
                                    <p><strong>Status:</strong> {ride.status}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No ride history available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
