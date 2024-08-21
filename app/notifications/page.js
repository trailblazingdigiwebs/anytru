'use client'
import React, { useState, useEffect } from 'react';
import ResponsiveHeader from '../components/responsiveHeader';
import MobileHeader from '../components/mobileHeader';
import config from '../config';
import { timeAgo } from '../utils/timeAgo';

const HomePage = () => {

    const [notifications, setNotifications] = useState([]);
    const [token, setToken] = useState('');


    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
  
    }, []);

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);
    

    const fetchNotifications = async () => {
        try {
            const response = await fetch('${config.apiBaseUrl}/notifications/', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                }
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setNotifications(data.notifications);
            console.log('Notifications fetched successfully:', data.notifications);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };
    

    return (
        <>
            <ResponsiveHeader />
            <div className='pageWrapper'>
            <div className='notificationWrapper' showDivider>
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div key={notification._id}>
                                    <div className="notification">
                                        <img src={notification.avatar} alt="Avatar" className="avatar" />
                                        <div className="notification-content">
                                            <p>{notification.message}</p>
                                            <p>{timeAgo(notification.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='noNotification'>
                                No new notifications at the moment
                            </div>
                        )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
