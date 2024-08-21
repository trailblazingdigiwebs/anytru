'use client';
import React, { useEffect, useState } from 'react';
import ResponsiveHeader from '../components/responsiveHeader';
import BiddingModal from '../components/BiddingModal';
import config from '../config'; // Assuming you have some config for the API base URL

const MyPosts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${config.apiBaseUrl}/product/`, {
      headers: {
        'authorization': `${token}`
      }
    })
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleBiddingButtonClick = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
  };

  const handleAddToBidding = (productId, pricePerProduct, quantity) => {
    const token = localStorage.getItem('token');
    const payload = { pricePerProduct, quantity };

    fetch(`${config.apiBaseUrl}/ads/add/${productId}`, {
      method: 'POST',
      headers: {
        'authorization': `${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Bidding added:', data);
        // Handle success response
      })
      .catch(error => console.error('Error adding to bidding:', error));
  };

  return (
    <div>
      <ResponsiveHeader />
      <div className='pageWrapper'>
        {products.map(product => (
          <div key={product._id} className='productRow'>
            <div className='productImageColumn'>
              <img src={product.imageUrl} alt={product.name} className='productImage' />
            </div>
            <div className='productDetailsColumn'>
              <div><strong>Name:</strong> {product.name}</div>
              <div><strong>Description:</strong> {product.description}</div>
              <div><strong>Total Likes:</strong> {product.totalLikes}</div>
              <div><strong>Category:</strong> {product.category.join(', ')}</div>
              <div><strong>Active:</strong> {product.isActive ? 'Yes' : 'No'}</div>
              <button 
                className='biddingButton' 
                onClick={() => handleBiddingButtonClick(product._id)}
              >
                Add to bidding
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && 
        <BiddingModal 
          productId={selectedProductId} 
          onClose={handleCloseModal} 
          onSubmit={handleAddToBidding} 
        />
      }
    </div>
  );
};

export default MyPosts;
