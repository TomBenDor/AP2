import ChatMessages from "./ChatMessages";
import './ChatSection.css';
import {useRef} from "react";

const ChatSection = () => {
    const messageBox = useRef(null);

    const typing = () => {
        document.getElementById("send-button").disabled = messageBox.current.value.length === 0;
    };

    return (
        <>
            <div className="chat-section-header">
                <span className="user-header">
                    <span className="profile-pic">
                        <img
                            src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                            className="center" alt="profile-pic"/>
                    </span>
                    <span className="user-header-title">
                        <div className="center">
                            Tom
                        </div>
                    </span>
                </span>
            </div>
            <div className="chat-section-messages">
                <ChatMessages/>
            </div>
            <div className="chat-section-input-bar">
                <input ref={messageBox} id="message-input" type="text" placeholder="Type a message..."
                       onChange={typing}/>
                <button id="send-button" disabled>Send</button>
            </div>
        </>
    );
}

export default ChatSection;