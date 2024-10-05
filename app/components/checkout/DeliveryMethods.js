const DeliveryMethods = ({ deliveryMethod, setDeliveryMethod }) => {
  const handleMethodChange = (event) => {
    setDeliveryMethod(event.target.value); // Update delivery method
  };

  return (
    <div className="anytru-boxColumn paymentMeathod">
      <h1>Delivery Methods Available</h1>
      <form>
        <label>
          <input 
            type="radio" 
            name="deliveryMethod" 
            value="Standard" 
            checked={deliveryMethod === 'Standard'} 
            onChange={handleMethodChange} 
          />
          <strong>Standard Delivery</strong>
        </label>
        <label>
          <input 
            type="radio" 
            name="deliveryMethod" 
            value="Expedite" 
            checked={deliveryMethod === 'Expedite'} 
            onChange={handleMethodChange} 
          />
          <strong>Expedite Delivery</strong>
        </label>
      </form>
    </div>
  );
};

export default DeliveryMethods;
