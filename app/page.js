'use client'
import React, { useState, useEffect } from 'react';
import Post from './components/post';
import ResponsiveHeader from './components/responsiveHeader';
import config from './config';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";



export default function Home() {
  const [posts, setPosts] = useState([]);
 
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');

      if (token){
        try {
          const response = await fetch(`${config.apiBaseUrl}/product/list?isActive=true`, {
            method: 'GET',
            headers: {
              'authorization': `${token}`,
              'Content-Type': 'application/json'
            }
          });
  
          const data = await response.json();
          setPosts(data.products);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      } else {
        try {
          const response = await fetch(`${config.apiBaseUrl}/product/list?isActive=true`, {
            method: 'GET',
          });
  
          const data = await response.json();
          setPosts(data.products);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }         
      }

    }
    fetchPosts();
  }, []);

  return (
    <div>
      <ResponsiveHeader />
      {/* <MobileHeader /> */} 
      <main>
      <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 1100: 4, 1400: 4}}
            >
          <Masonry>
            {posts.map((post, index) => (
              <Post key={post._id} post={post} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </main>
    </div>
  );
};