// SearchPage.js
import React, { useState } from 'react';
import './SearchPage.css';

const SearchPage = ({ subject }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for ${query} in ${subject}`);
  };

  return (
    <div className="search-page">
      <h1>{subject} Search</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${subject}`}
          className="search-input"
        />
        <button type="submit" className="search-btn">Search</button>
      </form>
    </div>
  );
};

export default SearchPage;
