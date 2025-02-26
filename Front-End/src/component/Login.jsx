import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      console.log('🟢 Login Response:', response.data); // Debugging

      if (response.data.message === 'Login successful!') {
        const { userId, token } = response.data;
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('token', token);

        console.log("🔹 Token stored:", sessionStorage.getItem('token'));
        console.log("🔹 UserId stored:", sessionStorage.getItem('userId'));

        // ✅ Show success toast message
        toast.success(" Login successful!", {
          position: "top-center",
          autoClose: 3000, // Keeps toast visible for 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-green-500 text-white font-bold text-lg p-4 rounded-lg shadow-lg"
        });

        // ✅ Navigate to another page **AFTER** showing the toast
        setTimeout(() => {
          navigate('/car-or-bike-selection'); // Change '/dashboard' to your desired route
        }, 3000); // 3-second delay to allow the toast message to be seen

      } else {
        toast.error(response.data.message || 'Invalid email or password.', {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error('🔴 Login Error:', error.response ? error.response.data : error);
      toast.error('Login failed. Please try again.', {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-[800px]">
        {/* Left Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <div className="flex items-center border rounded-lg p-2 w-full">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-3" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="outline-none w-full"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center border rounded-lg p-2 w-full">
                <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="outline-none w-full"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account? <a href="/register" className="text-blue-600">Sign up</a>
          </p>
        </div>
        {/* Right Section */}
        <div className="w-1/2 flex justify-center items-center bg-gray-100">
          <img src="https://thumbs.dreamstime.com/b/man-woman-riding-yellow-motor-scooter-city-couple-moped-flat-style-urban-vehicle-vector-illustration-224240855.jpg" 
               alt="Login" className="w-full h-full object-cover" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
