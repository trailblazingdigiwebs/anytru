'use client'
import React, { useEffect, useState } from 'react';
import ResponsiveHeader from '../components/responsiveHeader';
import FollowersFollowingDrawer from '../components/followers-following';
import config from '../config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const MyOrders = () => {
  const router = useRouter();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const [isFollowDrawerOpen, setFollowDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState('');

  const [orders, setOrders] = useState([]);

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

  useEffect(() => {
    if (userData && token) {
      fetchOrders();
    }
  }, [userData, token]);
  

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/order/user/${userData._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setOrders(data.ordersDoc); // Assuming 'ordersDoc' is the array of orders
      console.log('Orders fetched successfully:', data.ordersDoc);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
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
              </div>
            )}
          </div>
          <div className='edit-profile-details divTT'>
            <div className="cartItems">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className='cartItem flex gap-8 align-center'>
                    <div className='cartItemImg'>
                      <img src={order.product.imageUrl || "/images/No_Image_Available.jpg"} alt="Cart Image" />
                    </div>
                    <div className='cartItemDetails'>
                      <h3>{order.orderId}</h3>
                      <p><strong>Order Value:</strong> {order.currency} {order.totalAmount} </p>
                      <p><strong>QTY</strong>: {order.quantity} </p>
                      <p><strong>Buyer:</strong> {order.vendor.user.userId} </p>
                      <p><strong>Receipt ID:</strong> {order.receipt} </p>
                      <p><strong>Payment Status:</strong> {order.paymentStatus} </p>
                      <p><strong>Order Status:</strong> {order.orderStatus} </p>
                    </div>
                    <div className='orderButtonsDiv'>
                      <div className='orderButtons'>
                        <p>Track Order</p>
                        <button >
                          <img src="/images/trackOrder.png" alt="track order" />
                        </button>
                      </div>
                      <div className='orderButtons'>
                        <p>Vendor Chat</p>
                        <button >
                          <img src="/images/cart-mail.png" alt="Cart email" />
                        </button>
                      </div>
                    {/* <div className='orderButtons'>
                      <p>Cancel Order</p>
                      <button >
                        <img src="/images/cancelOrder.png" alt="Cancel order" />
                      </button>
                    </div> */}
                    </div>
                  </div>
                ))
                )
               : (
                <div className='emptyCartDiv'>
                  <p><strong>You Haven&#39;t Placed Any Order Yet.</strong></p>
                  <img src="/images/empty-cart.png" alt="Empty Cart" />                  
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default MyOrders;
