import React, { useState, useEffect } from 'react';
import { TiWeatherSunny, TiWeatherCloudy } from 'react-icons/ti';
import { IoRainy } from 'react-icons/io5';
import { RiMistLine } from 'react-icons/ri';
import './WeatherComponent.css'; // Import CSS file for styling

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = 'd6006c413402d2bb1d9e542ee843ca27'; // Replace with your actual API key

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=45.80&lon=15.97&appid=${apiKey}&units=metric`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [apiKey]);

  const filterDailyData = () => {
    if (!weatherData || !weatherData.list) {
      return [];
    }

    const dailyData = {};
    weatherData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // Get date without time
      if (!dailyData[date] || item.dt_txt.includes('12:00:00')) {
        dailyData[date] = item;
      }
    });

    return Object.values(dailyData);
  };

  const renderWeatherIcon = weather => {
    switch (weather) {
      case 'Clear':
        return <TiWeatherSunny className="weather-icon" />;
      case 'Clouds':
        return <TiWeatherCloudy className="weather-icon" />;
      case 'Rain':
        return <IoRainy className="weather-icon" />;
      case 'Mist':
        return <RiMistLine className="weather-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="weather-container">
      <h2>Za današnji te narednih 5 dana</h2>
      <div className="weather-forecast">
        {weatherData && filterDailyData().map(item => (
          <div className="weather-card" key={item.dt}>
            <div className="weather-info">
              <div className="weather-icon">{renderWeatherIcon(item.weather[0].main)}</div>
              <div className="weather-details">
                <div className="date">{item.dt_txt.split(' ')[0]}</div>
                <div className="temperature">{item.main.temp}°C</div>
                <div className="weather-description">{item.weather[0].description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherComponent;
