import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'; // Import useParams
import './App.css';
import NewPage from './NewPage';
import SearchPage from './SearchPage'; // Import the SearchPage component


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-page" element={<NewPage />} />
          <Route path="/search/:subject" element={<SearchPageWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

const SearchPageWrapper = () => {
  const { subject } = useParams();
  return <SearchPage subject={subject} />;
};

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <Features />
    <Footer />
  </>
);

const Navbar = () => (
  <nav className="navbar">
    <div className="logo">TuneTutors</div>
    <ul className="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#about">About Us</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="/math">Math</a></li>
      <li><a href="/english">English</a></li>
      <li><a href="/history">History</a></li>
      <li><a href="/science">Science</a></li>
    </ul>
  </nav>
);

const Hero = () => (
  <section className="hero">
    <h1>Revolutionize Your Learning Through Music</h1>
    <p>Meet MusicAI, the intelligent music tutor that helps you create songs based on any topic.</p>
    <a href="/new-page" className="navigate-btn">Explore Features</a>
  </section>
);

const Features = () => (
  <section id="features" className="features">
    <h2>Why TuneTutors?</h2>
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
    <p>&copy; 2024 TuneTutors | Empowering education through AI</p>
    <ul className="footer-links">
      <li><a href="#terms">Terms of Service</a></li>
      <li><a href="#privacy">Privacy Policy</a></li>
    </ul>
  </footer>
);

const Math = () => <div>Math Content</div>;
const English = () => <div>English Content</div>;
const History = () => <div>History Content</div>;
const Science = () => <div>Science Content</div>;

export default App;
