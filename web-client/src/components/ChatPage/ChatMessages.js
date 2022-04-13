import {useState} from "react";
import Message from "./Message";
import "./ChatMessages.css"

const ChatMessages = () => {
    const [messages] = useState([
        {
            id: 1,
            sender: 'left',
            text: 'Hi, How are you?',
            timestamp: '12:00'
        },
        {
            id: 2,
            sender: 'right',
            text: 'I am awesome!',
            timestamp: '13:00'
        }
    ]);

    return (
        <ol className="messages-list">
            {messages.map(message => (
                <li key={message.id}>
                    <Message message={message}/>
                </li>
            ))}
        </ol>
    );
}

export default ChatMessages;