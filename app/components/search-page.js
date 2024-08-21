import React, { useState, useEffect } from "react";
import config from '../config';

const SearchPage = ({ searchResults }) => {
  return (
    <>
      <div className="searchContainer">
        <div className="recentSearches">
          <div className="titleRow">
            <h2>Recent Searches</h2>
            <a href="#"><span>Clear</span></a>
          </div>
          <ul>
            <li>Chairs</li>
            <li>Bags</li>
            <li>Jewellery</li>
          </ul>
        </div>

        {searchResults && searchResults.length > 0 ? (
          <div className="searchPageSection">
            <div><h3 className="searchSectionTitle">Search Results</h3></div>
            <div className="Categories">
              {searchResults.map((result, index) => (
                <div key={index} className="singleCategory">
                  <div className="singleCategoryImg">
                    <img src={result.image} alt={result.name} />
                  </div>
                  <div className="singleCategoryName">
                    <p>{result.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="searchPageSection">
            <div><h3 className="searchSectionTitle">Ideas For You</h3></div>
            <div className="Categories">
              {/* Dummy data for illustration */}
              <div className="singleCategory">
                <div className="singleCategoryImg">
                  <img src="/images/searchPage/CrystalBathTubs.png" alt="Crystal Bath Tubs" />
                </div>
                <div className="singleCategoryName">
                  <p>Crystal Bath Tubs</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const MainSearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      fetchSearchResults(value);
    } else {
      setSearchResults([]);
    }
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/product/list/search/${query}`);
      const data = await response.json();
      setSearchResults(data);
      setIsSearchOpen(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchSearchResults(inputValue);
    }
  };

  return (
    <div>
      <div className="search_bar">
        <input
          type="text"
          id="inputId"
          placeholder="What are you looking for today?"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          className="bg-[transparent] outline-none border-none w-full py-3 pl-2 pr-3"
        />
        <div className="searchIconWrapper"><img src="/images/search.png" alt="Search" /></div>
      </div>
      {isSearchOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsSearchOpen(false)}>&times;</span>
            <SearchPage searchResults={searchResults} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSearchBar;
