'use client';
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import config from '../config';


const SideMenu = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);


  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await fetch(`${config.apiBaseUrl}/product/list/search?name=${query}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSearchResults(data.products);
        console.log('search-', data.products)
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setShowDropdown(false);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding the dropdown to allow click events on dropdown items
    setTimeout(() => setShowDropdown(false), 100);
  };

  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className={`sideMenu ${isOpen ? 'open' : ''}`}>
      <div className="closeButton" onClick={onClose}>✖</div>

      {/* <div className="relative">
                <div className="search_bar">
                  <input
                    type="text"
                    id="inputId"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onBlur={handleSearchBlur}
                    onFocus={handleSearchFocus}
                    placeholder="What are you looking for today?"
                    className="bg-[transparent] outline-none border-none w-full py-3 pl-2 pr-3"
                  />
                  <div className="searchIconWrapper">
                    <img src="/images/search.png" alt="Search" />
                  </div>
                </div>
                {showDropdown && (
                  <div className="searchDropdown absolute bg-white border border-gray-300 mt-2 w-full z-10">
                    {searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <div key={product._id} className="p-2 hover:bg-gray-200 cursor-pointer">
                          <Link href={`${config.domainUrl}/product-list?id=${product._id}`}>
                            <div className='searchResultProduct'>
                              <p>{product.name}</p>
                              <img src={product.imageUrl} />
                            </div>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="p-2">No results found</div>
                    )}
                  </div>
                )}
              </div> */}


      <ul>
        <li>
          <Link href="/" className={`link ${pathname === '/' ? 'active' : ''}`}>
            All Categories
          </Link>
        </li>
        <li>
                <Link href="/homepage/furniture" className={`link ${pathname === '/homepage/furniture' ? 'active' : ''}`}>
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/homepage/home-decor" className={`link ${pathname === '/homepage/home-decor' ? 'active' : ''}`}>
                  Home Decor
                </Link>
              </li>
              <li>
                <Link href="/homepage/graphics" className={`link ${pathname === '/homepage/graphics' ? 'active' : ''}`}>
                  Graphics
                </Link>
              </li>
              <li>
                <Link href="/homepage/clothing" className={`link ${pathname === '/homepage/clothing' ? 'active' : ''}`}>
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/homepage/accessories" className={`link ${pathname === '/homepage/accessories' ? 'active' : ''}`}>
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/homepage/events" className={`link ${pathname === '/homepage/events' ? 'active' : ''}`}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/homepage/others" className={`link ${pathname === '/homepage/others' ? 'active' : ''}`}>
                  Others
                </Link>
              </li>
        </ul>

      {/* <div className='mt-10 ml-10'>
          <button className="post-button">
                <Link href="/create-post" passHref className="flex items-center">
                  <img src="/images/post-plus.png" alt="Post" />
                  <span>Post</span>
                </Link>
          </button>
      </div> */}
    </div>
  );
};

export default SideMenu;
