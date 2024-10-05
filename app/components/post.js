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

  console.log('post', post);
  console.log('isFollowing', isFollowing);

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
    // e.preventDefault();

    if (!currentUser) {
      setSignInModalVisible(true);
    } else {
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
    }


  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setSignInModalVisible(true);
    } else {
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
    } else {
      router.push(`/offers?id=${post._id}`);
    }
    
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
    if (!currentUser) {
      setSignInModalVisible(true);
    }

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
            <p className="mb-4">You need to be signed in to Like, Save or Order this product.</p>
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
      <div className="MainPostWrapper">
        <div className="MainPost cursPointer" >
          <div className="post">
            <img src={post.imageUrl} alt="Post Image" />
              <div className="post_like"  onClick={(e) => {
                e.stopPropagation(); // Prevent triggering handlePostClick
                handleLike();
              }}>
                <p> <svg className="likesHeart" width="20" height="19" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.1 15.55L10 15.65L9.89 15.55C5.14 11.24 2 8.39 2 5.5C2 3.5 3.5 2 5.5 2C7.04 2 8.54 3 9.07 4.36H10.93C11.46 3 12.96 2 14.5 2C16.5 2 18 3.5 18 5.5C18 8.39 14.86 11.24 10.1 15.55ZM14.5 0C12.76 0 11.09 0.81 10 2.08C8.91 0.81 7.24 0 5.5 0C2.42 0 0 2.41 0 5.5C0 9.27 3.4 12.36 8.55 17.03L10 18.35L11.45 17.03C16.6 12.36 20 9.27 20 5.5C20 2.41 17.58 0 14.5 0Z"
                    fill={liked ? "red" : "#F8F8F8"}
                  />
                </svg> {likes}</p>
              </div>
          </div>

          <div className="overlay" onClick={handlePostClick}>
            {currentUser && currentUser._id !== post.user._id && (
              <div>
                {isFollowing ? (
                  <button className="followPostBtn" onClick={ (e) => {
                      e.stopPropagation(); // Prevent triggering handlePostClick
                      handleUnfollow();
                    } }>
                    Unfollow
                  </button>
                ) : (
                  <button className="followPostBtn" onClick={ (e) => {
                      e.stopPropagation(); // Prevent triggering handlePostClick
                      handleFollow();
                    } }>
                    Follow
                  </button>
                )}
              </div>
            )}
            <Dropdown>
              <DropdownTrigger>
                <button className="moreButton" >
                  <img src="/images/post/more-dots.svg" alt="likes" />
                </button>
              </DropdownTrigger>
              <DropdownMenu className="dropdownWrapperTwo" aria-label="Static Actions">
                <DropdownItem key="pinPost" >Pin Post</DropdownItem>
                <DropdownItem key="reportPost" onClick={() => openReportModal('post')}>Report Post</DropdownItem>
                <DropdownItem key="reportUser" onClick={() => openReportModal('user')}>Report User</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div className="post_like_overlay" onClick={ (e) => {
                e.stopPropagation(); // Prevent triggering handlePostClick
                handleLike();
              } }>
                <p> <svg className="likesHeart" width="20" height="19" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.1 15.55L10 15.65L9.89 15.55C5.14 11.24 2 8.39 2 5.5C2 3.5 3.5 2 5.5 2C7.04 2 8.54 3 9.07 4.36H10.93C11.46 3 12.96 2 14.5 2C16.5 2 18 3.5 18 5.5C18 8.39 14.86 11.24 10.1 15.55ZM14.5 0C12.76 0 11.09 0.81 10 2.08C8.91 0.81 7.24 0 5.5 0C2.42 0 0 2.41 0 5.5C0 9.27 3.4 12.36 8.55 17.03L10 18.35L11.45 17.03C16.6 12.36 20 9.27 20 5.5C20 2.41 17.58 0 14.5 0Z"
                    fill={liked ? "red" : "black"}
                  />
                </svg> {likes}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="userOptions">
        <div className="postUserDetails">
          <div className="userAvatar"><img src={post.user.avatar} alt="User Avatar" /></div>
          <div className="userName">
            <p>{post.user.firstName} {post.user.lastName}</p>
            <span className="postTime">{timeAgo(post.createdAt)}</span>            
          </div>



        </div>

        <div className="share_save">
              <Dropdown>
                  <DropdownTrigger>
                    <button>
                      <img src="/images/post/share.svg" alt="Share With Friends" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu className="dropdownWrapper" aria-label="Static Actions">
                    <DropdownItem key="new"><ShareButtons url={shareUrl} title={shareTitle} /></DropdownItem>
                  </DropdownMenu>
                </Dropdown>

            
            <a href="#" onClick={handleSave}>
            <svg width="16" height="20" viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.33398 18.3332V2.49984C1.33398 2.27882 1.42178 2.06686 1.57806 1.91058C1.73434 1.7543 1.9463 1.6665 2.16732 1.6665H13.834C14.055 1.6665 14.267 1.7543 14.4232 1.91058C14.5795 2.06686 14.6673 2.27882 14.6673 2.49984V18.3332L8.00065 14.8861L1.33398 18.3332Z"
                fill={post.isWishlisted ? "#F1672D" : "none"}
                stroke= "black"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            </a>

            {currentUser?.role !== 'MERCHANT' && post.isOffers &&(
            <a href="#" onClick={handleCart}><img src="/images/post/cart.svg" alt="Add To Cart" /></a>
            )}
        </div>
        {/* <Dropdown>
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
        </Dropdown> */}
      </div>
    </div>
  );
}

export default Post;
