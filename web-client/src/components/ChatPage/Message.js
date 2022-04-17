import './Message.css'

const Message = ({message}) => {
    return (
        <div className={"message message-" + message.sender}>
            <div className="message-bubble">
                <div className="message-text"><p>{message.text}</p></div>
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