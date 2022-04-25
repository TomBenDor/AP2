import Message from "./Message";
import "./ChatMessages.css"

const ChatMessages = ({user, currentContactId}) => {
    return (
        <ol className="messages-list">
            {user.chats[currentContactId].messages.map(message => (
                <li key={message.id}>
                    <Message message={message} user={user}/>
                </li>
            ))}
        </ol>
    );
}

export default ChatMessages;