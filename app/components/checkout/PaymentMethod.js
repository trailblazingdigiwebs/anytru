import React from 'react';

const PaymentMethod = () => {
  return (
    <div className="anytru-boxColumn paymentMeathod">
      <h1>Payment Methods Available</h1>
      <form>
        <label>
          {/* <input type="radio" name="paymentMethod" value="Credit or Debit Card" /> */}
          <strong>Razorpay</strong> - Credit / Debit Card, UPI & Net Banking
        </label>
        {/* <label>
          <input type="radio" name="paymentMethod" value="Cash on Delivery" />
          Cash on Delivery/ Pay on Delivery
        </label> */}
      </form>
    </div>
  );
};

export default PaymentMethod;
