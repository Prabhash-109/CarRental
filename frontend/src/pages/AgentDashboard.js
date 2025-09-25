import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './AgentDashboard.css'; // custom styles

const AgentDashboard = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'AGENT') {
      fetchMyCars();
    }
  }, [user]);

  const fetchMyCars = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/cars/agent/my-cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await axios.delete(`http://localhost:8081/api/cars/agent/${carId}`);
        setCars(cars.filter(car => car.id !== carId));
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const handleStatusChange = async (carId, newStatus) => {
    try {
      await axios.put(`http://localhost:8081/api/cars/admin/${carId}/status?status=${newStatus}`);
      setCars(cars.map(car =>
        car.id === carId ? { ...car, status: newStatus } : car
      ));
    } catch (error) {
      console.error('Error updating car status:', error);
    }
  };

  if (!user || user.role !== 'AGENT') {
    return (
      <div className="agent-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need to be logged in as an agent to access this dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="agent-container">
        <div className="loading-box">
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  const availableCars = cars.filter(car => car.status === 'AVAILABLE').length;
  const rentedCars = cars.filter(car => car.status === 'RENTED').length;
  const maintenanceCars = cars.filter(car => car.status === 'MAINTENANCE').length;

  return (
    <div className="agent-container">
      <h2 className="dashboard-title">Agent Dashboard</h2>
      <p className="welcome-text">Welcome, {user.firstName}! Manage your car listings here.</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{cars.length}</div>
          <div className="stat-label">Total Cars</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{availableCars}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{rentedCars}</div>
          <div className="stat-label">Rented</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{maintenanceCars}</div>
          <div className="stat-label">Maintenance</div>
        </div>
      </div>

      <div className="add-car-btn">
        <Link to="/agent/add-car" className="btn-primary">
          + Add New Car
        </Link>
      </div>

      <h3 className="section-title">My Cars</h3>

      {cars.length === 0 ? (
        <div className="empty-box">
          <h3>No cars found</h3>
          <p>Start by adding your first car listing.</p>
        </div>
      ) : (
        <div className="car-grid">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              {car.imageUrl && <img src={car.imageUrl} alt={car.name} className="car-img" />}
              <div className="car-card-body">
                <h3 className="car-card-title">{car.name}</h3>
                <p><strong>{car.brand} {car.model}</strong> ({car.year})</p>
                <p>{car.fuelType} • {car.transmission} • {car.mileage} km</p>
                <p>{car.color}</p>
                <p className="car-desc">{car.description}</p>

                <div className="car-meta">
                  <span className="car-price">${car.rentPrice}/day</span>
                  <span className={`status-badge ${car.status.toLowerCase()}`}>
                    {car.status}
                  </span>
                </div>

                <div className="car-actions">
                  <Link to={`/agent/edit-car/${car.id}`} className="btn-outline">Edit</Link>
                  <button onClick={() => handleDeleteCar(car.id)} className="btn-danger">Delete</button>

                  <select
                    value={car.status}
                    onChange={(e) => handleStatusChange(car.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RENTED">Rented</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
