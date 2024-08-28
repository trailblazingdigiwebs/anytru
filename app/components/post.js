'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import config from '../config';
import { timeAgo } from '../utils/timeAgo';
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

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.totalLikes); // Initialize state with initial likes count
  const [liked, setLiked] = useState(post.userLiked); // Track whether the user has liked the post
  const [isFollowing, setIsFollowing] = useState(post.userIsFollowing); // Track whether the user is following the post author
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Track modal message
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState(null); // 'post' or 'user'
  const [reportReason, setReportReason] = useState('');

  const [isSignInModalVisible, setSignInModalVisible] = useState(false);

  const router = useRouter();

  const shareUrl = `${config.domainUrl}/product-list?id=${post._id}`;
  const shareTitle = 'Check out this product from Anytru!';

  useEffect(() => {
    // Fetch current user's data
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${config.apiBaseUrl}/user/`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.user);

        } else {
          console.error('Failed to fetch current user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    fetchCurrentUser();
  }, []);

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
        setIsFollowing(true);
      } else {
        console.error('Failed to follow:', response.statusText);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/user/${post.user._id}/unfollow`, {
        method: 'POST',
        headers: {
          'authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Unfollowed successfully:', result);
        setIsFollowing(false);
      } else {
        console.error('Failed to unfollow:', response.statusText);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setSignInModalVisible(true);
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
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

  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setSignInModalVisible(true);
    }

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
        setModalMessage(result.message); // Set the message from the server response
        setIsModalOpen(true); // Show the modal on success
      } else {
        console.error('Failed to save to wishlist:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving to wishlist:', error);
    }
  };

  const handlePostClick = () => {
    console.log('currentUser', currentUser.role)
    if (currentUser) {
      if (currentUser.role === 'USER') {
        router.push(`/product-list?id=${post._id}`);
      } else if (currentUser.role === 'MERCHANT') {
        router.push(`/product-approval?id=${post._id}`);
      } else {
        router.push(`/product-list?id=${post._id}`);
      }
    }    
  };

  const handleCart = () => {

    if (!currentUser) {
      setSignInModalVisible(true);
    }
    router.push(`/offers?id=${post._id}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Check out this awesome content!',
      text: 'Here is some interesting content I found.',
      url: `${config.domainUrl}/product-list?id=${post._id}`,
    };

    await navigator.clipboard.writeText(shareData.url);
    alert('Link copied to clipboard. You can now share it manually.');
  
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
        alert('Error sharing content. Please try again.');
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard. You can now share it manually.');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Error copying to clipboard. Please try again.');
      }
    } else {
      console.error('Web Share API and Clipboard API are not supported in your browser.');
      alert('Sharing is not supported in this browser.');
    }
  };
  
  const goToWishlist = () => {
    router.push(`/wishlist`);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };


  const closeSignInModal = () => {
    setSignInModalVisible(false);
  };

  const handleSignInSubmit = () => {
    router.push(`/login`);
  };


  const closeReportModal = () => {
    setIsReportModalOpen(false)
  };

  const openReportModal = (type) => {
    setReportType(type);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    console.log('details', reportType, reportReason);

    const endpoint = reportType === 'post'
      ? `${config.apiBaseUrl}/reports/post/${post._id}`
      : `${config.apiBaseUrl}/reports/user/${post.user._id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'authorization': `${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: reportReason })
      });

      if (response.ok) {
        const result = await response.json();
        setModalMessage(result.message || 'Report submitted successfully.');
        closeReportModal();
      } else {
        console.error('Failed to report:', response.statusText);
      }
    } catch (error) {
      console.error('Error reporting:', error);
    }
  };

  return (
    <div className="postWrapper">
      {isSignInModalVisible && (
        <div className="wishlistModal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="wishlistModalContent bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Please Sign In / Sign Up</h2>
            <p className="mb-4">You need to be signed in to create a post.</p>
            <div>
              <button className="btn-primary" onClick={handleSignInSubmit}>Sign In / Sign Up</button>
              <button className="btn-secondary mt-4" onClick={closeSignInModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="wishlistModal">
          <div className="wishlistModalContent">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Close</button>
            <button onClick={goToWishlist}>wishlist</button>
          </div>
        </div>
      )}
      {isReportModalOpen && (
        <div className="wishlistModal ReportUserModal">
          <div className="wishlistModalContent">
            <h2><strong>Report {reportType === 'post' ? 'Post' : 'User'}</strong></h2>
            <p>Please share the reason for reporting</p>
            <textarea
              placeholder="Reason for reporting"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div>
              <button onClick={handleReportSubmit}>Submit</button>
              <button onClick={closeReportModal}>Cancel</button>
            </div>  
          </div>
        </div>
      )}
      <div className="userOptions">
        <div className="postUserDetails">
          <div className="userAvatar"><img src={post.user.avatar} alt="User Avatar" /></div>
          <div className="userName"><p>{post.user.firstName} {post.user.lastName}
            <span className="postTime">{timeAgo(post.createdAt)}</span>
          </p></div>

          {currentUser && currentUser._id !== post.user._id && (
            <div className='flex'>
              {isFollowing ? (
                <button className="followPostBtn" onClick={handleUnfollow}>
                  Unfollow
                </button>
              ) : (
                <button className="followPostBtn" onClick={handleFollow}>
                  Follow
                </button>
              )}
            </div>
          )}
        </div>
        <Dropdown>
          <DropdownTrigger>
            <button>
              <img src="/images/post/more.png" alt="More Options" />
            </button>
          </DropdownTrigger>
          <DropdownMenu className="dropdownWrapperTwo" aria-label="Static Actions">
            <DropdownItem key="pinPost" >Pin Post</DropdownItem>
            <DropdownItem key="reportPost" onClick={() => openReportModal('post')}>Report Post</DropdownItem>
            <DropdownItem key="reportUser" onClick={() => openReportModal('user')}>Report User</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="MainPostWrapper">
        <div className="MainPost cursPointer" onClick={handlePostClick}>
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
            <a className="flex align-center" href="#" onClick={handleLike}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={liked ? "#F2682D" : "none"} 
                stroke={liked ? "#F2682D" : "#000000"} 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              <span>{likes} likes</span>
            </a>
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

            
            {/* <a href="#" onClick={handleShare}><img src="/images/post/share.png" alt="Share With Friends" /></a> */}
            <a href="#" onClick={handleSave}><img src="/images/post/save.png" alt="Save It" /></a>
            {currentUser?.role !== 'MERCHANT' && (
            <a href="#" onClick={handleCart}><img src="/images/post/cart.png" alt="Add To Cart" /></a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
