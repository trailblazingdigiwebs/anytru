'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import Logo from "./logo";
import SlidingDrawer from '../components/SlidingDrawer';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import config from '../config';
import { timeAgo } from '../utils/timeAgo';
import {Tooltip, Button} from "@nextui-org/react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
    
  const [notifications, setNotifications] = useState([]);

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

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


  return (
    <>
      <div className={`header-container ${hideHeaderPaths.includes(router.pathname) ? 'hidden' : ''}`}>
            <div className="mainHeaderRow">
              <Logo />     

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


              <button className="post-button">
                <Link href="/create-post" passHref className="flex items-center">
                  <img src="/images/post-plus.png" alt="Post" />
                  <span>Post</span>
                </Link>
              </button>

              <div className="secondaryMenuIcons">
                <a href="/homepage"><img src="/images/account.png" alt="Home" /></a>

                <Dropdown>
                  <DropdownTrigger>
                    <button>
                      <img src="/images/notification.png" alt="Notification" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdownWrapper" aria-label="Static Actions">
                    <DropdownItem className='dropdownHighlight'>
                        <span className='flex gap-4'>
                            <img src="/images/notification.png" alt="Notification" />
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

                <Dropdown>
                  <DropdownTrigger>
                    <button>
                        <img src="/images/messages.png" alt="Messages" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdownWrapper" aria-label="Static Actions">
                    <DropdownItem key="new">This feature is not available at the moment.</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <button>
                      <img src="/images/settings.png" alt="Settings" />
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
                  <button onClick={openDrawer}><img src={userData.avatar || "/images/default-profile-pic.png"} alt="Profile" /></button>
                  <SlidingDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
                </div>
                )}
                {!userData && (
                  <div className='headerProfileIcon'>
                    <Tooltip showArrow={true} content="Sign In / Sign Up">
                      <button><Link href="/"><img src="/images/login.png" alt="Profile" /></Link></button>
                    </Tooltip>
                  </div>
                )}

              </div>

            </div>

            <div className="navMenuLinks">
              <ul> 
              <li>
                <Link href="/homepage" className={`link ${pathname === '/homepage' ? 'active' : ''}`}>
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
    </>
  );
};

export default Header;