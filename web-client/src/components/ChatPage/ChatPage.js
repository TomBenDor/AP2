import ContactsSection from "./ContactsSection"
import ChatSection from "./ChatSection";
import "./ChatPage.css";
import {useState} from "react";

const ChatPage = (props) => {
    const [currentContactId, setCurrentContactId] = useState(-1);
    // Create a cache for the messages the user has written to each contact
    const [messagesCache, setMessagesCache] = useState(Object.assign({}, ...props.contacts.map(c => c.id).map((id) => {
        return {
            [id]: ""
        }
    })));
    return (
        <div id="content-frame">
            <div className="chat-section">
                <ChatSection user={props.user}
                             contacts={props.contacts}
                             setContacts={props.setContacts}
                             currentContactId={currentContactId}
                             messagesCache={messagesCache}
                             setMessagesCache={setMessagesCache}
                />
            </div>
            <div className="contacts-section">
                <ContactsSection user={props.user}
                                 contacts={props.contacts}
                                 setContacts={props.setContacts}
                                 currentContactId={currentContactId}
                                 setCurrentContactId={setCurrentContactId}
                                 users={props.users}
                                 messagesCache={messagesCache}
                                 setMessagesCache={setMessagesCache}
                />
            </div>
        </div>
    );
};

export default ChatPage;