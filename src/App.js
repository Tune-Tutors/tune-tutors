// App.js
import React from 'react';
import './App.css'; // You can create your own styles

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

const Navbar = () => (
  <nav className="navbar">
    <div className="logo">MusicAI</div>
    <ul className="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#about">About Us</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
);

const Hero = () => (
  <section className="hero">
    <h1>Revolutionize Your Music Learning</h1>
    <p>Meet MusicAI, the intelligent music tutor that adapts to your unique learning style.</p>
    <button className="cta-btn">Start Learning</button>
  </section>
);

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
    <p>&copy; 2024 MusicAI | Empowering musicians through AI</p>
    <ul className="footer-links">
      <li><a href="#terms">Terms of Service</a></li>
      <li><a href="#privacy">Privacy Policy</a></li>
    </ul>
  </footer>
);

export default App;