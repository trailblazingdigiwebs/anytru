import React from 'react';
import IndividualChat from '../components/individual-chat';
import ResponsiveHeader from '../components/responsiveHeader';


const Messages = () => {

    return (
        <div>
        <ResponsiveHeader/>
    <div className='pageWrapper'>
        <div className='flex gap-10'>
            <div className='all-chats w-2/6'>
                <div className='all-chats-wrapper'>
                    <p className='chats-number'>Chats (19)</p>
                    <div lassName='chats'>
                        <IndividualChat/>
                        <IndividualChat/>
                        <IndividualChat/>
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
            <div className='whiteboard w-1/6'>
                {/* <img className="online" src="./images/attachment.png" alt="add attachment" /> */}
                <div className='whiteboard-wrapper'><p>Whiteboard</p></div>
            </div>
            
        </div>
    </div>
    </div>
    )
};

export default Messages;
