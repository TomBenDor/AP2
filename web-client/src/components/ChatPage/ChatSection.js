import ChatMessages from "./ChatMessages";
import './ChatSection.css';
import {useEffect, useRef, useState} from "react";

const ChatSection = (props) => {
    const messageBox = useRef(null);
    // Set state for send button disabled state
    const [messageEmpty, setMessageEmpty] = useState(true);
    const messagesLength = props.currentContactId !== -1 ? props.contacts[props.currentContactId].messages.length : 0;

    // Create a cache for the messages the user has written to each contact
    const [messagesCache, setMessagesCache] = useState(Object.assign({}, ...props.contacts.map(c => c.id).map((id) => {
        return {
            [id]: ""
        }
    })));
    const [showAttachments, setShowAttachments] = useState(false);

    // State for recording audio
    const [recording, setRecording] = useState(false);
    // State for media stream
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const sendMessage = (message) => {
        // Add new message to current contact's messages
        props.setContacts(props.contacts.map(c => {
            if (c.username === props.contacts[props.currentContactId].username) {
                c.messages.push(message);
            }
            return c;
        }));

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
            // Clear the message box
            messageBox.current.value = '';
            typing();
        }
    };

    const typing = () => {
        setMessageEmpty(messageBox.current.value.length === 0);
        setInputHeight();
        // Store written message for current contact in cache
        setMessagesCache({
            ...messagesCache, [props.currentContactId]: messageBox.current.value
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
            messageBox.current.value = messagesCache[props.currentContactId];
            setMessageEmpty(messageBox.current.value.length === 0);
        }
        setInputHeight();
    }

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
                id: props.contacts[props.currentContactId].messages.length + 1,
                sender: 'left',
                text: e.target.result,
                timestamp: new Date().toLocaleString('en-US', {hour12: false}),
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
                        id: props.contacts[props.currentContactId].messages.length + 1,
                        sender: 'left',
                        text: URL.createObjectURL(new Blob(blobs, {type: 'audio/ogg'})),
                        timestamp: new Date().toLocaleString('en-US', {hour12: false}),
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

    // Send recording when contact changes
    useEffect(() => {
        if (recording) {
            mediaRecorder.stop();
            setRecording(false);
            setShowAttachments(false);
        }
    }, [props.currentContactId]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {(props.currentContactId !== -1 && <>
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
                    {(!recording &&
                            <textarea ref={messageBox} id="message-input" placeholder="Type a message..."
                                      onChange={typing}
                                      onKeyDown={keyPressed}/>
                        ) ||
                        <div className="center"><b>Recording...</b></div>
                    }

                </span>
                        <span className="chat-buttons">
                                {((!messageEmpty && !recording) &&
                                    <button className="center chat-button" onClick={sendTextMessage}>
                                        <i className="bi bi-send"/>
                                    </button>) || (recording &&
                                    <button className="center chat-button" onClick={onSelectRecording}>
                                        <i className="bi bi-stop"/>
                                    </button>) || <div className="center">
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
                                                <input onChange={onSelectImage} type="file"
                                                       className="upload-file-button" accept="image/*"/>
                                                <i className="bi bi-image"/>
                                            </label>
                                            <label className="chat-button">
                                                <input onChange={onSelectVideo} type="file"
                                                       className="upload-file-button" accept="video/*"/>
                                                <i className="bi bi-camera-video"/>
                                            </label>
                                            <button onClick={onSelectRecording} className="chat-button">
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