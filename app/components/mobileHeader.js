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

  const toggleMenu = () => setMenuOpen(!isMenuOpen); // Toggle side menu
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

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

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Change this to the appropriate route
  };

  return (
    <>
      <div className="mobileHeaderWrap">
        <div className="mobileBottomBar">
          <div className="secondaryMenuIcons">
            <a href="/"><img src="/images/account.png" alt="Home" /></a>
            <Dropdown>
              <DropdownTrigger>
                <button>
                  <img src="/images/messages.png" alt="Messages" />
                </button>
              </DropdownTrigger>
              <DropdownMenu className="mobDdropdownWrapper" aria-label="Static Actions">
                <DropdownItem key="new">This feature is not available at the moment.</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <button className="post-button post-mobile">
                <Link href="/create-post" passHref className="flex items-center">
                  <img src="/images/post-plus.png" alt="Post" />
                  {/* <span>Post</span> */}
                </Link>
              </button>

            <Dropdown>
              <DropdownTrigger>
                <button>
                  <img src="/images/settings.png" alt="Settings" />
                </button>
              </DropdownTrigger>
              <DropdownMenu className="mobDropdownWrapper" aria-label="Static Actions">
                <DropdownItem key="new"><Link href="/help">Help</Link></DropdownItem>
                <DropdownItem key="copy"><Link href="https://discord.com/Discord">Discord</Link></DropdownItem>
                <DropdownItem key="edit"><Link href="/help">FAQs</Link></DropdownItem>
                {userData && (
                  <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleSignOut}>
                    Sign Out
                  </DropdownItem>
                )}
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
        <div className="mainHeader">
          <div className="hamburgerMenu" onClick={toggleMenu}>☰</div> {/* Added onClick handler */}
          <div><Logo /></div>
          {/* <div className="searchButton">
            <div className="searchIconWrapper"><img src="/images/search.png" alt="Search" /></div>
          </div> */}
          <div>
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
            </Dropdown>

          </div>
        </div>
      </div>
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} /> {/* Render the SideMenu */}
    </>
  );
};

export default MobileHeader;
