'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import config from '../config';

const UpdateProfile = () => {
  const router = useRouter();
  const [newUserId, setNewUserId] = useState('');
  // const [bio, setBio] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');  
  const [error, setError] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

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
      setNewUserId(data.user.newUserId || '');
      // setPhoneNumber(data.user.phoneNumber || '');
      // setBio(data.user.bio || '');
      console.log('data fetched successfully:', data.user);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const isBioValid = (text) => {
    // Regular expression to detect URLs with common TLDs including country-specific ones
    const urlRegex = /((https?:\/\/)?[^\s]+\.(com|in|co\.in|co|io|ai|net|org|edu|gov|us|uk|ca|au|de|fr|jp|cn|ru|br|za|it|es|nl|se|no|fi|dk|pl|pt|hk|kr|sg|my|tw|vn|th|id|ph|hk|ae|sa|il|gr|cz|at|ch|be|sk|hu|bg|ro|si|hr|lt|lv|ee|lu|cy|mt|is|lt|ua)(\/[^\s]*)?)/gi;
    return !urlRegex.test(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isBioValid(bio)) {
      setError('Bio cannot contain links or URLs.');
      return;
    }

  
    const formData = new FormData();
    formData.append('newUserId', newUserId);
    // formData.append('phoneNumber', phoneNumber);
    // formData.append('bio', bio);
  
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

  return (
    <main className="updateProfileMain flex items-center justify-center">
      <div className="updateProfileBox">
        <div className="updateProfileLogo">
          <img src="/images/logo.png" alt="AnyTru" width="333" height="79" />
        </div>
        <p className="updateProfileText">Please add a personalised Username before continuing</p>

        <div className="updateProfile">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={newUserId}
              required
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder={userData?.userId || 'Enter your user ID'}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            
            {/* <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={userData?.phoneNumber || 'Enter your phone number'}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            /> */}

            {error && <p className="text-red-500">{error}</p>}

            <div className="up-submit">
              <button type="submit">
                <span>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {isSuccessModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Successfully Added Details</h2>
            <button
              className="themeBtn text-white px-4 py-2 rounded-md"
              onClick={handleProceedToHomepage}
            >
              Proceed to Homepage
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default UpdateProfile;
