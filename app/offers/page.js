'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Post from '../components/post';
import ResponsiveHeader from '../components/responsiveHeader';
import config from '../config';
import { timeAgo } from '../utils/timeAgo';
import SplashScreen from '../components/splashscreen';


const OffersList = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id'); // Getting postId from query params
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [offers, setOffers] = useState([]);
  const token = localStorage.getItem('token');
 
  const fetchProduct = async () => {
    if (!postId) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/product/${postId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPost(data.product);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    if (!post) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/product/list?category=${post.category}&isActive=true`);
      const data = await response.json();
      setPosts(data.products);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchOffers = async () => {
    if (!postId) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/product/offers/list/${postId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOffers(data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [postId]);

  useEffect(() => {
    fetchPosts();
  }, [post]);

  useEffect(() => {
    fetchOffers();
  }, [postId]);

  const placeOrder = (id, postId) => {
    router.push(`/checkout?offer=${id}&id=${postId}`);
 };


  if (loading) {
    return <SplashScreen />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <ResponsiveHeader />
      <div className='pageWrapper'>
        <div className="editProfileWrap offerPage align-center">
          <div className='profile-details divOT'>
            <div className='mainProductWrapper productListPage'>
              <Post key={post._id} post={post} />
              <div className='mainProductDescription'>
                <h2>{post.name}</h2>
                <p className='mainProdTitle'>SKU</p>
                <p className='mainProdDesciption'>{post.sku}</p>
                <p className='mainProdTitle'>Description</p>
                <p className='mainProdDesciption'>{post.description}</p>
                <p className='mainProdTitle'>Post Created :</p>
                <p className='mainProdDesciption'>{timeAgo(post.createdAt)} ago</p>
                <p className='mainProdTitle'>Category :</p>
                <p className='mainProdDesciption'>{post.category}</p>
                <p className='mainProdTitle'>Tags :</p>
                <p className='mainProdDesciption'>{post.tags.join(', ')}</p>
              </div>
            </div>
          </div>
          <div className='edit-profile-details divTT'>
            <div className='numOfOffers'>
                <h1>Offers By Vendors</h1>
            </div>
          { offers.length === 0 ? (
            <div className='noPosts'>No vendor offers available at the moment for this product.</div>
                ) : (
            <div className="cartItems">
            {offers.map((offer) => (
                <div key={offer._id} className='cartItem flex gap-8 align-center'>
                    <div className='cartItemImg'>
                    <img src={offer.vendorAvatar} alt="offer vendor" />
                    </div>
                    <div className='cartItemDetails'>
                    <h3>Vendor Id: {offer.vendorId}</h3>
                    <p><strong>Price Per Product:</strong> INR {offer.pricePerProduct}</p>
                    <p><strong>Dispatch Day:</strong> {offer.dispatchDay}</p>
                    <p><strong>Remark:</strong> {offer.remark}</p>
                    <p><strong>Material:</strong> {offer.material}</p>
                    <p><strong>Description:</strong> {offer.description}</p>
                    </div>
                        <button onClick={() => placeOrder(offer._id, postId)} className="PlaceOrderBtn">Place Order</button>
                    <button>
                    <img src="/images/cart-mail.png" alt="Cart email" />
                    </button>
                </div>
                ))}
            </div>      
           )}      
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersList;
