import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { House, LogIn, User } from 'lucide-react';

const Navbar = () => {
  const [userName, setUserName] = useState(sessionStorage.getItem('userId') || '');
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const navbarBg = isHomePage ? 'bg-' : 'bg-white';
  const textColor = isHomePage ? 'text-gray-800' : 'text-gray-900';

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    setUserName('');
    navigate('/home');
  };

  return (
    <div className={`${navbarBg}`}>
      <nav className="p-4 flex justify-between items-center shadow-lg transition duration-300">
        <div className="flex items-center">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxd1qxTdtZ0f-uAjQeylhy2H8V0DHOquovAcXhJvSis8lAfIEn2SgfWsikfkVzXb-Y1C4&usqp=CAU" 
            alt="Logo" className="h-15 w-20 mr-2 ml-10" 
          />
          <span className={`text-2xl font-bold ml-2 ${textColor}`}>JRide</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/home" className={`flex items-center space-x-2 hover:text-gray-500 ${textColor} transition duration-300`}>
            <House className="w-10 h-8" strokeWidth={2.5} />
            <span className="text-2xl font-bold">Home</span>
          </Link>

          {userName ? (
            <Link to="/profile" className="flex items-center space-x-2 hover:text-gray-500 transition duration-300">
              <User className="w-8 h-8" strokeWidth={2.5} />
              <span className="text-2xl font-bold">Profile</span>
            </Link>
          ) : (
            isHomePage && (
              <Link to="/login" className={`flex items-center space-x-2 hover:text-gray-500 ${textColor} transition duration-300`}>
                <LogIn className="w-10 h-10" strokeWidth={3.5} />
                <span className="text-2xl font-bold">Login</span>
              </Link>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
