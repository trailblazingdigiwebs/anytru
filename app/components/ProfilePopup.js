import React, { useEffect, useState } from 'react';
import './ProfilePopup.css'; // Create a corresponding CSS file for styling
import config from '../config'; // Ensure to import the config for API base URL

const ProfilePopup = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('in');
  const [error, setError] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch(`${config.apiBaseUrl}/user/`, {
            method: 'GET',
            headers: {
              'Authorization': `${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setUser(data.user);
          console.log('Data fetched successfully:', data.user);
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
        }
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, token]);

  if (!isOpen || !user) return null;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Change this to the appropriate route
  };


  const isBioValid = (text) => {
    const urlRegex = /((https?:\/\/)?[^\s]+\.(com|in|co\.in|co|io|ai|net|org|edu|gov|us|uk|ca|au|de|fr|jp|cn|ru|br|za|it|es|nl|se|no|fi|dk|pl|pt|hk|kr|sg|my|tw|vn|th|id|ph|hk|ae|sa|il|gr|cz|at|ch|be|sk|hu|bg|ro|si|hr|lt|lv|ee|lu|cy|mt|is|lt|ua)(\/[^\s]*)?)/gi;
    return !urlRegex.test(text);
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
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const result = await response.json();
      console.log('Details updated successfully:', result.message);
      setIsSuccessModalVisible(true);
    } catch (error) {
      setError('Update failed. Please check your details.');
    }
  };



  return (
    <div className="popup-overlay">
        <div className='profile-close-div'>
            <button className="close-button" onClick={onClose}>
                ✖
            </button>
        </div>

      <div className="popup-container">
        <div className="profile-header">
          <div className="profile-details">
            <div className='user-profile-details'>
              <img src={user.avatar || "/images/default-profile-pic.png"} alt="Profile" className="profile-image" />
              <h2 className='fullname'>{user.firstName} {user.lastName}</h2>
              <p className='username'>@{user.userId}</p>
              <p className='followers'>{user.followers} Followers | {user.following} Following</p>
            </div>
            <h4 className='detailsTitle'>Bio</h4>
            <p className='detailsText'>{user.bio || "Go to edit profile to add bio"}</p>
            <h4 className='detailsTitle'>Account Type</h4>
            <p className='detailsText'>{user.role === 'USER' ? 'User' : user.role === 'MERCHANT' ? 'Seller' : 'Not Available'}</p>
            <h4 className='detailsTitle'>Address</h4>
            <p className='detailsText'>{user.address || "Address not provided"}</p>
          </div>
          <div className='profileButtons'>
            <div className='profileButton'>
              <img src="/images/profile/order.svg" />
              <p>My Orders</p>
            </div>
            <div className='profileButton'>
              <img src="/images/profile/posts.svg" />
              <p>My Posts</p>
            </div>
            <div className='profileButton'>
              <img src="/images/profile/mycart.svg" />
              <p>My Cart</p>
            </div>
            <div className='profileButton'>
              <img src="/images/profile/help.svg" />
              <p>Help</p>
            </div>
            <div className='profileButton'>
              <img src="/images/profile/legal.svg" />
              <p>Legal</p>
            </div>
            <div className='profileButton' onClick={handleSignOut}>
              <img src="/images/profile/logout.svg" />
              <p>Log Out</p>
            </div>
          </div>
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          <h3 className='profileFormTitle'>User Details</h3>
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={user?.firstName || 'Your First Name'}
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={user?.lastName || 'Your Last Name'}
            />
          </div>
          <div className="input-group">
            <label>User ID</label>
            <input
              type="text"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder={user?.userId || 'Enter User ID'}
            />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={user?.phoneNumber || 'Enter Phone Number'}
            />
          </div>
          <div className="input-group">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={user?.bio || 'Enter Bio'}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="saveBtnDiv">
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>

     {isSuccessModalVisible && (
        <div className="success-modal">
          <p>Profile updated successfully!</p>
          <button onClick={() => setIsSuccessModalVisible(false)}>Okay</button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProfilePopup;
