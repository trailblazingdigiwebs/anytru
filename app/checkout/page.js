'use client';
import React, { useEffect, useState } from 'react';
import ProductDetails from '../components/checkout/ProductDetails';
import DeliveryAddressForm from '../components/checkout/DeliveryAddressForm';
import PaymentMethod from '../components/checkout/PaymentMethod';
import DeliveryMethods from '../components/checkout/DeliveryMethods';
import ItemsAndDelivery from '../components/checkout/ItemsAndDelivery';
import ResponsiveHeader from '../components/responsiveHeader';
import SplashScreen from '../components/splashscreen';
import config from '../config';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState('Standard'); 

  // Extract `offer` and `id` from query params
  const searchParams = useSearchParams();
  const offerId = searchParams.get('offer');
  const postId = searchParams.get('id');

  const router = useRouter();

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${config.apiBaseUrl}/address/`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`
        }
      });
      const data = await response.json();
      setAddresses(data.addresses);

      if (data.addresses.length > 0) {
        setSelectedAddress(data.addresses[0]._id); // Set default selected address
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch addresses from API
    fetchAddresses();
  }, [postId, offerId]);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleAddAddressClick = () => {
    setShowAddressForm(true);
  };

  const handleAddAddressSuccess = () => {
    setShowAddressForm(false);
    setSuccessMessage('Address added successfully!');
    setLoading(true);
    fetchAddresses(); // Refetch addresses after successful addition
  };

  const closeSuccessMessage = () => {
    setSuccessMessage('');
  };

  return (
    <div>
      <ResponsiveHeader />
      {loading && <SplashScreen />}
      {!loading && (
        <div className='pageWrapper'>
          {successMessage && (
            <div className='successMessage'>
              <p>{successMessage}</p>
              <button onClick={closeSuccessMessage}>Close</button>
            </div>
          )}
          <div className='showFlex'>
            <div className='width-30'>
              <ProductDetails postId={postId} offerId={offerId} addressId={selectedAddress} deliveryMethod={deliveryMethod}/>
              <DeliveryMethods 
                deliveryMethod={deliveryMethod} 
                setDeliveryMethod={setDeliveryMethod} // Track changes to delivery method
              />
            </div>
            <div className='width-50'>
              <div className="anytru-boxColumn">
                <label htmlFor='addressSelect'><h1>Select Address:</h1></label>
                {addresses.length > 0 && (
                  <select
                    id='addressSelect'
                    value={selectedAddress}
                    onChange={handleAddressChange}
                  >
                    {addresses.map(address => (
                      <option key={address._id} value={address._id}>
                        {address.address} - {address.city}, {address.state}
                      </option>
                    ))}
                  </select>
                )}
                {addresses.length < 1 && (
                  <h2>No Saved Address Available, Please Add A Delivery Address</h2>
                )}
                {!showAddressForm && (
                  <div className='flex bottomDiv justify-center'>
                    <button onClick={handleAddAddressClick}>Add New Address</button>
                  </div>
                )}
              </div>
              {showAddressForm && (
                <DeliveryAddressForm onSuccess={handleAddAddressSuccess} setSuccessMessage={setSuccessMessage} />
              )}
              <PaymentMethod />
            </div>
          </div>
          <div>
            <ItemsAndDelivery />
          </div>
        </div>
      )}
      
      <Script src="https://checkout.razorpay.com/v1/checkout.js"/>
    </div>
  );
};

export default CheckoutPage;
