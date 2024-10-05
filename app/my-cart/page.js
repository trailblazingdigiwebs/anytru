'use client'
import React, { useEffect, useState } from 'react';
import ResponsiveHeader from '../components/responsiveHeader';
import FollowersFollowingDrawer from '../components/followers-following';
import config from '../config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const MyCart = () => {
  const router = useRouter();
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');  
  const [error, setError] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const [isFollowDrawerOpen, setFollowDrawerOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
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

  const handleSwitchToMerchant = () => {
    router.push('/switch-to-merchant');
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('newUserId', newUserId);
    formData.append('phoneNumber', phoneNumber);
    formData.append('bio', bio);
  
    try {
      const response = await fetch(`${config.apiBaseUrl}/user/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `${token}`,
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Details Added successfully:', result.message);
      setIsSuccessModalVisible(true);
    } catch (error) {
      setError('Updatation failed. Please check your details.');
    }
  };
  
  const handleProceedToHomepage = () => {
    setIsSuccessModalVisible(false);
    router.push('/');
  };

  const stayHereEditMore = () => {
    setIsSuccessModalVisible(false);
  };


  const openFollowDrawer = () => setFollowDrawerOpen(true);
  const closeFollowDrawer = () => setFollowDrawerOpen(false);

  return (
    <div>
      <ResponsiveHeader />
      <div className='pageWrapper'>
        <div className='editProfileWrap align-center'>
          <div className='profile-details divOT'>
            {userData && (
              <div className="profile-details-wrapper drawerProfileDetails">
                <div className='profile-pic-div'>
                  <img className="profile-pic" src={userData.avatar || "/images/default-profile-pic.png"} alt="Profile" />
                  <img className="changePicIcon ePChpI" src="/images/edit-profile-pic.png" alt="Edit Icon" />
                </div>
                <h2>{userData.firstName} {userData.lastName}</h2>
                <p>@ {userData.userId}</p>
                <div className='followers flex gap-4'>
                  <a onClick={openFollowDrawer} className='clickable flex gap-4'>
                    <p>{userData.following} Following</p>
                    <p>{userData.followers} Followers</p>
                  </a>
                  {isFollowDrawerOpen && <FollowersFollowingDrawer isOpen={isFollowDrawerOpen} onClose={closeFollowDrawer} />}
                </div>
                <div className='bio'>
                  <h3>Bio</h3>
                  <p>{userData.bio || "Go to edit profile to add bio"}</p>
                </div>
                <div>
                  <button className="editPagebtn text-white px-6 py-2 rounded-md">
                    <Link href="/my-posts">My Posts</Link>
                  </button>
                </div>
                {/* <div className="profileDetailDiv">
                  <p className='font-bold'>Switch To Creator Account</p>
                  <p>You can switch to Creator Account once you have achieved 50 likes on 20 posts.</p>
                </div> */}
                <div className="profileDetailDiv">
                  <button className='font-bold' onClick={handleSwitchToMerchant}>Switch To Seller Account</button>
                </div>
              </div>
            )}
          </div>
          <div className='edit-profile-details divTT'>
            <div className="cartItems">
                <div className='cartItem flex gap-8 align-center'>
                    <div className='cartItemImg'><img src="/images/carousel-image-1.png" alt="Cart Image" /></div>
                    <div className='cartItemDetails'>
                        <h3>Metal Rabit</h3>
                        <p><strong>Order Value:</strong> INR 8,000 </p>
                        <p><strong>QTY</strong>: 2 </p>
                        <p><strong>Buyer:</strong> Moris Partner </p>
                    </div>
                    <button className="PlaceOrderBtn">
                        Place Order
                    </button>
                    <button >
                        <img src="/images/cart-mail.png" alt="Cart email" />
                    </button>


                    </div>
                </div>
            </div>
          </div>
        </div>
      {isSuccessModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Successfully Updated Details</h2>
            <div className='flex gap-2'>
              <button
                className="themeBtn text-white px-4 py-2 rounded-md"
                onClick={handleProceedToHomepage}
              >
                Proceed to Homepage
              </button>
              <button
                className="themeBtn text-white px-4 py-2 rounded-md"
                onClick={stayHereEditMore}
              >
                Edit More
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyCart;
