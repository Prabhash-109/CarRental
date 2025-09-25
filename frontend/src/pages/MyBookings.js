import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MyBookings = () => {
  const { user, token, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carDetailsById, setCarDetailsById] = useState({});

  useEffect(() => {
    if (!authLoading && user && user.role === 'USER') {
      fetchBookings();
    }
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/bookings/user/my-bookings', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      const bookingList = response.data || [];
      setBookings(bookingList);

      const uniqueCarIds = Array.from(new Set(bookingList.map(b => b.carId).filter(Boolean)));
      if (uniqueCarIds.length > 0) {
        await fetchCarDetails(uniqueCarIds);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarDetails = async (carIds) => {
    try {
      const requests = carIds.map(id =>
        axios.get(`http://localhost:8081/api/cars/public/${id}`)
          .then(res => ({ id, data: res.data }))
          .catch(() => ({ id, data: null }))
      );
      const results = await Promise.all(requests);
      const map = {};
      results.forEach(({ id, data }) => {
        if (data) {
          map[id] = data;
        }
      });
      setCarDetailsById(prev => ({ ...prev, ...map }));
    } catch (e) {
      console.error('Error fetching car details:', e);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://localhost:8082/api/bookings/user/${bookingId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      } catch (error) {
        console.error('Error canceling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  if (!user || user.role !== 'USER') {
    return (
      <div style={styles.centerBox}>
        <h2>🚫 Access Denied</h2>
        <p>You need to be logged in as a user to view bookings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.centerBox}>
        <h2>Loading your bookings...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📌 My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div style={styles.centerBox}>
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {bookings.map(booking => (
            <div key={booking.id} style={styles.card}>
              {carDetailsById[booking.carId]?.imageUrl && (
                <img
                  src={carDetailsById[booking.carId].imageUrl}
                  alt={carDetailsById[booking.carId].name || `Car ${booking.carId}`}
                  style={styles.image}
                />
              )}
              <h3 style={styles.carName}>
                {carDetailsById[booking.carId]?.name || `Booking #${booking.id}`}
              </h3>

              <div style={styles.detailRow}>
                <strong>Start:</strong> {new Date(booking.startDate).toLocaleDateString()}
              </div>
              <div style={styles.detailRow}>
                <strong>End:</strong> {new Date(booking.endDate).toLocaleDateString()}
              </div>
              <div style={styles.detailRow}>
                <strong>Total:</strong> ₹{booking.totalAmount}
              </div>
              <div style={styles.detailRow}>
                <strong>Status:</strong>
                <span style={{
                  ...styles.status,
                  backgroundColor: booking.status === 'CONFIRMED' ? '#28a745' :
                                   booking.status === 'PENDING' ? '#ffc107' : '#dc3545'
                }}>
                  {booking.status}
                </span>
              </div>
              {booking.notes && (
                <div style={styles.detailRow}>
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}
              <div style={styles.detailRow}>
                <strong>Created:</strong> {new Date(booking.createdAt).toLocaleDateString()}
              </div>
              
              {booking.status === 'PENDING' && (
                <button 
                  onClick={() => handleCancelBooking(booking.id)}
                  style={styles.cancelBtn}
                >
                  ❌ Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '2rem auto', padding: '1rem' },
  heading: { textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: '600' },
  centerBox: { textAlign: 'center', padding: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { 
    background: '#fff', 
    borderRadius: '12px', 
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)', 
    padding: '1rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  image: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' },
  carName: { margin: '0.75rem 0', fontSize: '1.3rem', fontWeight: '600', color: '#333' },
  detailRow: { marginBottom: '0.5rem', color: '#555' },
  status: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: '0.85rem', 
    padding: '0.2rem 0.6rem', 
    borderRadius: '6px', 
    marginLeft: '0.5rem'
  },
  cancelBtn: {
    marginTop: '1rem',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background 0.2s ease'
  }
};

export default MyBookings;
