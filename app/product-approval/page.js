'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Post from '../components/post';
import VendorDetails from '../components/vendorDetail';
import ResponsiveHeader from '../components/responsiveHeader';
import config from '../config';
import { timeAgo } from '../utils/timeAgo';
import SplashScreen from '../components/splashscreen';
import SimilarPost from '../components/similarPost';
import SuccessMessage from '../components/successMessage';

const ProductList = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id'); // Getting postId from query params
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    pricePerProduct: '',
    dispatchDay: '',
    remark: '',
    material: '',
    description: ''
  });
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authorization token found');
      return;
    }

    const requestBody = {
      pricePerProduct: parseFloat(formData.pricePerProduct), // Ensure number format
      dispatchDay: parseInt(formData.dispatchDay, 10),       // Ensure number format
      remark: formData.remark.trim(),
      material: formData.material.trim(),
      description: formData.description.trim()
    };

    console.log('Request Body:', requestBody); // Log the request body

    try {
      const response = await fetch(`${config.apiBaseUrl}/product/vendor/${postId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      console.log('Response:', responseData); // Log the response

      if (!response.ok) {
        throw new Error(`Error: ${responseData.error || 'Something went wrong'}`);
      }

      setSuccessMessage('Project approved successfully!'); // Set success message
    } catch (error) {
      console.error('Error:', error.message); // Log the error message
      setError(error);
    }
  };

  const closeSuccessMessage = () => {
    setSuccessMessage('');
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div>
      <ResponsiveHeader />
      <div className='pageWrapperTwo'>
        <div className="productListWrap">
          <div className='mainProduct divOFtwo'>
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
          <div className='vendorsList divTF'>
            <div className="vendorApprovalForm flex ">
              <div className='approval-form-images'>
                <img src="/images/aproval-image.png" alt="Approval" />
                <img src="/images/aproval-image.png" alt="Approval" />
                <img src="/images/aproval-image.png" alt="Approval" />
                <img src="/images/aproval-image.png" alt="Approval" />
              </div>
              <div className="approval-form">
                <h1>Modern Chair</h1>
                <form onSubmit={handleSubmit}>
                  <label>Price Per Piece For Buyers</label>
                  <input 
                    type="text" 
                    name="pricePerProduct" 
                    value={formData.pricePerProduct} 
                    onChange={handleChange} 
                    placeholder="Mention an average price per item" 
                    required
                  />
                  <label>Materials To Be Used</label>
                  <input 
                    type="text" 
                    name="material" 
                    value={formData.material} 
                    onChange={handleChange} 
                    placeholder="Mention Details on material to be used" 
                    required
                  />
                  <label>Complete Description</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Mention in details, how the final product would look" 
                    required
                  />
                  <label>In How many days can you dispatch / delivery the project to user </label>
                  <input 
                    type="text" 
                    name="dispatchDay" 
                    value={formData.dispatchDay} 
                    onChange={handleChange} 
                    placeholder="Mention Number of days" 
                    required
                  />
                  <label>Other remarks</label>
                  <input 
                    type="text" 
                    name="remark" 
                    value={formData.remark} 
                    onChange={handleChange} 
                    placeholder="" 
                    required
                  />

                  <div className='flex bottomDiv justify-center'>
                    <button type="submit">Approve This Project</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='similarProduct divOFtwo'>
            <a href="#"><p className='see'>More Sellers For Same Project</p></a>
            <div className='noVendorProductDiv'>
              <p className='text-center'>No other vendors available yet.</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <a href="#"><p className='see approvalSimilarDiv'>See Similar Products</p></a>
        { posts.length === 0 ? (
          <div className='noPosts'>No posts available at the moment in this category.</div>
        ) : (
          <div className='similarProductPosts approvalSimilar flex'>
            {posts.map((similarPost) => (
              <SimilarPost key={similarPost._id} post={similarPost} />
            ))}
          </div>
        )}
      </div>
      {successMessage && (
        <SuccessMessage message={successMessage} onClose={closeSuccessMessage} />
      )}
    </div>
  );
};

export default ProductList;
