import React from "react";

const IndividualChat = ({ user }) => {
    return (
        <div className="flex individualchat">
            <div className="w-1/4">
                <img className="chat-profile-pic" src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            </div>
            <div className="w-3/4">
                <p>{user.firstName} {user.lastName}</p>
                {/* <p>2 New Messages</p>  */}
            </div>
            {/* <div className="w-1/4"> */}
                {/* <p>1 Minute Ago</p>  */}
            {/* </div> */}
        </div>
    );
};

export default IndividualChat;
