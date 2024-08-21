import React, { useState } from 'react';

const BiddingModal = ({ isOpen, onClose, onSubmit }) => {
  const [pricePerProduct, setPricePerProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ pricePerProduct, quantity });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent"> 
        <h2 className='text-center font-bold'>Please Enter These Details</h2>
        <div>
          <label>Price Per Product:</label>
          <input 
            type="number" 
            value={pricePerProduct} 
            onChange={(e) => setPricePerProduct(e.target.value)} 
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
          />
        </div>
        <div className='modalButtonsDiv'>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BiddingModal;
