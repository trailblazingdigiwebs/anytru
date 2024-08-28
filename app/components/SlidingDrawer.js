// components/SlidingDrawer.js
'use client'
import React, { useEffect, useRef, useState } from 'react';
import styles from './SlidingDrawer.module.css';
import FollowersFollowingDrawer from './followers-following';
import Link from 'next/link';
import config from '../config';

const SlidingDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState('');

  const [isFollowDrawerOpen, setFollowDrawerOpen] = useState(false);

  const openFollowDrawer = () => setFollowDrawerOpen(true);
  const closeFollowDrawer = () => setFollowDrawerOpen(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && userData) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', userData._id);  // Include the user ID if necessary

      try {
        const response = await fetch(`${config.apiBaseUrl}/user/${userData._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setUserData(prevState => ({
          ...prevState,
          avatar: data.avatar,  // Update the avatar URL if returned by the server
        }));
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleChangePicClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Change this to the appropriate route
  };

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`} ref={drawerRef}>
      <div className={styles.content}>
        <div className='flex justify-end'>
          <button className="drawerClose" onClick={onClose}><img src="/images/close.png" width={16} alt="close" /></button>
        </div>
        
        <div className='editProfileLink flex justify-end'>
          <button ><Link href="/edit-profile" passHref>Edit Profile</Link></button> 
        </div>

        {userData && (
          <div className="drawerProfileDetails">          
            <div className='profile-pic-div'>
              <img className="profile-pic" src={userData.avatar || "/images/default-profile-pic.png"} alt="Post" />
              <img className="changePicIcon" src="/images/edit-profile-pic.png" alt="Change Icon" onClick={handleChangePicClick} />
              <input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <h2>{userData.firstName} {userData.lastName}</h2>
            <p>
              @ {userData.userId}
            </p>
            <div className='followers flex gap-4'>
              <a onClick={openFollowDrawer} className='clickable flex gap-4'>
                <p>{userData.following} Following </p>
                <p>{userData.followers} Followers</p>
              </a>
              {isFollowDrawerOpen && <FollowersFollowingDrawer isOpen={isFollowDrawerOpen} onClose={closeFollowDrawer} />}
            </div>
            <div className='bio'>
              <h3>Bio</h3>
              <p>{userData.bio || "Go to edit profile to add bio"}</p>
            </div>
            <div className='bio'>
              <h3>Account Type</h3>
              <p>
                {userData.role === 'USER' ? 'User' 
                : userData.role === 'MERCHANT' ? 'Seller' 
                : 'Not Available'}
              </p>
            </div>

            <div className='flex gap-2'>
              <div>
                <button className="editPagebtn text-white px-6 py-2 rounded-md">
                  <Link href="/my-posts">My Posts</Link>
                </button>
              </div>

              <div>
                <button className="editPagebtn text-white px-6 py-2 rounded-md">
                  <Link href="/my-orders">My Orders</Link>
                </button>
              </div>


              <div>
                <button className="editPagebtn text-white px-6 py-2 rounded-md">
                  <Link href="/wishlist">Wishlist</Link>
                </button>
              </div>
            </div>

              <div>
                <button className="editPagebtn text-white px-6 py-2 rounded-md"  onClick={handleSignOut} >
                  Sign Out
                </button>
              </div>
          </div>
        )}
      </div>
      {isOpen && <div className={styles.overlay} />}
    </div>
  );
};

export default SlidingDrawer;
