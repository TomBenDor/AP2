import Message from "./Message";
import "./ChatMessages.css"

const ChatMessages = (props) => {
    return (
        <ol className="messages-list">
            {props.contacts[props.currentContactId].messages.map(message => (
                <li key={message.id}>
                    <Message message={message}/>
                </li>
            ))}
        </ol>
    );
}

export default ChatMessages;