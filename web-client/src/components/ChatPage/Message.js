import './Message.css'

const Message = ({message, user}) => {
    return (
        <div className={"message message-" + (message.sender === user.username ? "left" : "right")}>
            <div className="message-bubble">
                {message.type === 'text' &&
                    <div className="message-text">
                        <p>{message.text}</p>
                    </div>
                }
                {message.type === 'image' &&
                    <img className="message-media" src={message.text} alt="sent"/>
                }
                {message.type === 'video' &&
                    <video className="message-media" controls>
                        <source src={message.text}/>
                    </video>
                }
                {message.type === 'audio' &&
                    <audio className="message-media" controls>
                        <source src={message.text}/>
                    </audio>
                }
                <div className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString("en-US", {
                    hourCycle: 'h23',
                    hour: "numeric",
                    minute: "numeric"
                })}</div>
            </div>
        </div>
    );
};

export default Message;