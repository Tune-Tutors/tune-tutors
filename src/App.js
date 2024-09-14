// App.js
import React, { useState } from 'react';
import './App.css'; // Your existing styles
import BackgroundCanvas from './BackgroundCanvas';

function App() {
  return (
    <div className="App">
      <BackgroundCanvas />
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

const Navbar = () => (
  <nav className="navbar">
    <div className="logo">TuneTutors</div>
    <ul className="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#about">About Us</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
);

const Hero = () => {
  const [songTopic, setSongTopic] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Logic for handling the input topic and song generation can go here
    alert(`Creating a song about: ${songTopic}`);
    //Pass on SongTopic to Suno
  };

  return (
    <section className="hero">
      <h1>Revolutionize Your Music Learning</h1>
      <p>Meet MusicAI, the intelligent music tutor that helps you create songs based on any topic.</p>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter a topic to create a song"
          value={songTopic}
          onChange={(e) => setSongTopic(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">Create Song</button>
      </form>
    </section>
  );
};

const Features = () => (
  <section id="features" className="features">
    <h2>Why MusicAI?</h2>
    <div className="feature-list">
      <div className="feature-item">
        <h3>Personalized Learning</h3>
        <p>AI-driven lessons tailored to your skill level and progress.</p>
      </div>
      <div className="feature-item">
        <h3>Instant Feedback</h3>
        <p>Get real-time feedback on your performances and improve faster.</p>
      </div>
      <div className="feature-item">
        <h3>Interactive Exercises</h3>
        <p>Engaging exercises to help you practice and master new techniques.</p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <p>&copy; 2024 TuneTutors | Empowering musicians through AI</p>
    <ul className="footer-links">
      <li><a href="#terms">Terms of Service</a></li>
      <li><a href="#privacy">Privacy Policy</a></li>
    </ul>
  </footer>
);

export default App;
