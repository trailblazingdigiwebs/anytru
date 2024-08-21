// components/Dropdown.js
'use client'
import { useState } from 'react';

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <a href="#" onClick={toggleDropdown}><img src="/images/notification.png" alt="Notification" /></a>
      {/* <button className="dropdown-toggle" >
        Dropdown Menu
      </button> */}
      {isOpen && (
        <div className="notification-dropdown">
            <div className='notification-title flex'>
                <img src="/images/notification.png" alt="Notification" />
                <h2>Notifications (0)</h2>
            </div>
            <div className='notification-body'>
                <p>No New Notification At The Momement</p>
            </div>
        </div>
      )}
      <style jsx>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown-toggle {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
        }
        .dropdown-menu {
          display: block;
          position: absolute;
          background-color: white;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }
        .dropdown-item {
          padding: 10px 20px;
          display: block;
          text-decoration: none;
          color: black;
        }
        .dropdown-item:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
