import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, mobileNumber, password, confirmPassword, age, gender } = formData;

    if (!age) {
      toast.error('❌ Age is required', { position: "top-center" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('❌ Passwords do not match!', { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        phone: mobileNumber,
        password,
        age,
        gender,
      });

      if (response.status === 201 || response.data.success) {
        toast.success('✅ User registered successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: { backgroundColor: "green", color: "white" },
        });

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(response.data.message || 'Registration failed.', { position: "top-center" });
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error('Registration failed. Please try again.', { position: "top-center" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">
        <div className="w-3/5 hidden md:block">
          <img
            src="https://img.freepik.com/premium-vector/person-use-autonomous-online-car-sharing-service-man-near-smartphone-screen-with-route-points-location-car-city-map-online-ordering-taxi-rent-auto-group-people-sharing-auto_458444-912.jpg?w=1800"
            alt="Car Sharing"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-full md:w-2/5 p-6">
          <h2 className="text-xl font-semibold text-center mb-4">Create an Account</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <label className="block text-gray-700">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              type="submit"
            >
              Register
            </button>
          </form>

          <ToastContainer />
          <p className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
