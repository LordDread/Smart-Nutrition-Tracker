import React from 'react';
import './HomePage.css'; // Import the CSS file

function HomePage() {
  return (
    <div className="home-page">
      <h1>Smart Nutrition Tracker</h1>
      <img src={require('./plate.jpg')} alt="Plate" />
    </div>
  );
}

export default HomePage;