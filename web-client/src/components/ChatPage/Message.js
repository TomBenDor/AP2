import './Message.css'

const Message = ({message}) => {
    return (
        <div className={"message-" + message.sender}>
            <div className="message-bubble">
                <div className="message-text"><p>{message.text}</p></div>
                <div className="message-timestamp">{message.timestamp}</div>
            </div>
        </div>
    );
};

export default Message;