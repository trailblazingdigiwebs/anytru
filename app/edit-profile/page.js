'use client'
import React, { useEffect, useState } from 'react';
import ResponsiveHeader from '../components/responsiveHeader';
import FollowersFollowingDrawer from '../components/followers-following';
import config from '../config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const EditProfile = () => {
  const router = useRouter();
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');  
  const [countryCode, setCountryCode] = useState('in');
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
  
  const isBioValid = (text) => {
    // Regular expression to detect URLs with common TLDs including country-specific ones
    const urlRegex = /((https?:\/\/)?[^\s]+\.(com|in|co\.in|co|io|ai|net|org|edu|gov|us|uk|ca|au|de|fr|jp|cn|ru|br|za|it|es|nl|se|no|fi|dk|pl|pt|hk|kr|sg|my|tw|vn|th|id|ph|hk|ae|sa|il|gr|cz|at|ch|be|sk|hu|bg|ro|si|hr|lt|lv|ee|lu|cy|mt|is|lt|ua)(\/[^\s]*)?)/gi;
    return !urlRegex.test(text);
  };

  const handlePhoneNumberChange = (value, country, e, formattedValue) => {
    const digitOnlyNumber = value.replace(/[^0-9]/g, '').slice(-10);
    setPhoneNumber(digitOnlyNumber);
    setCountryCode(country.countryCode);
  };
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isBioValid(bio)) {
      setError('Bio cannot contain links or URLs.');
      return;
    }

    if (phoneNumber.length !== 10) {
      setError('Enter a valid Phone number of 10 digits.');
      return;
    }
  
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('newUserId', newUserId);
    formData.append('phoneNumber', `+${countryCode}${phoneNumber}`);
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
    router.push('/homepage');
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
                <div className='bio'>
                  <h3>Account Type</h3>
                  <p>
                    {userData.role === 'USER' ? 'User' 
                    : userData.role === 'MERCHANT' ? 'Seller' 
                    : 'Not Available'}
                  </p>
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
            <form className='editProfile'>
              <div className='flex gap-4'>
                <div className='w-1/2'>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input                 
                    type="text"
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                    placeholder={userData?.firstName || 'Your First Name'}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className='w-1/2'>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input                 
                    type="text"
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                    placeholder={userData?.lastName || 'Your last name'}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700">
              User ID
              </label>
              <input
                type="text"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                placeholder={userData?.userId || 'Enter your user ID'}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <PhoneInput
                country={countryCode}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                inputProps={{
                  name: 'phone',
                  required: true,
                }}
                containerClass="phone-input-container"
                inputClass="phone-input"
                buttonClass="phone-dropdown"
              />

              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={userData?.bio || 'Enter your bio'}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />

              {error && <p className="text-red-500">{error}</p>}

              <div className="up-submit">
                <button onClick={handleSubmit} type="submit">
                  <span>Submit</span>
                </button>
              </div>
            </form>
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

export default EditProfile;
