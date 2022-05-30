import ContactsSection from "./ContactsSection"
import ChatSection from "./ChatSection";
import "./ChatPage.css";
import {useState} from "react";

const ChatPage = ({user, setUser, token, theme, setTheme}) => {
    const [currentChatID, setCurrentChatID] = useState(-1);
    // Create a cache for the messages the user has written to each contact
    const [messagesCache, setMessagesCache] = useState(Object.assign({}, ...Object.keys(user.chats).map((id) => {
        return {
            [id]: ""
        }
    })));

    return (
        <div id="content-frame">
            <div className="chat-section">
                <ChatSection user={user}
                             setUser={setUser}
                             token={token}
                             currentChatID={currentChatID}
                             messagesCache={messagesCache}
                             setMessagesCache={setMessagesCache}
                             theme={theme} setTheme={setTheme}
                />
            </div>
            <div className="contacts-section">
                <ContactsSection user={user}
                                 setUser={setUser}
                                 token={token}
                                 currentChatID={currentChatID}
                                 setCurrentChatID={setCurrentChatID}
                                 messagesCache={messagesCache}
                                 setMessagesCache={setMessagesCache}
                />
            </div>
        </div>
    );
};

export default ChatPage;