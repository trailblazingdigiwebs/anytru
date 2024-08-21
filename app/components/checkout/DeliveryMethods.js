import React from 'react';

const DeliveryMethods = () => {
  return (
    <div className="anytru-boxColumn paymentMeathod">
      <h1>Delivery Methods Available</h1>
      <form>
        <label>
          <input type="radio" name="paymentMethod" value="Credit or Debit Card" />
          <strong>Standard Delivery</strong>
        </label>
        <label>
          <input type="radio" name="paymentMethod" value="Cash on Delivery" />
          <strong>Expedite Delivery</strong>
        </label>
      </form>
    </div>
  );
};

export default DeliveryMethods;
