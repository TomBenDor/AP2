import ContactsSection from "./ContactsSection"
import ChatSection from "./ChatSection";
import "./ChatPage.css";
import {useEffect, useState, useCallback} from "react";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {getContacts, getMessages} from "../Auth/SignIn/SignInForm";

const ChatPage = ({user, setUser, token, theme, setTheme}) => {
    const [currentChatID, setCurrentChatID] = useState(-1);
    const [hasToUpdate, setHasToUpdate] = useState(false);
    const [connection, setConnection] = useState(null);
    // Create a cache for the messages the user has written to each contact
    const [messagesCache, setMessagesCache] = useState(Object.assign({}, ...Object.keys(user.chats).map((id) => {
        return {
            [id]: ""
        }
    })));
    const updateAll = useCallback(async () => {
        if (hasToUpdate) {
            setHasToUpdate(false);
            const data1 = await getContacts(token);
            let chats = {};
            for (const chat of data1) {
                const messages = await getMessages(chat.id, token);
                // Add messages to chat
                chats[chat.id] = {
                    ...chat,
                    messages: messages
                };
                if (messagesCache[chat.id] === undefined) {
                    messagesCache[chat.id] = "";
                }
            }

            setUser({...user, chats: chats});
        }
    }, [token, user, setUser, hasToUpdate, messagesCache]);
    useEffect(() => {
        updateAll();
    }, [hasToUpdate, updateAll])

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl("https://localhost:54321/messageHub")
            .build();

        setConnection(connect);
    }, []);
    useEffect(() => {
        if (connection) {
            connection
                .start({withCredentials: false})
                .then(() => {
                    connection.on("MessageReceived", () => {
                        setHasToUpdate(true);
                    });
                })
        }
    }, [connection]);


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
                             connection={connection}/>
            </div>
            <div className="contacts-section">
                <ContactsSection user={user}
                                 setUser={setUser}
                                 token={token}
                                 currentChatID={currentChatID}
                                 setCurrentChatID={setCurrentChatID}
                                 messagesCache={messagesCache}
                                 setMessagesCache={setMessagesCache}
                                 connection={connection}/>
            </div>
        </div>
    );
};

export default ChatPage;