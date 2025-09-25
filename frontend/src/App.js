import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CarList from './pages/CarList';
import CarDetails from './pages/CarDetails';
import MyBookings from './pages/MyBookings';
import AgentDashboard from './pages/AgentDashboard';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/add-car" element={<AddCar />} />
            <Route path="/agent/edit-car/:id" element={<EditCar />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
