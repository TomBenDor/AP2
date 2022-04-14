import ChatMessages from "./ChatMessages";
import './ChatSection.css';
import {useRef, useState} from "react";

const ChatSection = (props) => {
    const messageBox = useRef(null);
    // Set state for send button disabled state
    const [sendButtonDisabled, setSendButtonDisabled] = useState(true);

    const sendMessage = () => {
        const message = messageBox.current.value;
        if (message.length > 0) {
            console.log("sendMessage: " + message);
            messageBox.current.value = "";
        }

        // Disable send button
        setSendButtonDisabled(true);
    };

    const typing = () => {
        setSendButtonDisabled(messageBox.current.value.length === 0);
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
                            {props.contacts[props.currentContact].name}
                        </div>
                    </span>
                </span>
            </div>
            <div className="chat-section-messages">
                <ChatMessages user={props.user}
                              contacts={props.contacts}
                              setContacts={props.setContacts}
                              currentContuct={props.currentContact}/>
            </div>
            <div className="chat-section-input-bar">
                <input ref={messageBox} id="message-input" type="text" placeholder="Type a message..."
                       onChange={typing}/>
                <button id="send-button" onClick={sendMessage} disabled={sendButtonDisabled} >Send</button>
            </div>
        </>
    );
}

export default ChatSection;