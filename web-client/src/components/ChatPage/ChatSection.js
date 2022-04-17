import ChatMessages from "./ChatMessages";
import './ChatSection.css';
import {useRef, useState} from "react";

const ChatSection = (props) => {
    const messageBox = useRef(null);
    // Set state for send button disabled state
    const [messageEmpty, setMessageEmpty] = useState(true);

    const sendMessage = () => {
        const message = messageBox.current.value;
        if (message.length > 0) {
            // Get current time in hh:mm format
            const currentTime = new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            });
            // Create new message object
            const newMessage = { id: props.contacts[props.currentContactId].messages.length + 1, sender: 'left', text: message, timestamp: currentTime };
            // Add new message to current contact's messages
            props.setContacts(props.contacts.map(c => {
                if (c.username === props.contacts[props.currentContactId].username) {
                    c.messages.push(newMessage);
                }
                return c;
            }));

            // Clear message box
            messageBox.current.value = "";
            // Disable send button
            setMessageEmpty(true);
        }
    };

    const typing = () => {
        setMessageEmpty(messageBox.current.value.length === 0);
    };

    return (
        <>
            {(props.currentContactId !== -1 &&
                    <>
                        <div className="chat-section-header">
                        <span className="user-header">
                            <span className="profile-pic">
                                <img
                                    src={props.contacts[props.currentContactId].profilePicture}
                                    className="center" alt="profile-pic"/>
                            </span>
                            <span className="user-header-title">
                                <div className="center">
                                    {props.contacts[props.currentContactId].name}
                                </div>
                            </span>
                        </span>
                        </div>
                        <div className="chat-section-messages">
                            <ChatMessages user={props.user}
                                          contacts={props.contacts}
                                          setContacts={props.setContacts}
                                          currentContuct={props.currentContactId}/>
                        </div>
                        <div className="chat-section-input-bar">
                            <span className="chat-input">
                                <input ref={messageBox} id="message-input" type="text" placeholder="Type a message..."
                                       onChange={typing} onKeyDown={(e) => e.key === 'Enter' && sendMessage()}/>
                            </span>
                            <span className="chat-buttons">
                                {!messageEmpty &&
                                    <button className="center chat-button" onClick={sendMessage}>
                                        <i className="bi bi-send"/>
                                    </button>
                                    ||
                                    <button className="center chat-button">
                                        <i className="bi bi-paperclip"/>
                                    </button>
                                }
                            </span>
                        </div>
                    </>
                ) ||
                <div className="welcome center">
                    Select a contact to start messaging...
                </div>
            }
        </>
    );
}

export default ChatSection;