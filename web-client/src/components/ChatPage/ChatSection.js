import ChatMessages from "./ChatMessages";
import './ChatSection.css';
import ToggleTheme from './ToggleTheme'
import {useEffect, useRef, useState} from "react";

const ChatSection = ({user, setUser, DB, setDB, currentChatID, messagesCache, setMessagesCache, theme, setTheme}) => {
    const messageBox = useRef(null);
    // Set state for send button disabled state
    const [messageEmpty, setMessageEmpty] = useState(true);
    const messagesLength = currentChatID !== -1 ? user.chats[currentChatID].messages.length : 0;

    const [showAttachments, setShowAttachments] = useState(false);

    // State for recording audio
    const [recording, setRecording] = useState(false);
    // State for media stream
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const sendMessage = (message) => {
        // Add new message to current chat's messages
        if (currentChatID !== -1) {
            setUser({
                ...user,
                chats: {
                    ...user.chats,
                    [currentChatID]: {
                        ...user.chats[currentChatID],
                        messages: [
                            ...user.chats[currentChatID].messages,
                            message
                        ]
                    }
                }
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
                id: user.chats[currentChatID].messages.length + 1,
                sender: user.username,
                text: message,
                timestamp: currentTime,
                type: 'text'
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
                id: user.chats[currentChatID].messages.length + 1,
                sender: user.username,
                text: e.target.result,
                timestamp: new Date().toLocaleString('en-US', {hourCycle: 'h23'}),
                type: 'image'
            };
            sendMessage(newMessage);
        };
        // Read the file
        reader.readAsDataURL(file);
    };

    const onSelectVideo = (e) => {
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
                id: user.chats[currentChatID].messages.length + 1,
                sender: user.username,
                text: e.target.result,
                timestamp: new Date().toLocaleString('en-US', {hourCycle: 'h23'}),
                type: 'video'
            };
            sendMessage(newMessage);
        };
        // Read the file
        reader.readAsDataURL(file);
    };

    const startRecording = () => {
        // Record audio
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                // Create a new media recorder
                const tempMediaRecorder = new MediaRecorder(stream);
                // Create a new blob array
                const blobs = [];
                // Set the media recorder on data available function
                tempMediaRecorder.ondataavailable = (e) => {
                    // Add the blob to the blob array
                    blobs.push(e.data);
                };
                // Set the media recorder on stop function
                tempMediaRecorder.onstop = (e) => {
                    // Create a new message object
                    const newMessage = {
                        id: user.chats[currentChatID].messages.length + 1,
                        sender: user.username,
                        text: URL.createObjectURL(new Blob(blobs, {type: 'audio/ogg'})),
                        timestamp: new Date().toLocaleString('en-US', {hourCycle: 'h23'}),
                        type: 'audio'
                    };
                    // Send the message
                    sendMessage(newMessage);
                };
                // Start recording
                tempMediaRecorder.start();
                setMediaRecorder(tempMediaRecorder);
            });
    };

    const onSelectRecording = (e) => {
        // If recording is in progress, stop it. Otherwise, start.
        recording ? mediaRecorder.stop() : startRecording();
        // Update recording state
        setRecording(!recording);
    };

    const cancelRecording = () => {
        mediaRecorder.onstop = null;
        // Stop the media recorder
        mediaRecorder.stop();
        // Update recording state
        setRecording(false);
    };

    // Send recording when contact changes
    useEffect(() => {
        if (recording) {
            mediaRecorder.stop();
            setRecording(false);
            setShowAttachments(false);
        }
    }, [currentChatID]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {(currentChatID !== -1 && <>
                    <div className="chat-section-header">
                            <span className="user-header">
                                <span className="profile-pic">
                                    <img
                                        src={user.chats[currentChatID].type === "one-to-one" ? DB.users[user.chats[currentChatID].members.filter(m => m !== user.username)[0]].profilePicture : user.chats[currentChatID].picture}
                                        className="center" alt="profile-pic"/>
                                </span>
                                <span className="user-header-title">
                                    <div className="center">
                                        {user.chats[currentChatID].type === "one-to-one" ? DB.users[user.chats[currentChatID].members.filter(m => m !== user.username)[0]].name : user.chats[currentChatID].name}
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
                    {(!recording &&
                            <textarea ref={messageBox} id="message-input" placeholder="Type a message..."
                                      onChange={typing}
                                      onKeyDown={keyPressed}/>
                        ) ||
                        <div className="center"><b>Recording...</b></div>
                    }

                </span>
                        <span className="buttons">
                                {((!messageEmpty && !recording) &&
                                        <button className="center icon-button" onClick={sendTextMessage}>
                                            <i className="bi bi-send"/>
                                        </button>
                                    ) ||
                                    (recording &&
                                        <div className="center">
                                            <button className="icon-button" onClick={onSelectRecording}>
                                                <i className="bi bi-stop-circle"/>
                                            </button>
                                            <button className="icon-button" onClick={cancelRecording}>
                                                <i className="bi bi-trash"/>
                                            </button>
                                        </div>
                                    ) ||
                                    <div className="center">
                                        {(!showAttachments &&
                                                <button className="icon-button"
                                                        onMouseEnter={() => {
                                                            setShowAttachments(true);
                                                        }}>
                                                    <i className="bi bi-paperclip"/>
                                                </button>
                                            ) ||
                                            <div onMouseLeave={() => {
                                                setShowAttachments(false);
                                            }}>
                                                <label className="icon-button">
                                                    <input onChange={onSelectImage} type="file"
                                                           className="upload-file-button" accept="image/*"/>
                                                    <i className="bi bi-image"/>
                                                </label>
                                                <label className="icon-button">
                                                    <input onChange={onSelectVideo} type="file"
                                                           className="upload-file-button" accept="video/*"/>
                                                    <i className="bi bi-camera-video"/>
                                                </label>
                                                <button onClick={onSelectRecording} className="icon-button">
                                                    <i className="bi bi-mic"/>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                }
                            </span>
                    </div>
                </>
            ) || <div className="max">
                <div className="welcome center">
                    Select a contact to start messaging...
                </div>
            </div>
            }
        </>
    );
}

export default ChatSection;