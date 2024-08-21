// components/Tabs.js
import React, { useState, useEffect } from 'react';
import config from '../config';

const FollowersTabs = ({ defaultTab, tabs }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [userData, setUserData] = useState(null);

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetchUserData(storedToken);
    }
  }, []);

  const fetchUserData = async (token) => {
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
      console.log('User data fetched successfully:', data.user);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  return (
    <div>
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? 'active' : ''}
            onClick={() => handleClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div key={tab} className={tab === activeTab ? 'active' : 'hidden'}>
            {tab === 'Followers' && <FollowersTab userId={userData?._id} />}
            {tab === 'Following' && <FollowingTab userId={userData?._id} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const FollowersTab = ({ userId }) => {
  const [followers, setFollowers] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchFollowersData(userId);
    }
  }, [userId]);

  const fetchFollowersData = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/user/${userId}/followers`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFollowers(data.followers);
      console.log('Followers data fetched successfully:', data.followers);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  if (!followers) {
    return <div>Loading followers...</div>;
  }

  if (followers.length === 0) {
    return <div>No followers yet.</div>;
  }

  return (
    <div>
      <h2>Followers</h2>
      <ul>
        {followers.map((follower) => (
          <li key={follower._id}>{follower.firstName} {follower.lastName}</li>
        ))}
      </ul>
    </div>
  );
};

const FollowingTab = ({ userId }) => {
  const [following, setFollowing] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchFollowingData(userId);
    }
  }, [userId]);

  const fetchFollowingData = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/user/${userId}/following`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFollowing(data.following);
      console.log('Following data fetched successfully:', data.following);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  if (!following) {
    return <div>Loading following...</div>;
  }

  if (following.length === 0) {
    return <div>You are not following anyone yet.</div>;
  }

  return (
    <div>
      <ul>
        {following.map((follow) => (
          <li key={follow._id}>{follow.firstName} {follow.lastName}</li>
        ))}
      </ul>
    </div>
  );
};

export default FollowersTabs;
