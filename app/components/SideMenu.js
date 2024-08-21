'use client';
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import config from '../config';


const SideMenu = ({ isOpen, onClose }) => {
  const router = useRouter();
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

      <div className="relative">
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
              </div>


      <ul>
        <li>
          <Link href="/homepage" className={router.pathname === '/homepage' ? styles.active : ''}>
            All Categories
          </Link>
        </li>
        <li>
          <Link href="/homepage/furniture" className={router.pathname === '/homepage/furniture' ? styles.active : ''}>
            Furniture
          </Link>
        </li>
        <li>
          <Link href="/homepage/home-decor" className={router.pathname === '/homepage/home-decor' ? styles.active : ''}>
            Home Decor
          </Link>
        </li>
        <li>
          <Link href="/homepage/graphics" className={router.pathname === '/homepage/graphics' ? styles.active : ''}>
            Graphics
          </Link>
        </li>
        <li>
          <Link href="/homepage/clothing" className={router.pathname === '/homepage/clothing' ? styles.active : ''}>
            Clothing
          </Link>
        </li>
        <li>
          <Link href="/homepage/accessories" className={router.pathname === '/homepage/accessories' ? styles.active : ''}>
            Accessories
          </Link>
        </li>
        <li>
          <Link href="/homepage/events" className={router.pathname === '/homepage/events' ? styles.active : ''}>
            Events
          </Link>
        </li>
        <li>
          <Link href="/homepage/others" className={router.pathname === '/homepage/others' ? styles.active : ''}>
            Others
          </Link>
        </li> 
      </ul>

      <div className='mt-10 ml-10'>
          <button className="post-button">
                <Link href="/create-post" passHref className="flex items-center">
                  <img src="/images/post-plus.png" alt="Post" />
                  <span>Post</span>
                </Link>
          </button>
      </div>
    </div>
  );
};

export default SideMenu;
