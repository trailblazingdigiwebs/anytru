import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

const DeliveryAddressForm = ({ onSuccess, setSuccessMessage }) => {
  const [formData, setFormData] = useState({
    country: 'India',
    pinCode: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    addressType: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const address = `${formData.area}, ${formData.landmark}`;
    const requestBody = {
      addressType: formData.addressType.charAt(0).toUpperCase() + formData.addressType.slice(1), // Capitalize first letter
      address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pinCode: formData.pinCode,
    };

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${config.apiBaseUrl}/address/add`, requestBody, {
        headers: {
          'authorization': `${token}`
        }
      });
      
      console.log('Response:', response.data);
      setSuccessMessage('Address added successfully!'); 
      onSuccess(); // Call the onSuccess callback
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="anytru-boxColumn">
      <h1>Delivery Address</h1>
      <form onSubmit={handleSubmit}>
        <label>Country/Region</label>
        <input type="text" name="country" value={formData.country} onChange={handleChange} />

        <label>PIN Code</label>
        <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />

        <label>Area, Street, Sector, Village</label>
        <input type="text" name="area" value={formData.area} onChange={handleChange} />

        <label>Landmark</label>
        <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} />

        <label>Town/City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} />

        <label>State</label>
        <input type="text" name="state" value={formData.state} onChange={handleChange} />
        
        <label>Address Type</label>
        <div className="address-type-buttons">
          <label className={`button ${formData.addressType === 'home' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="addressType"
              value="home"
              checked={formData.addressType === 'home'}
              onChange={handleChange}
            />
            Home
          </label>
          <label className={`button ${formData.addressType === 'office' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="addressType"
              value="office"
              checked={formData.addressType === 'office'}
              onChange={handleChange}
            />
            Office
          </label>
          <label className={`button ${formData.addressType === 'hotel' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="addressType"
              value="hotel"
              checked={formData.addressType === 'hotel'}
              onChange={handleChange}
            />
            Hotel
          </label>
          <label className={`button ${formData.addressType === 'other' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="addressType"
              value="other"
              checked={formData.addressType === 'other'}
              onChange={handleChange}
            />
            Other
          </label>
        </div>

        <div className='flex bottomDiv justify-center'>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryAddressForm;
