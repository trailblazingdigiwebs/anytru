import React from "react";

const IndividualChat = () => {
  return (
    <>
      <div className="flex individualchat">
        <div className="w-1/4">
          <img className="chat-profile-pic" src="./images/profile-pic.png" alt="username" />
        </div>
        <div className="w-2/4">
            <p>Duhyant_98</p>
            <p>2 New Message</p>
        </div>
        <div  className="w-1/4">
            <p>1 Minute</p>
        </div>
      </div>
    </>
  );
};

export default IndividualChat;