'use client';
import React, { useState, useEffect } from 'react';
import Post from './components/post';
import ResponsiveHeader from './components/responsiveHeader';
import config from './config';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Link from "next/link";
import FilterPopup from './components/filterPopup';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('Recent'); // Track the current filter state
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortDispatchDay, setSortDispatchDay] = useState(null)

  // Fetch posts based on the current filter
  const fetchPosts = async (filterType) => {
    if (filterType === 'Store') {
      setPosts([]); // Do nothing for "Store" and show a message
      return;
    }

    let apiUrl = `${config.apiBaseUrl}/product/list?isActive=true`;

    // Update the API URL to include selected categories if any
    if (selectedCategories.length > 0) {
      const categoriesParam = selectedCategories.map((cat) => `category=${encodeURIComponent(cat)}`).join('&');
      apiUrl += `&${categoriesParam}`;
    }

    // Include dispatch sorting if selected
    if (sortDispatchDay) {
      apiUrl += `&sortDispatchDay=${sortDispatchDay}`;
    }

    if (filterType === 'Following') {
      apiUrl += '&following=true';
    }

    const token = localStorage.getItem('token');
    const headers = token
      ? {
          'authorization': `${token}`,
          'Content-Type': 'application/json',
        }
      : {};

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      // Apply additional filtering if "Rack" is selected
      if (filterType === 'Rack') {
        const filteredPosts = data.products.filter((post) => post.isOffers === true);
        setPosts(filteredPosts);
      } else {
        setPosts(data.products);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Fetch posts on initial render and whenever the filter state changes
  useEffect(() => {
    fetchPosts(filter);
  }, [filter, selectedCategories, sortDispatchDay]);

  return (
    <div>
      <ResponsiveHeader />
      <main>
        <div className='filters'>
          <div className='left-filters'>
            <button
              className={`${filter === 'Recent' ? 'active-filter' : 'inactive-filter'}`}
              onClick={() => setFilter('Recent')}
            >
              <span>Recent</span>
            </button>
            <button
              className={`${filter === 'Following' ? 'active-filter' : 'inactive-filter'}`}
              onClick={() => setFilter('Following')}
            >
              <span>Following</span>
            </button>
            <button
              className={`${filter === 'Rack' ? 'active-filter' : 'inactive-filter'}`}
              onClick={() => setFilter('Rack')}
            >
              <span>Rack</span>
            </button>
            <button
              className={`${filter === 'Store' ? 'active-filter' : 'inactive-filter'}`}
              onClick={() => setFilter('Store')}
            >
              <span>Store</span>
            </button>
          </div>

          <div className='right-filters'>
            <button onClick={() => setIsFilterPopupOpen(true)} className="flex items-center hideOnMobile">
              <span>Filters</span>
              <img src="/images/header/filters.svg" alt="Filters" />
            </button>

            <button onClick={() => setIsFilterPopupOpen(true)} className="flex items-center hideOnDesktop">
              <img src="/images/header/filters.svg" alt="Filters" />
            </button>
          </div>
        </div>

        {isFilterPopupOpen && (
          <FilterPopup 
            onClose={() => setIsFilterPopupOpen(false)} 
            onApplyFilters={(categories) => {
              setSelectedCategories(categories);
              setIsFilterPopupOpen(false);
            }} 
          />
        )}

        {/* Conditional rendering for "No posts" messages */}
        {filter === 'Rack' && posts.length === 0 ? (
          <div className='no-posts-message'>
            <h2>Right now, no product has an offer from any vendor</h2>
          </div>
        ) : filter === 'Following' && posts.length === 0 ? (
          <div className='no-posts-message'>
            <h2>No posts available from any of your followers</h2>
          </div>
        ) : filter === 'Store' ? (
          <div className='no-posts-message'>
            <h2>No product has been delivered till now</h2>
          </div>
        ) : selectedCategories.length > 0 && posts.length === 0 ? (
          <div className='no-posts-message'>
            <h2>No posts available for the applied filters</h2>
          </div>
        ) :  (
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 4, 1400: 4 }}>
          <Masonry className='postsGrid'>
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
        )}
      </main>
    </div>
  );
}
