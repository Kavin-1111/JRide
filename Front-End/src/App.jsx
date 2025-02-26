import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import
import Home from './component/Home';
import Navbar from './component/Navbar';
import Login from './component/Login';
import Signin from './component/Signin';
import CarOrBikeSelection from './component/CarOrBikeSelection';
import Rider from './component/Rider';
import RideeEntry from './component/RideeEntry';
import RiderDetails from './component/RiderDetails';
import Profile from './component/Profile';
import RideProgress from './component/RideProgress';
import Rating from './component/Rating';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signin />} />
        <Route path="/car-or-bike-selection" element={<CarOrBikeSelection />} />
        <Route path="/carpool" element={<Rider />} />
        <Route path="/bike" element={<RideeEntry />} />
        <Route path="/rides" element={<RiderDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rideprogress/:id" element={<RideProgress/>}/>
        <Route path="/feedback/:id" element={<Rating />}/>
      </Routes>
    </Router>
  );
}

export default App;
