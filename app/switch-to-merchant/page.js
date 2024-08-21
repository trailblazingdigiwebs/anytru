'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResponsiveHeader from '../components/responsiveHeader';
import config from '../config';

const SwitchToMerchantPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brandId: '',
    bankName: '',
    accNumber: '',
    ifsc: '',
    upi: '',
    business: '',
    billingAddress: '',
    officeAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    websiteUrl: '',
    adharNumber: '',
    gstin: null,  
    pan: null, 
  });

  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });  // Store the file object in formData
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithFiles = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithFiles.append(key, value);  // Append all formData fields
      });

      const response = await fetch(`${config.apiBaseUrl}/merchantReq/add`, {
        method: 'POST',
        headers: {
          'authorization': token,  // Use token directly as per your backend setup
        },
        body: formDataWithFiles
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      router.push('/edit-profile'); // Redirect to edit profile page after successful submission
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      // Log error to console for debugging
    }
  };

  return (
    <div>
      <ResponsiveHeader /> 
      <div className="pageWrapper">
        <div className="popup-modal-overlay">
          <div className="popup-modal">
            <h1 className='font-bold text-center'>Switch To Seller Account</h1>
            <div className='merchantFormWrapper'>
              <p className='text-center'>Please share these details to request to switch your profile to a seller account?</p>
              <form className='modalForm' onSubmit={handleSubmit}>
                <input type="text" name="brandId" placeholder="Brand ID" value={formData.brandId} onChange={handleInputChange} />
                <input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleInputChange} />
                <input type="text" name="accNumber" placeholder="Account Number" value={formData.accNumber} onChange={handleInputChange} />
                <input type="text" name="ifsc" placeholder="IFSC Code" value={formData.ifsc} onChange={handleInputChange} />
                <input type="text" name="upi" placeholder="UPI ID" value={formData.upi} onChange={handleInputChange} />
                <input type="text" name="business" placeholder="About Vendor" value={formData.business} onChange={handleInputChange} />
                <input type="text" name="billingAddress" placeholder="Billing Address" value={formData.billingAddress} onChange={handleInputChange} />
                <input type="text" name="officeAddress" placeholder="Office Address" value={formData.officeAddress} onChange={handleInputChange} />
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} />
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} />
                <input type="text" name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleInputChange} />
                <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} />

                {/* File upload inputs for GST and PAN */}
                <label htmlFor="gstin">Upload GST File:</label>
                <input type="file" id="gstin" name="gstin" onChange={handleFileChange} />

                <label htmlFor="pan">Upload PAN File:</label>
                <input type="file" id="pan" name="pan" onChange={handleFileChange} />

                <input type="text" name="websiteUrl" placeholder="Website URL" value={formData.websiteUrl} onChange={handleInputChange} />
                <input type="text" name="adharNumber" placeholder="Aadhar Number" value={formData.adharNumber} onChange={handleInputChange} />
                <div className="popup-modal-actions">
                  <button type="submit">Send Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchToMerchantPage;
