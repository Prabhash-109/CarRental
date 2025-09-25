import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CarDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/cars/public/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days * car.rentPrice;
    }
    return 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage('Please login to book a car');
      return;
    }

    if (user.role !== 'USER') {
      setMessage('Only users can book cars');
      return;
    }

    try {
      const totalAmount = calculateTotal();
      await axios.post('http://localhost:8082/api/bookings/user/create', {
        carId: car.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalAmount: totalAmount,
        notes: bookingData.notes
      });

      setMessage('Booking created successfully!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Loading car details...</h2>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Car not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2.5rem',
        alignItems: 'flex-start'
      }}>
        
        {/* Car Image */}
        <div>
          {car.imageUrl ? (
            <img 
              src={car.imageUrl} 
              alt={car.name} 
              style={{ 
                width: '100%', 
                borderRadius: '16px', 
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                objectFit: 'cover' 
              }} 
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '300px', 
              background: '#f5f5f5',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: '#777'
            }}>
              No Image Available
            </div>
          )}
        </div>

        {/* Car Details */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '16px', 
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}>
          <h1 style={{ marginBottom: '0.5rem' }}>{car.name}</h1>
          <h2 style={{ margin: '0 0 1rem', color: '#555', fontWeight: '500' }}>
            {car.brand} {car.model} ({car.year})
          </h2>
          
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            ${car.rentPrice}/day
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
            <li><strong>Fuel Type:</strong> {car.fuelType}</li>
            <li><strong>Transmission:</strong> {car.transmission}</li>
            <li><strong>Mileage:</strong> {car.mileage} km</li>
            <li><strong>Color:</strong> {car.color}</li>
            <li>
              <strong>Status:</strong>{' '}
              <span style={{ 
                color: car.status === 'AVAILABLE' ? 'green' : 
                       car.status === 'RENTED' ? 'red' : 'orange',
                fontWeight: '600'
              }}>
                {car.status}
              </span>
            </li>
          </ul>

          <p style={{ lineHeight: '1.5', marginBottom: '1.5rem', color: '#444' }}>
            {car.description}
          </p>

          {/* Booking Form */}
          {user && user.role === 'USER' && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Book This Car</h3>
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="startDate" style={{ display: 'block', marginBottom: '0.5rem' }}>Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleBookingChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" style={{ display: 'block', marginBottom: '0.5rem' }}>End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleBookingChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" style={{ display: 'block', marginBottom: '0.5rem' }}>Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    rows="3"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                
                {calculateTotal() > 0 && (
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Total Amount: ${calculateTotal()}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-success"
                  style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '10px' }}
                >
                  Book Now
                </button>
              </form>
            </div>
          )}

          {message && (
            <div 
              className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} 
              style={{ marginTop: '1rem' }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
