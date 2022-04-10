import {useRef} from "react";

const ChatPage = (user) => {
    const openContactDialog = () => {
        console.log("openContactDialog");
    };

    const messageBox = useRef(null);

    const typing = () => {
        document.getElementById("send-button").disabled = messageBox.current.value.length === 0;
    }

    return (
        <div id="content-frame">
            <div className="chat-section">
                <div className="chat-section-header">
                    <span className="profile-pic">
                        <img
                            src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                            className="center" alt="profile-pic"/>
                    </span>
                </div>
                <div className="chat-section-messages">

                </div>
                <div className="chat-section-input-bar">
                    <input ref={messageBox} id="message-input" type="text" placeholder="Type a message..."
                           onChange={typing}/>
                    <button id="send-button">Send</button>
                </div>
            </div>
            <div className="contacts-section">
                <div className="contacts-section-header">
                <span className="contacts-section-header-user">
                    <span className="profile-pic">
                        <img
                            src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                            className="center" alt="profile-pic"/>
                    </span>
                    <span className="contacts-section-header-title">
                        {user.user.displayName}
                    </span>
                </span>
                    <span className="contacts-section-header-controls">
                        <a className="add-contact-button" onClick={openContactDialog}>
                            <img src={"plus.svg"} alt="Add contact"/>
                        </a>
                </span>
                </div>
            </div>
        </div>);
};

export default ChatPage;