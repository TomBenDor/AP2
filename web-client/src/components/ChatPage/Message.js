import './Message.css'

const Message = ({message}) => {
    return (
        <div className={"message message-" + message.sender}>
            <div className="message-bubble">
                {message.type === 'text' && <div className="message-text"><p>{message.text}</p></div>}
                {message.type === 'image' && <img className="message-image" src={message.text} alt="sent"/>}
                <div className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "numeric",
                    minute: "numeric"
                })}</div>
            </div>
        </div>
    );
};

export default Message;