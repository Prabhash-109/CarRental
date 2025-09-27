import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AgentRented = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'AGENT') {
      fetchRented();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRented = async () => {
    try {
      const res = await axios.get('http://localhost:8082/api/bookings/agent/rented');
      setBookings(res.data || []);
    } catch (e) {
      console.error('Failed to fetch rented bookings', e);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'AGENT') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Access Denied</h2>
        <p>You need to be logged in as an agent.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading rented cars...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Rented Cars</h2>
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>No rented bookings yet</h3>
          <p>Accepted bookings will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {bookings.map(b => (
            <div key={b.id} style={{ background: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 6px 16px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Booking #{b.id}</h4>
                <span style={{ background: '#007bff', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: 6, fontSize: 12 }}>{b.status === 'ACCEPTED' ? 'RENTED' : b.status}</span>
              </div>
              
              {/* Car Image */}
              {b.carImageUrl && (
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <img 
                    src={b.carImageUrl} 
                    alt={`${b.carMake} ${b.carModel}`}
                    style={{ 
                      width: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }} 
                  />
                </div>
              )}
              
              <div style={{ marginTop: '0.5rem', color: '#555' }}>
                <p><strong>Customer:</strong> {b.user?.firstName} {b.user?.lastName}</p>
                <p><strong>Email:</strong> {b.user?.email}</p>
                <p><strong>Car:</strong> {b.carMake} {b.carModel} ({b.carYear})</p>
                <p><strong>Dates:</strong> {b.startDate} to {b.endDate}</p>
                <p><strong>Total:</strong> ${b.totalAmount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentRented;
