import React, { useEffect, useState } from 'react';
import config from '../../config';

const ProductDetails = ({ postId, offerId, addressId, deliveryMethod }) => {
  const [product, setProduct] = useState(null);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [checkoutLoading, setCheckoutLoading] = useState(false); // Add checkout loading state
  const [checkoutError, setCheckoutError] = useState(null); // Add checkout error state
  const [checkoutSuccess, setCheckoutSuccess] = useState(false); // Add checkout success state

  const initialQuantity = 1, min = 1, max = 10;
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = () => {
    if (quantity < max) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    // Fetch product details from API
    const fetchProduct = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${config.apiBaseUrl}/product/${postId}`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProduct(data.product);

        // Find the offer that matches the offerId
        const matchedOffer = data.product.offers.find(offer => offer._id === offerId);
        setOffer(matchedOffer);

      } catch (error) {
        console.error('Error fetching product details:', error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchProduct();
  }, [postId, offerId]);

  const handleBuyNow = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    setCheckoutSuccess(false);
    try {
      const token = localStorage.getItem('token');
      console.log( 'productId:', postId,
        'offerId:', offerId,
        'addressId:', addressId,
        'quantity:', quantity,
        'deliverytype', deliveryMethod
        )

      const response = await fetch(`${config.apiBaseUrl}/order/checkoutSingle?deliveryType=${deliveryMethod}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({
          productId: postId,
          offerId: offerId,
          addressId: addressId,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok', error);
      }

      const data = await response.json();
      console.log('Order success:', data);
      setCheckoutSuccess(true);

      //rzp_test_3fSbxV1af8FRWh  - rzp_test_cfXgi2vqOS38cq
      const options = {
        key: "rzp_live_nvJf4U6yTwOxGN", 
        amount: offer.pricePerProduct * quantity,
        currency: data.order.currency,
        name: "AnyTru",
        description: "Bring Your Ideas To Life",
        image: `${config.domainUrl}/images/logo.png`,
        order_id: data.order.id,
        callback_url: "http://localhost:5000/order/verificationPay",
        prefill: {
          name: `${data.orderDoc.user.firstName} ${data.orderDoc.user.lastName}`,
          email: data.orderDoc.user.email,
          contact: data.orderDoc.user.phoneNumber,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#F2682D",
        },
      };
      console.log('amount:', options.amount);
      const razor = new Razorpay(options);
      razor.open();

    } catch (error) {
      console.error('Error during checkout:', error);
      setCheckoutError(error.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case when product or offer is still null
  if (!product || !offer) {
    return <div>Product or offer not found.</div>;
  }

  return (
    <div className="anytru-boxColumn">
      <h1>Product Details</h1>
      <div className='checkoutProduct'>
        <div className='flex gap-3 items-center'>
          <div>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
          </div>
          <div>
            <h2>{product.name}</h2>
            <p>by {product.user.firstName} {product.user.lastName}</p>
            <p><strong>Price Per Unit :</strong> INR {offer.pricePerProduct}</p>
            <p><strong>Dispatch Time :</strong> {offer.dispatchDay} Days</p>
          </div>
        </div>

        <div className='productSpecs'>
          <h2>Product Specifications</h2>
          <p>Material : {offer.material}</p>
          <p>Colour : --</p> {/* Colour data not available in the API response */}
          <p>Dimensions : --</p> {/* Dimensions data not available in the API response */}
          <p>Bag Capacity : --</p> {/* Bag Capacity data not available in the API response */}
        </div>

        <div className='mt-4'>
          <h4>Item: {product.name}</h4>
          <h4>Delivery: {offer.dispatchDay} Days</h4>
        </div>

        <div className='mt-4'>
          <h2 className='mb-2'>Quantity</h2>
          <button onClick={handleDecrement} className='quantityButton'>
            -
          </button>
          <span className='quantity'><strong>{quantity}</strong></span>
          <button onClick={handleIncrement} className='quantityButton'>
            +
          </button>
        </div>

        <div className='mt-4'>
          <h2>Total Order: INR {offer.pricePerProduct * quantity}</h2>
        </div>
        
        <div className='mt-6'>
          <button onClick={handleBuyNow} disabled={checkoutLoading}>
            {checkoutLoading ? 'Please Wait...' : <strong>Buy Now</strong>}
          </button>
          {checkoutError && <div className="checkoutError checkoutSuccess">Error: {checkoutError}</div>}
          {checkoutSuccess && <div className="checkoutSuccess">Order placed successfully!</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
