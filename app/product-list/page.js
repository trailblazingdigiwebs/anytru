'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Post from '../components/post';
import ResponsiveHeader from '../components/responsiveHeader';
import config from '../config';
import { timeAgo } from '../utils/timeAgo';
import SplashScreen from '../components/splashscreen';
import SimilarPost from '../components/similarPost';
import BiddingModal from '../components/BiddingModal';

const ProductList = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id'); // Getting postId from query params

  const [post, setPost] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBidAdded, setIsBidAdded] = useState(false);
  const [offers, setOffers] = useState([]);
  const router = useRouter();


  useEffect(() => {
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

    fetchProduct();
  }, [postId]);

  useEffect(() => {
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

    fetchPosts();
  }, [post]);

  const fetchOffers = async () => {
    const token = localStorage.getItem('token');
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
    fetchOffers();
  }, [postId]);


  const handleAddBid = async (bidDetails) => {
    console.log('postId', postId)
    const token = localStorage.getItem('token');
    if (!postId) return{
      throw: new Error('Invalid Post Id')
    };
    console.log('postId', postId)
    try {
      const response = await fetch(`${config.apiBaseUrl}/ads/add/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bidDetails),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Bid added successfully:', data);

      setIsBidAdded(true);
      setTimeout(() => setIsBidAdded(false), 8000);
    } catch (error) {
      console.error('Error adding bid:', error);
    }
  };

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
      <div className='pageWrapperTwo'>
        <div className="productListWrap">
          <div className='mainProduct divOF'>
            <div className='mainProductWrapper productListPage'>
              <Post key={post._id} post={post} />

              <div className='mainProductDescription'>
                <h2>{post.name}</h2>

                <p className='mainProdTitle'>Category :</p>
                <p className='mainProdDesciption'>{post.category}</p>

                <p className='mainProdTitle'>Post Created :</p>
                <p className='mainProdDesciption'>{timeAgo(post.createdAt)} ago</p>

                {/* <p className='mainProdTitle'>SKU</p>
                <p className='mainProdDesciption'>{post.sku}</p> */}

                <p className='mainProdTitle'>Description</p>
                <p className='mainProdDesciption'>{post.description}</p>

                <p className='mainProdTitle'>Tags :</p>
                <p className='mainProdDesciption'>{post.tags.join(', ')}</p>
              </div>
              {/* <div className='create-post-button'>
                <button 
                  type="button" 
                  className="post-button add-bid"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img src="/images/post-plus.png" alt="Post" />
                  <span>Add To Bid List</span>
                </button>
                {isBidAdded && <div className="success-message">Bid added successfully!</div>}
              </div>                 */}
            </div>
          </div>
          <div className='vendorsList divTF'>
            <div className="vendorCount flex ">
              <p className='vendorNum'>Vendors ({offers.length})</p>
              {/* <p className="flex items-center">Filter <img src="/images/filter.png" /></p> */}
            </div>
            <div className='vendorsListWrapper'>
            { offers.length === 0 ? (
            <div className='noPosts'>No vendor offers available at the moment for this product.</div>
                ) : (
            <div className="cartItems">
              {offers.map((offer) => (
                <div key={offer._id}>
                  <div  className='cartItem flex align-center'>
                      <div className='cartItemImg'>
                      <img src={offer.vendorAvatar} alt="offer vendor" />
                      </div>
                      <div className='cartItemDetails'>
                      <p><strong>Vendor Id:</strong> {offer.vendorId}</p>
                      <p><strong>Price Per Product:</strong> INR {offer.pricePerProduct}</p>
                      <p><strong>Dispatch Day:</strong> {offer.dispatchDay}</p>
                      <p><strong>Remark:</strong> {offer.remark}</p>
                      <p><strong>Material:</strong> {offer.material}</p>
                      <p><strong>Description:</strong> {offer.description}</p>
                      </div>
                          <button onClick={() => placeOrder(offer._id, postId)} className="PlaceOrderBtn">Place Order</button>
                      {/* <button>
                      <img src="/images/cart-mail.png" alt="Cart email" />
                      </button> */}
                    </div>
                    <div>
                      
                    </div>
                  </div>
                  ))}
              </div>      
            )}      
            </div>
          </div>
          <div className='similarProduct divOF'>
            <a href="#"><p className='see'>See Similar</p></a>
            { posts.length === 0 ? (
            <div className='noPosts'>No posts available at the moment in this category.</div>
                ) : (
                    <div className='similarProductPosts'>
                    {posts.map((similarPost) => (
                        <SimilarPost key={similarPost._id} post={similarPost} />
                    ))}
                    </div>
            )}
          </div>
        </div>
      </div>
      <BiddingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddBid} 
      />
    </div>
  );
};

export default ProductList;
