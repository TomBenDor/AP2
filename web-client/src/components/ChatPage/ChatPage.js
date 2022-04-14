import ContactsSection from "./ContactsSection"
import ChatSection from "./ChatSection";
import "./ChatPage.css";
import {useState} from "react";

const ChatPage = (props) => {
    const [currentContact, setCurrentContact] = useState(0);

    return (
        <div id="content-frame">
            <div className="chat-section">
                <ChatSection user={props.user}
                             contacts={props.contacts}
                             setContacts={props.setContacts}
                             currentContact={currentContact}/>
            </div>
            <div className="contacts-section">
                <ContactsSection user={props.user}
                                 contacts={props.contacts}
                                 setContacts={props.setContacts}
                                 currentContact={currentContact}
                                 setCurrentContact={setCurrentContact}/>
            </div>
        </div>
    );
};

export default ChatPage;