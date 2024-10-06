'use client'
import React, { useEffect, useState } from 'react';
import Link from "next/link";

import Logo from "./logo";
import SearchPage from "./search-page";
import SlidingDrawer from '../components/SlidingDrawer';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import config from '../config';
import SideMenu from './SideMenu'; // Import the new SideMenu component
import {Tooltip, Button} from "@nextui-org/react";

const MobileHeader = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false); // State for the side menu
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleMenu = () => setMenuOpen(!isMenuOpen); // Toggle side menu
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const hideHeaderPaths = ['/']; // Add paths where you want to hide the header

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUserData(data.user);
      console.log('data fetched successfully:', data.user);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Change this to the appropriate route
  };

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

  const handleButtonClick = () => {
    if (!userData) {
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSignInSubmit = () => {
    router.push(`/login`);
  };

  return (
    <>
      <div className="mobileHeaderWrap">
        <div className="mobileBottomBar">
          <div className="secondaryMenuIcons">
            <a href="/">
              <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.7295 12.7949L14.6621 0.736304C14.5752 0.649246 14.472 0.580177 14.3584 0.533052C14.2448 0.485927 14.123 0.46167 14 0.46167C13.877 0.46167 13.7552 0.485927 13.6416 0.533052C13.528 0.580177 13.4248 0.649246 13.3379 0.736304L1.27051 12.7949C0.918945 13.1465 0.719727 13.624 0.719727 14.122C0.719727 15.1562 1.56055 15.997 2.59473 15.997H3.86621V24.6015C3.86621 25.1201 4.28516 25.539 4.80371 25.539H12.125V18.9765H15.4062V25.539H23.1963C23.7148 25.539 24.1338 25.1201 24.1338 24.6015V15.997H25.4053C25.9033 15.997 26.3809 15.8008 26.7324 15.4463C27.4619 14.7138 27.4619 13.5273 26.7295 12.7949Z" fill="black"/>
              </svg>
            </a>

            <a href="/">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.25 20.5C18.8625 20.5 17.75 21.6125 17.75 23C17.75 23.663 18.0134 24.2989 18.4822 24.7678C18.9511 25.2366 19.587 25.5 20.25 25.5C20.913 25.5 21.5489 25.2366 22.0178 24.7678C22.4866 24.2989 22.75 23.663 22.75 23C22.75 22.337 22.4866 21.7011 22.0178 21.2322C21.5489 20.7634 20.913 20.5 20.25 20.5ZM0.25 0.5V3H2.75L7.25 12.4875L5.55 15.55C5.3625 15.9 5.25 16.3125 5.25 16.75C5.25 17.413 5.51339 18.0489 5.98223 18.5178C6.45107 18.9866 7.08696 19.25 7.75 19.25H22.75V16.75H8.275C8.19212 16.75 8.11263 16.7171 8.05403 16.6585C7.99542 16.5999 7.9625 16.5204 7.9625 16.4375C7.9625 16.375 7.975 16.325 8 16.2875L9.125 14.25H18.4375C19.375 14.25 20.2 13.725 20.625 12.9625L25.1 4.875C25.1875 4.675 25.25 4.4625 25.25 4.25C25.25 3.91848 25.1183 3.60054 24.8839 3.36612C24.6495 3.1317 24.3315 3 24 3H5.5125L4.3375 0.5M7.75 20.5C6.3625 20.5 5.25 21.6125 5.25 23C5.25 23.663 5.51339 24.2989 5.98223 24.7678C6.45107 25.2366 7.08696 25.5 7.75 25.5C8.41304 25.5 9.04893 25.2366 9.51777 24.7678C9.98661 24.2989 10.25 23.663 10.25 23C10.25 22.337 9.98661 21.7011 9.51777 21.2322C9.04893 20.7634 8.41304 20.5 7.75 20.5Z" fill="#B3B3B3"/>
              </svg>
            </a>

            <Dropdown>
              <DropdownTrigger>
                <button>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.8375 4.16253C19.7865 2.09815 17.0796 0.814044 14.1833 0.53158C11.287 0.249116 8.38296 0.986 5.97176 2.61519C3.56055 4.24438 1.79332 6.66379 0.974731 9.45629C0.156141 12.2488 0.337495 15.2394 1.48753 17.9125C1.60739 18.161 1.64672 18.4407 1.60003 18.7125L0.500026 24C0.457646 24.2027 0.4663 24.4128 0.52521 24.6114C0.58412 24.8099 0.69144 24.9907 0.837526 25.1375C0.957281 25.2564 1.09987 25.3498 1.25669 25.4121C1.41352 25.4744 1.58133 25.5043 1.75003 25.5H2.00003L7.35003 24.425C7.62194 24.3923 7.89768 24.4311 8.15003 24.5375C10.8232 25.6876 13.8138 25.8689 16.6063 25.0503C19.3988 24.2317 21.8182 22.4645 23.4474 20.0533C25.0766 17.6421 25.8134 14.738 25.531 11.8418C25.2485 8.94548 23.9644 6.23851 21.9 4.18753L21.8375 4.16253ZM8.00003 14.25C7.7528 14.25 7.51112 14.1767 7.30556 14.0394C7.1 13.902 6.93979 13.7068 6.84518 13.4784C6.75057 13.25 6.72581 12.9986 6.77404 12.7562C6.82228 12.5137 6.94133 12.291 7.11614 12.1161C7.29096 11.9413 7.51369 11.8223 7.75616 11.774C7.99864 11.7258 8.24997 11.7506 8.47838 11.8452C8.70679 11.9398 8.90201 12.1 9.03936 12.3056C9.17671 12.5111 9.25003 12.7528 9.25003 13C9.25003 13.3315 9.11833 13.6495 8.88391 13.8839C8.64949 14.1183 8.33155 14.25 8.00003 14.25ZM13 14.25C12.7528 14.25 12.5111 14.1767 12.3056 14.0394C12.1 13.902 11.9398 13.7068 11.8452 13.4784C11.7506 13.25 11.7258 12.9986 11.774 12.7562C11.8223 12.5137 11.9413 12.291 12.1161 12.1161C12.291 11.9413 12.5137 11.8223 12.7562 11.774C12.9986 11.7258 13.25 11.7506 13.4784 11.8452C13.7068 11.9398 13.902 12.1 14.0394 12.3056C14.1767 12.5111 14.25 12.7528 14.25 13C14.25 13.3315 14.1183 13.6495 13.8839 13.8839C13.6495 14.1183 13.3315 14.25 13 14.25ZM18 14.25C17.7528 14.25 17.5111 14.1767 17.3056 14.0394C17.1 13.902 16.9398 13.7068 16.8452 13.4784C16.7506 13.25 16.7258 12.9986 16.774 12.7562C16.8223 12.5137 16.9413 12.291 17.1161 12.1161C17.291 11.9413 17.5137 11.8223 17.7562 11.774C17.9986 11.7258 18.25 11.7506 18.4784 11.8452C18.7068 11.9398 18.902 12.1 19.0394 12.3056C19.1767 12.5111 19.25 12.7528 19.25 13C19.25 13.3315 19.1183 13.6495 18.8839 13.8839C18.6495 14.1183 18.3315 14.25 18 14.25Z" fill="#B3B3B3"/>
                  </svg>
                </button>
              </DropdownTrigger>
              <DropdownMenu className="mobDdropdownWrapper" aria-label="Static Actions">
                <DropdownItem key="new">This feature is not available at the moment.</DropdownItem>
              </DropdownMenu>
            </Dropdown>


            <Dropdown>
              <DropdownTrigger>
                <button>
                  <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.25 21.75V23H0.75V21.75L3.25 19.25V11.75C3.25 7.875 5.7875 4.4625 9.5 3.3625V3C9.5 2.33696 9.76339 1.70107 10.2322 1.23223C10.7011 0.763392 11.337 0.5 12 0.5C12.663 0.5 13.2989 0.763392 13.7678 1.23223C14.2366 1.70107 14.5 2.33696 14.5 3V3.3625C18.2125 4.4625 20.75 7.875 20.75 11.75V19.25L23.25 21.75ZM14.5 24.25C14.5 24.913 14.2366 25.5489 13.7678 26.0178C13.2989 26.4866 12.663 26.75 12 26.75C11.337 26.75 10.7011 26.4866 10.2322 26.0178C9.76339 25.5489 9.5 24.913 9.5 24.25" fill="#B3B3B3"/>
                  </svg>
                </button>
              </DropdownTrigger>
              <DropdownMenu className="mobDropdownWrapper" aria-label="Static Actions">
                <DropdownItem className='dropdownHighlight'>
                  <span className='flex gap-4'>
                    <img src="/images/notification.png" alt="Notification" /> Notifications (0)
                  </span>
                </DropdownItem>
                <DropdownSection showDivider>
                  <DropdownItem className='noNotification'>
                    No new notifications
                    at the moment
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
            {userData && (
              <div className='mobileProfileIcon'>
                <button onClick={openDrawer}><img src={userData.avatar || "/images/default-profile-pic.png"} alt="Profile" /></button>
                <SlidingDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
              </div>
            )}
            {!userData && (
              <div className='mobileProfileIcon'>
                <Tooltip showArrow={true} content="Sign In / Sign Up">
                  <button><Link href="/"><img src="/images/login.png" alt="Profile" /></Link></button>
                </Tooltip>
              </div>
            )}

          </div>
        </div>
        <div className="mainHeader">
          <div className='emptyDiv'></div>
          <div><Logo /></div>
          <div className="hamburgerMenu" onClick={toggleMenu}>☰</div>
          {/* <div className="searchButton">
            <div className="searchIconWrapper"><img src="/images/search.png" alt="Search" /></div>
          </div> */}
          {/* <div>
            <Dropdown>
              <DropdownTrigger>
                <button>
                  <img src="/images/notification.png" alt="Notification" />
                </button>
              </DropdownTrigger>
              <DropdownMenu className="mobDropdownWrapper" aria-label="Static Actions">
                <DropdownItem className='dropdownHighlight'>
                  <span className='flex gap-4'>
                    <img src="/images/notification.png" alt="Notification" /> Notifications (0)
                  </span>
                </DropdownItem>
                <DropdownSection showDivider>
                  <DropdownItem className='noNotification'>
                    No new notifications
                    at the moment
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown> */}

          {/* </div> */}
        </div>
        <div className='mobileSecondDiv'>

        <div className="searchDiv">
                <div className="relative">
                  <div className="search_bar">
                    <img src="/images/search.png" alt="Search" />
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

                {/* <div className="searchIconWrapper">
                  <img src="/images/header/audio-search.svg" alt="Search" />
                </div> */}
              </div>
  
  
          <button className="post-button" onClick={handleButtonClick}>
                {userData ? (
                  <Link href="/create-post" passHref className="flex gap-3 items-center">
                    <span>Generate</span>
                    <img src="/images/header/plus.svg" alt="Post" />
                  </Link>
                ) : (
                  <div className="flex  gap-3 items-center">
                    <span>Generate</span>
                    <img src="/images/header/plus.svg" alt="Post" />
                  </div>
                )}
              </button>

        </div>
      </div>

      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} /> {/* Render the SideMenu */}

      {isModalVisible && (
        <div className="wishlistModal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="wishlistModalContent bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Please Sign In / Sign Up</h2>
            <p className="mb-4">You need to be signed in to create a post.</p>
            <div>
              <button className="btn-primary" onClick={handleSignInSubmit}>Sign In / Sign Up</button>
              <button className="btn-secondary mt-4" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default MobileHeader;
