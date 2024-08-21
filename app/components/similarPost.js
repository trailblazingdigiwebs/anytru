'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import config from '../config';
import { timeAgo } from '../utils/timeAgo';

const SimilarPost = ({ post }) => {
  const [likes, setLikes] = useState(post.totalLikes); // Initialize state with initial likes count
  const [liked, setLiked] = useState(post.userLiked); // Track whether the user has liked the post

  const router = useRouter();

  useEffect(() => {
    const userLi = async () => {
      console.log('post :', post);
      console.log('Liked :', post.userLiked, `${post.userLiked}`);
    };

    userLi();
  }, [post]); // Adding post as a dependency to avoid repeated calls

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/user/${post.user._id}/follow`, {
        method: 'POST',
        headers: {
          'authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Followed successfully:', result);
      } else {
        console.error('Failed to follow:', response.statusText);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      console.log(`${post._id}`);
      console.log(`${token}`);
      const response = await fetch(`${config.apiBaseUrl}/product/like/${post._id}`, {
        method: 'PUT',
        headers: {
          'authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Liked / Unliked successfully:', result);
        setLikes(liked ? likes - 1 : likes + 1);
        setLiked(!liked);
      } else {
        console.error('Failed to like / Unlike:', response.statusText);
      }
    } catch (error) {
      console.error('Error liking / unliking post:', error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/wishlist/add/${post._id}`, {
        method: 'POST',
        headers: {
          'authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Saved to wishlist successfully:', result);
      } else {
        console.error('Failed to save to wishlist:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving to wishlist:', error);
    }
  };

  const handlePostClick = () => {
    router.push(`/product-list?id=${post._id}`);
  };

  return (
    <div className="postWrapper">
      <div className="MainPostWrapper">
        <div className="MainPost" onClick={handlePostClick}>
          <div className="post">
            <img src={post.imageUrl} alt="Post Image" />
            {/* {post.description && (
              <div className="post_caption">
                <p>Descriptions: {post.description}</p>
              </div>
            )} */}
          </div>
        </div>
        <div className="postReactions justify-center">
        <p className='font-bold'>{post.name}</p>
        </div>
      </div>
    </div>
  );
}

export default SimilarPost;
