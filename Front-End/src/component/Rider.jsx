import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaMapMarkerAlt, FaChevronDown, FaRegGrinStars } from "react-icons/fa";
import RideRequests from "./RideRequest";

// Component for form validation and submission
const useRideForm = () => {
  const [rideDetails, setRideDetails] = useState({
    startLocation: "",
    endLocation: "",
    price: 0,
    registrationNumber: "",
    helmetRequired: false,
    drivingLicenseNumber: "",
    drivingLicenseName: "",
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleInputChange = (e) => {
    setRideDetails({ ...rideDetails, [e.target.name]: e.target.value });
  };
  
  const handleHelmetChange = (e) => {
    setRideDetails({ ...rideDetails, helmetRequired: e.target.checked });
  };
  
  const validateForm = (vehicle) => {
    let newErrors = {};
    
    if (!rideDetails.startLocation) {
      newErrors.startLocation = "Start location cannot be empty.";
    }
    if (!rideDetails.endLocation) {
      newErrors.endLocation = "End location cannot be empty.";
    }
    if (!rideDetails.price || isNaN(rideDetails.price) || rideDetails.price < 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (vehicle === "Car" && !rideDetails.registrationNumber) {
      newErrors.registrationNumber = "Car registration number is required.";
    }
    if (vehicle === "Bike" && !rideDetails.helmetRequired) {
      newErrors.helmetRequired = "Please confirm if a helmet is needed.";
    }
    if (!rideDetails.drivingLicenseNumber) {
      newErrors.drivingLicenseNumber = "Driving license number is required.";
    }
    if (!rideDetails.drivingLicenseName) {
      newErrors.drivingLicenseName = "Driving license holder's name is required.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const submitRide = async (vehicle, seats) => {
    if (!validateForm(vehicle)) return false;
    
    try {
      const rideData = {
        vehicleType: vehicle,
        availability: seats,
        origin: rideDetails.startLocation,
        destination: rideDetails.endLocation,
        price: parseInt(rideDetails.price),
        registrationNumber: rideDetails.registrationNumber,
        helmetRequired: rideDetails.helmetRequired,
        licenseNumber: rideDetails.drivingLicenseNumber,
        licenseHolderName: rideDetails.drivingLicenseName,
      };
      
      const response = await fetch('http://localhost:5000/api/drivers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(rideData)
      });
      
      if (response.ok) {
        setSuccessMessage("Hurray! You've published a ride!");
        return true;
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || "Something went wrong. Please try again." });
        return false;
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again later." });
      return false;
    }
  };
  
  return {
    rideDetails,
    errors,
    successMessage,
    setSuccessMessage,
    handleInputChange,
    handleHelmetChange,
    submitRide
  };
};

const handleLogout = () => {
    sessionStorage.removeItem('userId');
    // setUserName('');
    navigate('/');
  };

// Navbar component
const Navbar = ({ toggleDropdown, isDropdownOpen, dropdownRef, toggleRideRequests, isRideRequestVisible }) => {
  return (
    <nav className="bg-black w-full py-4 px-6 flex justify-between items-center text-white shadow-md relative">
      <h2 className="text-xl font-semibold">Share the ride, Share the joy</h2>
      <div className="flex items-center gap-x-1">
        <FaUserCircle size={28} />
        <FaChevronDown
          size={18}
          onClick={toggleDropdown}
          style={{ cursor: "pointer" }}
        />
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border z-50"
          style={{ top: "100%" }}
        >
          <ul className="text-black">
            <li
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={toggleRideRequests}
            >
              Request
            </li>
            {isRideRequestVisible && (
              <div className="absolute bg-white shadow-lg mt-2 rounded-lg w-48 z-10">
                <RideRequests />
              </div>
            )}
            <li className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={handleLogout}>Log Out</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

// Step 1: Vehicle and Location Form
const VehicleAndLocationForm = ({ vehicle, setVehicle, seats, setSeats, rideForm, goToNextStep }) => {
  const { rideDetails, errors, handleInputChange, handleHelmetChange } = rideForm;
  
  return (
    <>
      <label className="text-black block text-sm font-medium mb-1">Select Vehicle</label>
      <select
        className="w-full p-2 border rounded mb-4 text-black"
        value={vehicle}
        onChange={(e) => setVehicle(e.target.value)}
        required
      >
        <option value="Car">Car</option>
        <option value="Bike">Bike</option>
      </select>
      
      {vehicle === "Bike" && (
        <div className="text-black mb-4">
          <label className="block text-sm font-medium mb-1">Does the ridee need a helmet?</label>
          <input
            type="checkbox"
            name="helmetRequired"
            className="mr-2"
            checked={rideDetails.helmetRequired}
            onChange={handleHelmetChange}
            required
          />
          <span className="text-black">Yes</span>
        </div>
      )}
      {errors.helmetRequired && <p className="text-red-500 text-sm">{errors.helmetRequired}</p>}

      {vehicle === "Car" && (
        <div className="text-black mb-4">
          <label className="block text-sm font-medium mb-1">Seats Available</label>
          <select
            className="w-full p-2 border rounded"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
          >
            {[1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      )}

      {['startLocation', 'endLocation'].map((field) => (
        <div key={field}>
          <label className="text-black block text-sm font-medium mb-1">
            {field === "startLocation" ? "Origin" : "Destination"}
          </label>
          <div className="text-black flex items-center border rounded p-2 mb-4">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <input
              type="text"
              name={field}
              placeholder={`Enter ${field.replace("Location", " location")}`}
              className="w-full outline-none"
              onChange={handleInputChange}
              value={rideDetails[field]}
              required
            />
          </div>
          {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
        </div>
      ))}

      <button
        onClick={goToNextStep}
        style={{ backgroundColor: "black", color: "white" }}
        className="w-full py-2 rounded-md hover:bg-gray-800"
        disabled={!rideDetails.startLocation || !rideDetails.endLocation || !vehicle}
      >
        Next
      </button>
    </>
  );
};

// Step 2: Payment and Details Form
const PaymentAndDetailsForm = ({ rideForm, goToPrevStep, submitForm }) => {
  const { rideDetails, errors, handleInputChange } = rideForm;
  
  return (
    <>
      <label className="text-black block text-sm font-medium mb-1">Enter Price</label>
      <input
        type="number"
        name="price"
        placeholder="Enter ride price(In Rupees)"
        className="w-full p-2 border rounded mb-4 text-black"
        onChange={handleInputChange}
        value={rideDetails.price}
        required
      />
      {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

      <label className="text-black block text-sm font-medium mb-1">Registration Number</label>
      <input
        type="text"
        name="registrationNumber"
        placeholder="Enter registration number"
        className="w-full p-2 border rounded mb-4 text-black"
        onChange={handleInputChange}
        value={rideDetails.registrationNumber}
        required
      />
      {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber}</p>}

      <label className="text-black block text-sm font-medium mb-1">Driving License Number</label>
      <input
        type="text"
        name="drivingLicenseNumber"
        placeholder="Enter driving license number"
        className="w-full p-2 border rounded mb-4 text-black"
        onChange={handleInputChange}
        value={rideDetails.drivingLicenseNumber}
        required
      />
      {errors.drivingLicenseNumber && <p className="text-red-500 text-sm">{errors.drivingLicenseNumber}</p>}

      <label className="text-black block text-sm font-medium mb-1">Driving License Holder's Name</label>
      <input
        type="text"
        name="drivingLicenseName"
        placeholder="Enter driving license holder's name"
        className="w-full p-2 border rounded mb-4 text-black"
        onChange={handleInputChange}
        value={rideDetails.drivingLicenseName}
        required
      />
      {errors.drivingLicenseName && <p className="text-red-500 text-sm">{errors.drivingLicenseName}</p>}

      <div className="flex justify-between">
        <button
          onClick={goToPrevStep}
          style={{ backgroundColor: "black", color: "white" }}
          className="w-1/2 py-2 rounded-md hover:bg-gray-700 mr-2"
        >
          Back
        </button>

        <button
          onClick={submitForm}
          style={{ backgroundColor: "black", color: "white" }}
          className="w-1/2 py-2 rounded-md hover:bg-gray-800"
        >
          Publish
        </button>
      </div>
    </>
  );
};

// Success Message Component
const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FaRegGrinStars size={30} className="mr-3 text-green-600" />
            <strong>{message}</strong>
          </div>
          <button
            onClick={onClose}
            style={{ backgroundColor: "transparent" }}
            className="text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        <p className="text-center text-black">Celebrate! Your ride is live now 🎉</p>
      </div>
    </div>
  );
};

// Features Section Component
const FeatureSection = () => {
  return (
    <>
      <div className="pt-2 w-full text-center text-3xl font-serif semibold text-gray-700 mt-4">
        Ride. Connect. Save.
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center mt-8 px-4">
        <div className="bg-white shadow-lg p-6 rounded-lg w-full md:w-1/3 transform transition-all duration-300 hover:translate-y-[-10px]">
          <h3 className="text-xl font-semibold text-gray-800">Ride.</h3>
          <p className="text-gray-600">Travel comfortably with trusted companions.</p>
          <p className="text-gray-600">Safe, reliable, and hassle-free rides every time.</p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg w-full md:w-1/3 transform transition-all duration-300 hover:translate-y-[-10px]">
          <h3 className="text-xl font-semibold text-gray-800">Connect.</h3>
          <p className="text-gray-600">Meet new people and share amazing travel experiences.</p>
          <p className="text-gray-600">Build a community while reaching your destination.</p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg w-full md:w-1/3 transform transition-all duration-300 hover:translate-y-[-10px]">
          <h3 className="text-xl font-semibold text-gray-800">Save.</h3>
          <p className="text-gray-600">Reduce travel costs by splitting expenses.</p>
          <p className="text-gray-600">Save fuel, reduce carbon footprint, and go green.</p>
        </div>
      </div>
    </>
  );
};

// Main Rider Component
export default function Rider() {
  // State management
  const [vehicle, setVehicle] = useState("Car");
  const [seats, setSeats] = useState(1);
  const [step, setStep] = useState(1);
  const [isRideRequestVisible, setIsRideRequestVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Dropdown ref for click outside handling
  const dropdownRef = useRef(null);
  
  // Custom form hook
  const rideForm = useRideForm();
  
  // Event handlers
  const toggleRideRequests = () => {
    setIsRideRequestVisible(!isRideRequestVisible);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleSubmit = async () => {
    const success = await rideForm.submitRide(vehicle, seats);
    if (success) {
      setStep(3);
    }
  };
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <Navbar
        toggleDropdown={toggleDropdown}
        isDropdownOpen={isDropdownOpen}
        dropdownRef={dropdownRef}
        toggleRideRequests={toggleRideRequests}
        isRideRequestVisible={isRideRequestVisible}
      />

      {/* Ride Booking Section */}
      <nav className="pl-25 bg-white w-full py-6 px-6 flex justify-between items-center text-white shadow-md">
        <div className="w-1/2 flex flex-col items-start">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            {step === 1 ? (
              <VehicleAndLocationForm
                vehicle={vehicle}
                setVehicle={setVehicle}
                seats={seats}
                setSeats={setSeats}
                rideForm={rideForm}
                goToNextStep={() => setStep(2)}
              />
            ) : (
              <PaymentAndDetailsForm
                rideForm={rideForm}
                goToPrevStep={() => setStep(1)}
                submitForm={handleSubmit}
              />
            )}
          </div>
        </div>

        {/* Illustration */}
        <div className="w-1/2 flex justify-center">
          <img
            src="data:image/jpeg;base64,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"
            alt="People in a car"
            className="w-3/4 max-w-md"
          />
        </div>
      </nav>

      {/* Feature Section */}
      <FeatureSection />
      
      {/* Success Popup */}
      {rideForm.successMessage && (
        <SuccessPopup
          message={rideForm.successMessage}
          onClose={() => rideForm.setSuccessMessage("")}
        />
      )}
    </div>
  );
}