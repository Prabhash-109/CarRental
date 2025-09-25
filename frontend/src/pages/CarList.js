import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CarList.css'; // new premium CSS

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/cars/public/available');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const response = await axios.get(`http://localhost:8081/api/cars/public/search?${params}`);
      setCars(response.data);
    } catch (error) {
      console.error('Error searching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ brand: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '' });
    fetchCars();
  };

  if (loading) {
    return (
      <div className="carlist-loading">
        <div className="spinner"></div>
        <p>Fetching premium rides for you...</p>
      </div>
    );
  }

  return (
    <div className="carlist-container">
      <h2 className="page-title">Available Cars</h2>

      {/* Search Filters */}
      <div className="filters-card">
        <h3>Search Filters</h3>
        <div className="filters-row">
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <select id="brand" name="brand" value={filters.brand} onChange={handleFilterChange}>
              <option value="">All Brands</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Audi">Audi</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fuelType">Fuel</label>
            <select id="fuelType" name="fuelType" value={filters.fuelType} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="transmission">Transmission</label>
            <select id="transmission" name="transmission" value={filters.transmission} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
        </div>

        <div className="filters-row">
          <div className="form-group">
            <label htmlFor="minPrice">Min Price</label>
            <input type="number" id="minPrice" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="0" />
          </div>
          <div className="form-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input type="number" id="maxPrice" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="1000" />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSearch} className="btn btn-primary">Search</button>
            <button type="button" onClick={clearFilters} className="btn btn-outline">Clear</button>
          </div>
        </div>
      </div>

      {/* Car Grid */}
      <div className="car-grid">
        {cars.map(car => (
          <div key={car.id} className="car-card">
            {car.imageUrl && <img src={car.imageUrl} alt={car.name} className="car-img" />}
            <div className="car-details">
              <h3>{car.name}</h3>
              <p><strong>{car.brand} {car.model}</strong> ({car.year})</p>
              <p>{car.fuelType} • {car.transmission} • {car.mileage} km</p>
              <p className="car-color">{car.color}</p>
              <p className="car-desc">{car.description}</p>
              <div className="car-footer">
                <span className="car-price">${car.rentPrice}/day</span>
                <Link to={`/cars/${car.id}`} className="btn btn-secondary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cars.length === 0 && (
        <div className="no-results">
          <h3>No cars found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default CarList;
