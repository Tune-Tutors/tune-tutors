// NewPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NewPage.css';

const NewPage = () => (
  <div className="new-page">
    <h1>Explore A Subject</h1>
    <div className="button-container">
      <Link to="/search/Math" className="feature-btn">Math</Link>
      <Link to="/search/English" className="feature-btn">English</Link>
      <Link to="/search/History" className="feature-btn">History</Link>
      <Link to="/search/Science" className="feature-btn">Science</Link>
    </div>
  </div>
);

export default NewPage;
