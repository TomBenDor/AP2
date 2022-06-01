import './ContactsList.css'

const ContactsList = ({user, setUser, currentChatID, setCurrentChatID}) => {
    const selectChat = (chatID) => {
        setCurrentChatID(chatID);
        // Mark as read
        setUser({
            ...user, chats: Object.fromEntries(Object.entries(user.chats).map(([id, chat]) => {
                if (id === chatID) {
                    return [id, {...chat, "unreadMessages": 0}];
                }
                return [id, chat];
            }))
        });
    }

    // Copy the contacts array and sort it by time of last message
    const sortedChats = Object.entries(user.chats).slice().sort(([c1ID, c1], [c2ID, c2]) => {
        const a = c1.messages.length > 0 ? c1.messages.at(-1).created : 0;
        const b = c2.messages.length > 0 ? c2.messages.at(-1).created : 0;
        return Date.parse(b).valueOf() - Date.parse(a).valueOf();
    });

    return (
        <ol className="contacts-list">
            {sortedChats.map(([chatID, chat]) => (
                <ul key={chatID}
                    className={(currentChatID !== -1 && currentChatID === chatID) ? "contact active" : "contact"}
                    onClick={() => {
                        selectChat(chatID)
                    }}>
                    <span className="contact-meta-data">
                        {chat.unreadMessages > 0 &&
                            <div className="unread">
                                <span className="unread-count">{chat.unreadMessages}</span>
                            </div>
                        }
                        <div className="last-message-time">
                            <h6>
                                {(chat.messages.length) ? new Date(chat.messages.at(-1).created).toLocaleTimeString('en-US', {
                                    hourCycle: 'h23',
                                    hour: "numeric",
                                    minute: "numeric"
                                }) : ''}
                            </h6>
                        </div>
                    </span>
                    <span className="user-header">
                        <span className="profile-pic">
                            <img
                                src="media/profile_picture.png"
                                className="center" alt="profile-pic"/>
                        </span>
                        <span className="contact-info">
                            <div className="center">
                                <h6 className="contact-name">
                                    {chat.name}
                                </h6>
                                <h6 className="last-message-sent">
                                    {(chat.messages.length) ? chat.messages.at(-1).content : ''}
                                </h6>
                            </div>
                        </span>
                    </span>
                </ul>
            ))}
        </ol>
    );
}

export default ContactsList;