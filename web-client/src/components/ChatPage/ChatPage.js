import ContactsSection from "./ContactsSection"
import ChatSection from "./ChatSection";
import "./ChatPage.css";

const ChatPage = ({user}) => {
    return (
        <div id="content-frame">
            <div className="chat-section">
                <ChatSection/>
            </div>
            <div className="contacts-section">
                <ContactsSection user={user}/>
            </div>
        </div>
    );
};

export default ChatPage;