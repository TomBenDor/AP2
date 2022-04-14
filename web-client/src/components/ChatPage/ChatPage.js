import ContactsSection from "./ContactsSection"
import ChatSection from "./ChatSection";
import "./ChatPage.css";
import {useState} from "react";

const ChatPage = (props) => {
    const [currentContactId, setCurrentContactId] = useState(-1);

    return (
        <div id="content-frame">
            <div className="chat-section">
                <ChatSection user={props.user}
                             contacts={props.contacts}
                             setContacts={props.setContacts}
                             currentContactId={currentContactId}/>
            </div>
            <div className="contacts-section">
                <ContactsSection user={props.user}
                                 contacts={props.contacts}
                                 setContacts={props.setContacts}
                                 currentContactId={currentContactId}
                                 setCurrentContactId={setCurrentContactId}/>
            </div>
        </div>
    );
};

export default ChatPage;