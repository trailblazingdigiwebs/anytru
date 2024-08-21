'use client';
import React, { useEffect, useState } from 'react';
import ResponsiveHeader from '../components/responsiveHeader';
import SplashScreen from '../components/splashscreen';
import config from '../config';
import { useRouter } from 'next/navigation';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${config.apiBaseUrl}/wishlist`, {
          method: 'GET',
          headers: {
            'authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('wishlist', result.wishlist);
          setWishlistItems(result.wishlist);
        } else {
          console.error('Failed to fetch wishlist:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false); // Stop loading when fetch is done
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await fetch(`${config.apiBaseUrl}/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const updatedWishlist = wishlistItems.map(item => {
          return {
            ...item,
            product: item.product.filter(product => product._id !== productId)
          };
        }).filter(item => item.product.length > 0);
  
        setWishlistItems(updatedWishlist);
      } else {
        console.error('Failed to remove item:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  
  const handlePostClick = (postId) => {
    router.push(`/product-list?id=${postId}`);
  };

  if (loading) {
    return <SplashScreen />; // Show loading screen while fetching data
  }

  return (
    <div>
      <ResponsiveHeader />
      <div className='pageWrapper'>
        <h1 className='wishlistTitle'>My Wishlist</h1>
        <p className='wishProdCount'>Total Products ({wishlistItems.reduce((acc, item) => acc + item.product.length, 0)})</p>
        <div className="wishlistGrid">
          {wishlistItems.reduce((acc, item) => acc + item.product.length, 0) > 0 ? (
            wishlistItems.map(item => (
              item.product.map(product => (
                <div key={product._id} className="wishlistItem" >
                  <img src={product.imageUrl} className="cursPointer" alt={product.name} onClick={() => handlePostClick(product._id)}/>
                  <p>{product.name}</p>
                  <button onClick={() => handleRemove(product._id)}>Remove</button>
                </div>
              ))
            ))
          ) : (
            <p>No items in wishlist.</p>
          )}
        </div>
      </div>
      <style jsx>{`
        .wishlistGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .wishlistItem {
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 10px;
          text-align: center;
        }
        .wishlistItem img {
          max-width: 100%;
          height: auto;
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
        }
        .wishlistItem p {
          margin: 0;
          font-weight: bold;
        }
        .wishlistItem button {
          margin-top: 10px;
          padding: 5px 10px;
          background-color: #ff0000;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .wishlistGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .wishlistGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Wishlist;
