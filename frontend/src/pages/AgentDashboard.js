import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rentedBookings, setRentedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cars');
  const [rentedCarsCount, setRentedCarsCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  useEffect(() => {
    if (user && user.role === 'AGENT') {
      fetchMyCars();
      fetchPendingBookings();
      fetchRentedBookings();
      fetchDashboardStats();
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

  const fetchPendingBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/bookings/agent/pending');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchRentedBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/bookings/agent/rented');
      setRentedBookings(response.data);
    } catch (error) {
      console.error('Error fetching rented bookings:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [rentedResponse, pendingResponse] = await Promise.all([
        axios.get('http://localhost:8082/api/bookings/agent/stats/rented-count'),
        axios.get('http://localhost:8082/api/bookings/agent/stats/pending-count')
      ]);
      setRentedCarsCount(rentedResponse.data);
      setPendingBookingsCount(pendingResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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

  const handleAcceptBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8082/api/bookings/agent/${bookingId}/accept`);
      // Refresh all data to update counts and statuses
      fetchPendingBookings();
      fetchMyCars();
      fetchRentedBookings();
      fetchDashboardStats();
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8082/api/bookings/agent/${bookingId}/reject`);
      fetchPendingBookings();
      fetchDashboardStats();
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8082/api/bookings/agent/${bookingId}/complete`);
      fetchRentedBookings();
      fetchMyCars();
      fetchDashboardStats();
    } catch (error) {
      console.error('Error completing booking:', error);
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
  // Use dynamic rental count instead of car status

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
          <div className="stat-number">{rentedCarsCount}</div>
          <div className="stat-label">Rented</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pendingBookingsCount}</div>
          <div className="stat-label">Pending Bookings</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          My Cars
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Pending Bookings ({pendingBookingsCount})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rented' ? 'active' : ''}`}
          onClick={() => setActiveTab('rented')}
        >
          Rented Cars ({rentedCarsCount})
        </button>
      </div>

      <div className="add-car-btn">
        <Link to="/agent/add-car" className="btn-primary">
          + Add New Car
        </Link>
      </div>

      {activeTab === 'cars' && (
        <>
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
        </>
      )}

      {activeTab === 'bookings' && (
        <>
          <h3 className="section-title">Pending Bookings</h3>
          {bookings.length === 0 ? (
            <div className="empty-box">
              <h3>No pending bookings</h3>
              <p>All caught up! No bookings waiting for your approval.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h4>Booking #{booking.id}</h4>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div className="booking-info">
                      <p><strong>Customer:</strong> {booking.user?.firstName} {booking.user?.lastName}</p>
                      <p><strong>Email:</strong> {booking.user?.email}</p>
                      <p><strong>Car:</strong> {booking.carMake} {booking.carModel} ({booking.carYear})</p>
                      <p><strong>Dates:</strong> {booking.startDate} to {booking.endDate}</p>
                      <p><strong>Total Amount:</strong> ${booking.totalAmount}</p>
                      {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                    </div>
                    <div className="booking-actions">
                      <button 
                        className="btn-success"
                        onClick={() => handleAcceptBooking(booking.id)}
                      >
                        Accept
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleRejectBooking(booking.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'rented' && (
        <>
          <h3 className="section-title">Rented Cars</h3>
          {rentedBookings.length === 0 ? (
            <div className="empty-box">
              <h3>No rented cars</h3>
              <p>No cars are currently rented out.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {rentedBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h4>Rental #{booking.id}</h4>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  {/* Car Image */}
                  {booking.carImageUrl && (
                    <div className="car-image-container" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                      <img 
                        src={booking.carImageUrl} 
                        alt={`${booking.carMake} ${booking.carModel}`}
                        style={{ 
                          width: '60%', 
                          maxHeight: '300px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }} 
                      />
                    </div>
                  )}
                  
                  <div className="booking-details">
                    <div className="booking-info">
                      <p><strong>Customer:</strong> {booking.user?.firstName} {booking.user?.lastName}</p>
                      <p><strong>Email:</strong> {booking.user?.email}</p>
                      <p><strong>Car:</strong> {booking.carMake} {booking.carModel} ({booking.carYear})</p>
                      <p><strong>Rental Period:</strong> {booking.startDate} to {booking.endDate}</p>
                      <p><strong>Total Amount:</strong> ${booking.totalAmount}</p>
                      {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                    </div>
                    <div className="booking-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => handleCompleteBooking(booking.id)}
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AgentDashboard;
