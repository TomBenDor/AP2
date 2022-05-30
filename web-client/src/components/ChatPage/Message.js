import './Message.css'

const Message = ({message, user}) => {
    return (
        <div className={"message message-" + (message.sent ? "left" : "right")}>
            <div className="message-bubble">
                    <div className="message-text">
                        <p>{message.content}</p>
                    </div>
                <div className="message-timestamp">{new Date(message.created).toLocaleTimeString("en-US", {
                    hourCycle: 'h23',
                    hour: "numeric",
                    minute: "numeric"
                })}</div>
            </div>
        </div>
    );
};

export default Message;