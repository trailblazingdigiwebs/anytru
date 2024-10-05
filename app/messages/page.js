'use client'
import React, { useEffect, useState } from 'react';
import IndividualChat from '../components/individual-chat';
import ResponsiveHeader from '../components/responsiveHeader';
import config from '../config';

const Messages = () => {
    const [chats, setChats] = useState([]);
    const currentUserId = localStorage.getItem('token');

    useEffect(() => {
        const fetchChats = async () => {
            const token = currentUserId;
            try {
                const response = await fetch(`${config.apiBaseUrl}/chat/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                const data = await response.json();
                setChats(data); // Store the fetched chat data
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, []);


    return (
        <div>
        <ResponsiveHeader/>
    <div className='pageWrapper'>
        <div className='flex gap-10'>
            <div className='all-chats w-2/6'>
                        <div className='all-chats-wrapper'>
                            <p className='chats-number'>Chats ({chats.length})</p>
                            <div className='chats'>
                                {chats.map((chat, index) => {
                                    // Find the other user (not the current user) in the chat
                                    const otherUser = chat.users.find(user => user._id !== currentUserId);
                                    
                                    // If we find the other user, render their details in the IndividualChat component
                                    return otherUser && <IndividualChat key={index} user={otherUser} />;
                                })}
                            </div>
                        </div>
            </div>
            <div className='chat-screen w-3/6'>
                <div >
                    <div className='chat-username-wrapper flex items-center gap-4'>
                        <img className="chat-profile-pic" src="./images/profile-pic.png" alt="username" />
                        <div>
                            <div className='flex items-top gap-1'>
                                <p className='chat-username'>Duhyant_98</p>
                                <img className="online" src="./images/online.png" alt="user active" />
                            </div>
                            <p className='user-active'>Active</p>
                        </div>
                    </div>
                    <div className='chat-messages'>
                        <div className='chat-messages-wrapper'>
                            <div className='chat-message flex'>
                                <img src="./images/profile-pic.png" alt="username" />
                                <p>Hi</p>
                            </div>
                            <div className='chat-message flex justify-end'>
                                <p className='chat-message-right'>How are you doing?</p>
                                <img src="./images/profile-pic.png" alt="username" />
                            </div>
                            <div className='chat-message flex'>
                                <img src="./images/profile-pic.png" alt="username" />
                                <p>All good, Thanks. How can we help your project?</p>
                            </div>
                            <div className='chat-message flex justify-end'>
                                <p className='chat-message-right'>I need this to be delivered in 8 days in wooden work. How soon can you do it ?</p>
                                <img src="./images/profile-pic.png" alt="username" />
                            </div>
                        </div>
                    </div>
                    <div className='chat-send'>
                        <div className='write-message flex items-center'>
                            <img className="online" src="./images/attachment.png" alt="add attachment" />
                            <p>Write a message...</p>
                        </div>
                        <div className='send-message-btn'>
                            <button>
                                <span>Send</span>
                            </button>    
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='whiteboard w-1/6'> */}
                {/* <img className="online" src="./images/attachment.png" alt="add attachment" /> */}
                {/* <div className='whiteboard-wrapper'><p>Whiteboard</p></div> */}
            {/* </div> */}
            
        </div>
    </div>
    </div>
    )
};

export default Messages;
