import ChatMessages from "./ChatMessages";
import './ChatSection.css';
import ToggleTheme from './ToggleTheme'
import {useEffect, useRef, useState} from "react";

const ChatSection = ({user, setUser, currentChatID, messagesCache, setMessagesCache, theme, setTheme}) => {
    const messageBox = useRef(null);
    // Set state for send button disabled state
    const [messageEmpty, setMessageEmpty] = useState(true);

    const messagesLength = currentChatID !== -1 ? user.chats[currentChatID].messages.length : 0;
    const sendMessage = async (message) => {
        // Add new message to current chat's messages
        if (currentChatID !== -1) {
            setUser({
                ...user, chats: {
                    ...user.chats, [currentChatID]: {
                        ...user.chats[currentChatID], messages: [...user.chats[currentChatID].messages, message]
                    }
                }
            });

            // Send message to the server
            await fetch("http://localhost:54321/api/contacts/" + currentChatID + "/messages", {
                method: "POST", headers: {
                    "Authorization": "Bearer " + user.token, "Content-Type": "application/json"
                }, body: JSON.stringify({content: message.content})
            });
        }
    };

    const sendTextMessage = () => {
        const message = messageBox.current.value.trim();
        if (message.length > 0) {
            // Get current time in hh:mm format
            const currentTime = new Date().toLocaleString('en-US', {hourCycle: 'h23'});
            // Create new message object
            const newMessage = {
                id: user.chats[currentChatID].messages.length + 1, sent: true, content: message, created: currentTime,
            };
            sendMessage(newMessage);
            // Clear cache entry for the current chat
            setMessagesCache(cache => {
                cache[currentChatID] = "";
                return cache;
            });

            // Disable send button
            setMessageEmpty(true);
            messageBox.current.value = '';
            setInputHeight();
        }
    };

    const typing = () => {
        setMessageEmpty(messageBox.current.value.length === 0);
        setInputHeight();
        // Store written message for current contact in cache
        setMessagesCache({
            ...messagesCache, [currentChatID]: messageBox.current.value
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
        if (messageBox.current) {
            // Set message box value to the message from cache
            messageBox.current.value = messagesCache[currentChatID];
            setMessageEmpty(messageBox.current.value.length === 0);
        }
        setInputHeight();
    }

    useEffect(updateMessageBox, [messagesCache, user, currentChatID]);

    const scrollToBottom = () => {
        const messageBubbles = document.getElementsByClassName('message-bubble');
        // If there are messages
        if (messageBubbles.length > 0) {
            messageBubbles[messageBubbles.length - 1].scrollIntoView();
        }
    };

    // Scroll to the bottom when the number of messages changes
    useEffect(scrollToBottom, [messagesLength]);

    return (<>
        {(currentChatID !== -1 && <>
            <div className="chat-section-header">
                            <span className="user-header">
                                <span className="profile-pic">
                                    <img
                                        src="media/profile_picture.png"
                                        className="center" alt="profile-pic"/>
                                </span>
                                <span className="user-header-title">
                                    <div className="center">
                                        {user.chats[currentChatID].name}
                                    </div>
                                </span>
                            </span>
                <span className="buttons">
                                <ToggleTheme theme={theme} setTheme={setTheme}/>
                            </span>
            </div>
            <div className="chat-section-messages">
                <ChatMessages user={user}
                              currentChatID={currentChatID}/>
            </div>
            <div id="input-section">
                <span className="chat-input">
                    {(<textarea ref={messageBox} id="message-input" placeholder="Type a message..."
                                onChange={typing}
                                onKeyDown={keyPressed}/>) || <div className="center"><b>Recording...</b></div>}

                </span>
                <span className="buttons">
                            {!messageEmpty &&

                                <button className="center icon-button" onClick={sendTextMessage}>
                                    <i className="bi bi-send"/>
                                </button>}
                        </span>
            </div>
        </>) || <div className="max">
            <div className="welcome center">
                Select a contact to start messaging...
            </div>
        </div>}
    </>);
}

export default ChatSection;