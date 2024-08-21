'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import config from '../config';
import { timeAgo } from '../utils/timeAgo';
import {Tooltip, Button} from "@nextui-org/react";
import { 
  FacebookShareButton, 
  FacebookIcon, 
  TwitterShareButton, 
  XIcon, 
  WhatsappShareButton, 
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailIcon,
  EmailShareButton
} from 'react-share';

const ShareButtons = ({ url, title }) => {
  return (
    <div>
      {/* <h3>Share with others:</h3> */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={28} round />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title}>
          <XIcon size={28} round />
        </TwitterShareButton>

        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={28} round />
        </WhatsappShareButton>

        <EmailShareButton url={url} title={title}>
          <EmailIcon size={28} round />
        </EmailShareButton>

        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={28} round />
        </TelegramShareButton>
      </div>
    </div>
  );
};


const GuestPost = ({ post }) => {

  // const router = useRouter();

  // const handlePostClick = () => {
  //   router.push(`/product-list?id=${post._id}`);
  // };

  const shareUrl = `${config.domainUrl}/product-list?id=${post._id}`;
  const shareTitle = 'Check out this product from Anytru!';


  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this awesome content!',
          text: 'Here is some interesting content I found.',
          url: `${config.domainUrl}/product-list?id=${post._id}`,
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.error('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="postWrapper">
      <div className="userOptions">
        <div className="postUserDetails">
          <div className="userAvatar"><img src={post.user.avatar} alt="User Avatar" /></div>
          <div className="userName"><p>{post.user.firstName} {post.user.lastName}
            <span className="postTime">{timeAgo(post.createdAt)}</span>
          </p></div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <button>
              <img src="/images/post/more.png" alt="More Options" />
            </button>
          </DropdownTrigger>
          <DropdownMenu className="dropdownWrapperTwo" aria-label="Static Actions">
            <DropdownItem key="edit"><Link href="/help">Report</Link></DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="MainPostWrapper">
        <div className="MainPost">
          <div className="post">
            <img src={post.imageUrl} alt="Post Image" />
            {post.description && (
              <div className="post_caption">
                <p>Descriptions: {post.description}</p>
              </div>
            )}
          </div>
        </div>
        <div className="postReactions">
          <div className="likes">
          <Tooltip showArrow={true} className="toolTip" placement="bottom" content="Sign in to like this post">
            <p className="flex align-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>             
              <span>{post.totalLikes} likes</span>
            </p>
            {/* </Button> */}
            </Tooltip>
          </div>
          <div className="share_save">
              <Dropdown>
                  <DropdownTrigger>
                    <button>
                      <img src="/images/post/share.png" alt="Share With Friends" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdownWrapper" aria-label="Static Actions">
                    <DropdownItem key="new"><ShareButtons url={shareUrl} title={shareTitle} /></DropdownItem>
                  </DropdownMenu>
                </Dropdown>

          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestPost;
