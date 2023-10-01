import React from 'react';
import './css/HeroSection.css'; // Import the CSS file

const HeroSection = () => (
    <div className="hero" id='home'>
        <img src="dark.jpeg" alt="Delicious pizza" className="hero-image" />
        <div className="hero-content">
            <h1>Welcome to <span>PIZZILA</span></h1>
            <p>Experience the best pizza in town!</p>
        </div>
    </div>
);

export default HeroSection;
