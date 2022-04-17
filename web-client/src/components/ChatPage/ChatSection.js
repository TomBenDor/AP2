import ChatMessages from "./ChatMessages";
import './ChatSection.css';
import {useEffect, useRef, useState} from "react";

const ChatSection = (props) => {
    const messageBox = useRef(null);
    // Set state for send button disabled state
    const [messageEmpty, setMessageEmpty] = useState(true);
    const messagesLength = props.currentContactId !== -1 ? props.contacts[props.currentContactId].messages.length : 0;

    // Create a cache for the messages the user has written to each contact
    const [messagesCache, setMessagesCache] = useState({});
    const [showAttachments, setShowAttachments] = useState(false);

    const sendMessage = (message) => {
        // Add new message to current contact's messages
        props.setContacts(props.contacts.map(c => {
            if (c.username === props.contacts[props.currentContactId].username) {
                c.messages.push(message);
            }
            return c;
        }));

        // Clear message box
        messageBox.current.value = "";
        // Delete the current contact from the cache
        setMessagesCache(cache => {
            delete cache[props.contacts[props.currentContactId].username];
            return cache;
        });

        // Disable send button
        setMessageEmpty(true);
        setInputHeight();
    };

    const sendTextMessage = () => {
        const message = messageBox.current.value.trim();
        if (message.length > 0) {
            // Get current time in hh:mm format
            const currentTime = new Date().toLocaleString('en-US', {hour12: false});
            // Create new message object
            const newMessage = {
                id: props.contacts[props.currentContactId].messages.length + 1,
                sender: 'left',
                text: message,
                timestamp: currentTime,
                type: 'text'
            };
            sendMessage(newMessage);
        }
    };

    const typing = () => {
        setMessageEmpty(messageBox.current.value.length === 0);
        setInputHeight();
        // Store written message for current contact in cache
        setMessagesCache({
            ...messagesCache,
            [props.contacts[props.currentContactId].username]: messageBox.current.value
        });
    };

    const setInputHeight = () => {
        let messageInput = document.getElementById("message-input");
        let inputSection = document.getElementById("input-section");
        if (!messageInput || !inputSection) {
            return;
        }
        // This might seem bizarre, but it's necessary to set the height of the input section
        let optimalHeight;
        do {
            optimalHeight = messageInput.scrollHeight;
            inputSection.style.height = Math.max(messageInput.scrollHeight + 10, 50) + "px";
        } while (messageInput.scrollHeight !== optimalHeight);
    };

    const keyPressed = (e) => {
        setInputHeight();
        if (messageBox.current.value === "" && (/\s/.test(e.key) || e.key === "Enter")) {
            e.preventDefault();
        } else if (e.key === "Enter" && !e.shiftKey) {
            sendTextMessage();
            e.preventDefault();
        }
    }

    const updateMessageBox = () => {
        // Update message box only if the message box is empty
        if (messageBox.current && messageBox.current.value.length === 0) {
            // Check if current contact is in cache
            if (Object.keys(messagesCache).length > 0 && messagesCache[props.contacts[props.currentContactId].username]) {
                // Set message box value to the message from cache
                messageBox.current.value = messagesCache[props.contacts[props.currentContactId].username];
            }
            setMessageEmpty(messageBox.current.value.length === 0);
        }
        setInputHeight();
    };

    // Clear message box when current contact changes
    useEffect(() => {
        if(props.currentContactId !== -1) {
            messageBox.current.value = "";
        }
    }, [props.currentContactId]);

    useEffect(updateMessageBox, [messagesCache, props.contacts, props.currentContactId]);

    const scrollToBottom = () => {
        const messageBubbles = document.getElementsByClassName('message-bubble');
        // If there are messages
        if (messageBubbles.length > 0) {
            messageBubbles[messageBubbles.length - 1].scrollIntoView();
        }
    };

    // Scroll to the bottom when the number of messages changes
    useEffect(scrollToBottom, [messagesLength]);

    const onSelectImage = (e) => {
        // Get the file
        const file = e.target.files[0];
        // If no file was selected, return
        if (!file) {
            return;
        }
        // Create a new file reader
        const reader = new FileReader();
        // Set the file reader onload function
        reader.onload = (e) => {
            // Create a new message object
            const newMessage = {
                id: props.contacts[props.currentContactId].messages.length + 1,
                sender: 'left',
                text: e.target.result,
                timestamp: new Date().toLocaleString('en-US', {hour12: false}),
                type: 'image'
            };
            sendMessage(newMessage);
        };
        // Read the file
        reader.readAsDataURL(file);
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
                                          currentContactId={props.currentContactId}/>
                        </div>
                        <div id="input-section">
                            <span className="chat-input">
                                <textarea ref={messageBox} id="message-input" placeholder="Type a message..."
                                          onChange={typing}
                                          onKeyDown={keyPressed}/>
                            </span>
                            <span className="chat-buttons">
                                {(!messageEmpty &&
                                        <button className="center chat-button" onClick={sendTextMessage}>
                                            <i className="bi bi-send"/>
                                        </button>
                                    ) ||
                                    <div className="center">
                                        {(!showAttachments &&
                                                <button className="chat-button"
                                                        onMouseEnter={() => {
                                                            setShowAttachments(true);
                                                        }}>
                                                    <i className="bi bi-paperclip"/>
                                                </button>
                                            ) ||
                                            <div onMouseLeave={() => {
                                                setShowAttachments(false);
                                            }}>
                                                <label className="chat-button">
                                                    <input onChange={onSelectImage} type="file" className="upload-file-button" accept="image/*"/>
                                                    <i className="bi bi-image"/>
                                                </label>
                                                <label className="chat-button">
                                                    <input type="file" className="upload-file-button" accept="video/*"/>
                                                    <i className="bi bi-camera-video"/>
                                                </label>
                                                <button className="chat-button">
                                                    <i className="bi bi-mic"/>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                }
                            </span>
                        </div>
                    </>
                ) ||
                <div className="max">
                    <div className="welcome center">
                        Select a contact to start messaging...
                    </div>
                </div>
            }
        </>
    );
}

export default ChatSection;