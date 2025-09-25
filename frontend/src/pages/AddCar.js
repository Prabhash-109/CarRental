import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './AddCar.css'; // new css file

const AddCar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: '',
    brand: '',
    rentPrice: '',
    fuelType: '',
    transmission: '',
    mileage: '',
    color: '',
    description: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'AGENT') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const carData = {
        ...formData,
        year: parseInt(formData.year),
        rentPrice: parseFloat(formData.rentPrice),
        mileage: parseInt(formData.mileage)
      };

      await axios.post('http://localhost:8081/api/cars/agent/add', carData);
      setMessage('Car added successfully!');
      setTimeout(() => {
        navigate('/agent/dashboard');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'AGENT') {
    return null;
  }

  return (
    <div className="addcar-container">
      <div className="addcar-card">
        <h2>Add New Car</h2>
        <form onSubmit={handleSubmit} className="addcar-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Car Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Toyota Camry"
              />
            </div>
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="e.g., Camry"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <select id="brand" name="brand" value={formData.brand} onChange={handleChange} required>
                <option value="">Select Brand</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Audi">Audi</option>
                <option value="Nissan">Nissan</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1990"
                max="2025"
                placeholder="2020"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rentPrice">Rent Price (per day)</label>
              <input
                type="number"
                id="rentPrice"
                name="rentPrice"
                value={formData.rentPrice}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
                placeholder="50.00"
              />
            </div>
            <div className="form-group">
              <label htmlFor="mileage">Mileage (km)</label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
                min="0"
                placeholder="50000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fuelType">Fuel Type</label>
              <select id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleChange} required>
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="transmission">Transmission</label>
              <select id="transmission" name="transmission" value={formData.transmission} onChange={handleChange} required>
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                placeholder="e.g., White, Black, Silver"
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the car features, condition, etc."
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Adding Car...' : 'Add Car'}
          </button>
        </form>

        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCar;
