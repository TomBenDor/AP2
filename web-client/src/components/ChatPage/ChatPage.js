import ContactsSection from "./ContactsSection"
import ChatSection from "./ChatSection";
import "./ChatPage.css";

const ChatPage = (props) => {
    return (
        <div id="content-frame">
            <div className="chat-section">
                <ChatSection user={props.user} contacts={props.contacts} setContacts={props.setContacts}/>
            </div>
            <div className="contacts-section">
                <ContactsSection user={props.user} contacts={props.contacts} setContacts={props.setContacts}/>
            </div>
        </div>
    );
};

export default ChatPage;