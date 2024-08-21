// components/SlidingDrawer.js
'use client'
import React, { useEffect, useRef, useState } from 'react';
import styles from './SlidingDrawer.module.css';
import FollowersTabs from './followersTab';
import config from '../config';

const FollowersFollowingDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    console.log('token fetched successfully:', storedToken);
  }, []);

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
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`${styles.followDrawer} ${isOpen ? styles.open : ''}`} ref={drawerRef}>
      <div className={styles.content}>
        <div className='flex justify-end'>
          <button className="drawerClose" onClick={onClose}><img src="/images/close.png" width={16} alt="close" /></button>
        </div>
        <FollowersTabs defaultTab="Followers" tabs={['Followers', 'Following']} />


        {userData && (
          <div className="followersDetails">          
            <div className="flex w-full flex-col">
                {/* <p>{userData.firstName}</p> */}
                <FollowersTabs defaultTab="Followers" tabs={['Followers', 'Following']} />
            </div>  
          </div>
        )}
      </div>
      {isOpen && <div className={styles.overlay} />}
    </div>
  );
};

export default FollowersFollowingDrawer;
