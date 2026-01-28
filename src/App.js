import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // States
  const [city, setCity] = useState('Colombo');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // API Key
  const API_KEY = 'ac35a9ced877dfd24a3beaaaf5a23912';
  
  // ========================
  // HELPER FUNCTIONS
  // ========================
  
  // Unix timestamp to time
  const unixToTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Unix timestamp to date
  const unixToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get current date for display
  const getCurrentDate = () => {
    if (weatherData && weatherData.dt) {
      return unixToDate(weatherData.dt);
    }
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Temperature to Celsius
  const tempToC = (temp) => Math.round(temp);
  
  // Weather icons
  const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  
  // ========================
  // FETCH WEATHER FUNCTION
  // ========================
  
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: cityName,
            appid: API_KEY,
            units: 'metric'
          }
        }
      );
      
      console.log('Weather Data:', response.data);
      setWeatherData(response.data);
      setLoading(false);
      
    } catch (err) {
      console.error('Error:', err);
      
      if (err.response && err.response.status === 404) {
        setError(`"${cityName}" city not found. Try another city.`);
      } else if (err.response && err.response.status === 401) {
        setError('API Key issue. Please check configuration.');
      } else if (err.message.includes('Network Error')) {
        setError('Network error. Check your internet connection.');
      } else {
        setError('Could not fetch weather data. Please try again.');
      }
      
      setLoading(false);
    }
  };
  
  // ========================
  // EVENT HANDLERS
  // ========================
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };
  
  // ========================
  // USE EFFECTS
  // ========================
  
  useEffect(() => {
    fetchWeather('Colombo');
  }, []);
  
  // ========================
  // POPULAR CITIES
  // ========================
  
  const popularCities = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara', 'Anuradhapura'];
  
  // ========================
  // RENDER
  // ========================
  
  return (
    <div className="container">
      <header className="header">
        <h1>🌤️ Sri Lanka Weather</h1>
        <p>Real-time weather forecasts</p>
      </header>
      
      <main className="main">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-btn"
            disabled={loading}
          >
            {loading ? '⏳ Searching...' : '🔍 Search'}
          </button>
        </form>
        
        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        
        {/* Loading State */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        ) : weatherData && (
          /* Weather Display Card */
          <div className="weather-card">
            {/* Location & Date */}
            <div className="location-section">
              <div className="location">
                <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                <p className="date">{getCurrentDate()}</p>
                <p className="update-time">
                  Updated: {unixToTime(weatherData.dt)}
                </p>
              </div>
            </div>
            
            {/* Main Weather Info */}
            <div className="main-weather">
              <div className="temperature-section">
                <div className="weather-icon">
                  {weatherIcons[weatherData.weather[0].icon] || '🌡️'}
                </div>
                <div className="temperature">
                  <h3>{tempToC(weatherData.main.temp)}°C</h3>
                  <p className="feels-like">
                    Feels like: {tempToC(weatherData.main.feels_like)}°C
                  </p>
                </div>
              </div>
              
              <div className="weather-description">
                <h3>{weatherData.weather[0].main}</h3>
                <p>{weatherData.weather[0].description}</p>
              </div>
            </div>
            
            {/* Weather Details Grid */}
            <div className="details-grid">
              <div className="detail-card">
                <div className="detail-icon">💧</div>
                <div className="detail-content">
                  <h4>Humidity</h4>
                  <p className="detail-value">{weatherData.main.humidity}%</p>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">💨</div>
                <div className="detail-content">
                  <h4>Wind Speed</h4>
                  <p className="detail-value">{weatherData.wind.speed} m/s</p>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">📊</div>
                <div className="detail-content">
                  <h4>Pressure</h4>
                  <p className="detail-value">{weatherData.main.pressure} hPa</p>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">👁️</div>
                <div className="detail-content">
                  <h4>Visibility</h4>
                  <p className="detail-value">{(weatherData.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="additional-info">
              <div className="info-section">
                <h4>Temperature Range</h4>
                <div className="temp-range">
                  <div className="temp-min">
                    <span>Min</span>
                    <strong>{tempToC(weatherData.main.temp_min)}°C</strong>
                  </div>
                  <div className="temp-divider"></div>
                  <div className="temp-max">
                    <span>Max</span>
                    <strong>{tempToC(weatherData.main.temp_max)}°C</strong>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h4>Sun Times</h4>
                <div className="sun-times">
                  <div className="sunrise">
                    <span>Sunrise</span>
                    <strong>{unixToTime(weatherData.sys.sunrise)}</strong>
                  </div>
                  <div className="sun-divider"></div>
                  <div className="sunset">
                    <span>Sunset</span>
                    <strong>{unixToTime(weatherData.sys.sunset)}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Weather Summary */}
            <div className="weather-summary">
              <p>
                <strong>Current Conditions:</strong> {weatherData.weather[0].description} with temperature around {tempToC(weatherData.main.temp)}°C. 
                Humidity is {weatherData.main.humidity}% and wind speed is {weatherData.wind.speed} m/s.
              </p>
            </div>
          </div>
        )}
        
        {/* Popular Cities */}
        <div className="popular-cities">
          <h3>🏙️ Quick Select Cities</h3>
          <div className="city-grid">
            {popularCities.map(cityName => (
              <button
                key={cityName}
                onClick={() => {
                  if (!loading) {
                    setCity(cityName);
                    fetchWeather(cityName);
                  }
                }}
                className="city-button"
                disabled={loading}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>Powered by OpenWeatherMap API • Real-time Weather Data</p>
        <small>
          {weatherData ? 
            `Current: ${weatherData.name} ${tempToC(weatherData.main.temp)}°C` : 
            'Loading weather data...'
          }
        </small>
      </footer>
    </div>
  );
}

export default App;