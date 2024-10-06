'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Logo from "./logo";
import SlidingDrawer from '../components/SlidingDrawer';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import config from '../config';
import { timeAgo } from '../utils/timeAgo';
import {Tooltip, Button} from "@nextui-org/react";
import ProfilePopup from '../components/ProfilePopup';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
    
  const [notifications, setNotifications] = useState([]);

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);


  const hideHeaderPaths = ['/']; // Add paths where you want to hide the header

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState('');


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

  useEffect(() => {
    if (token) {
        fetchNotifications();
    }
}, [token]);

const fetchNotifications = async () => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/notifications/`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const recentNotifications = data.notifications.slice(0, 10); // Get the 10 most recent notifications
        setNotifications(recentNotifications);
        console.log('Notifications fetched successfully:', recentNotifications);
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
      <div className={`header-container ${hideHeaderPaths.includes(router.pathname) ? 'hidden' : ''}`}>
        <div className='header-padding'>
            <div className="mainHeaderRow">
              <Logo />     

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

                <div className="searchIconWrapper">
                  <img src="/images/header/audio-search.svg" alt="Search" />
                </div>
              </div>

              <button className="post-button" onClick={handleButtonClick}>
                {userData ? (
                  <Link href="/create-post" passHref className="flex gap-3 items-center">
                    <span>Generate</span>
                    <img src="/images/header/plus.svg" alt="Post" />
                  </Link>
                ) : (
                  <div className="flex gap-3 items-center">
                    <span>Generate</span>
                    <img src="/images/header/plus.svg" alt="Post" />
                  </div>
                )}
              </button>

              <div className="secondaryMenuIcons">
                <Dropdown>
                  <DropdownTrigger>
                    <button>
                      <img src="/images/header/notification.svg" alt="Notification" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdownWrapper" aria-label="Static Actions">
                    <DropdownItem className='dropdownHighlight'>
                        <span className='flex gap-4'>
                            <img src="/images/header/notification.svg" alt="Notification" />
                            Notifications ({notifications.length})
                        </span>
                    </DropdownItem>
                    <DropdownSection className='notificationWrapper' showDivider>
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <DropdownItem key={notification._id}>
                                    <div className="notification">
                                        <img src={notification.avatar} alt="Avatar" className="avatar" />
                                        <div className="notification-content">
                                            <p>{notification.message}</p>
                                            <p>{timeAgo(notification.timestamp)}</p>
                                        </div>
                                    </div>
                                </DropdownItem>
                            ))
                        ) : (
                            <DropdownItem className='noNotification'>
                                No new notifications at the moment
                            </DropdownItem>
                        )}
                        <DropdownItem className='justify-center'><Link href="/notifications">View All</Link></DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>

                {/* <button><Link href="/messages"><img src="/images/header/message.svg" alt="messages" /></Link></button> */}
                <Dropdown>
                  <DropdownTrigger>
                    <button>
                        <img src="/images/header/message.svg" alt="Messages" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdownWrapper" aria-label="Static Actions">
                    <DropdownItem key="new">This feature is not available at the moment.</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <button>
                      <img src="/images/header/settings.svg" alt="Settings" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdownWrapper" aria-label="Static Actions">
                    <DropdownItem key="new"><Link href="/help">Help</Link></DropdownItem>
                    <DropdownItem key="copy"><Link href="https://discord.com/Discord">Discord</Link></DropdownItem>
                    <DropdownItem key="edit"><Link href="/help">FAQs</Link></DropdownItem>
                    {userData && (
                    <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleSignOut}>
                      Sign Out
                    </DropdownItem> )}
                  </DropdownMenu>
                </Dropdown>

                {userData && (
                <div className='headerProfileIcon'>
                  <button onClick={openDrawer}><img className="headerProfileImg" src={userData.avatar || "/images/default-profile-pic.png"} alt="Profile" /></button>
                  {/* <SlidingDrawer isOpen={isDrawerOpen} onClose={closeDrawer} /> */}
                  <ProfilePopup user={user} isOpen={isDrawerOpen} onClose={closeDrawer} />
                </div>
                )}
                {!userData && (
                  <div className='headerProfileIcon'>
                    <Tooltip showArrow={true} content="Sign In / Sign Up">
                      <button><Link href="/login"><img className="headerProfileImg" src="/images/login.png" alt="Profile" /></Link></button>
                    </Tooltip>
                  </div>
                )}

              </div>

            </div>

            <div className="navMenuLinks">
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
            </div>
        </div>
      </div>

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

export default Header;