import './ContactsList.css'

const ContactsList = (props) => {
    const selectContact = (contact) => {
        props.setCurrentContactId(contact.id);
        props.setContacts(props.contacts.map(c => {
            if (c.username === contact.username) {
                c.unreadMessages = 0;
            }
            return c;
        }));
    }

    // Copy the contacts array and sort it by time of last message
    const sortedContacts = props.contacts.slice().sort((c1, c2) => {
        const a = c1.messages.length > 0 ? c1.messages.at(-1).timestamp : 0;
        const b = c2.messages.length > 0 ? c2.messages.at(-1).timestamp : 0;
        return Date.parse(b).valueOf() - Date.parse(a).valueOf();
    });

    const lastMessageDict = {
        "image": <><i className="bi bi-image"/> Image </>,
        "video": <><i className="bi bi-film"/> Video </>,
        "audio": <><i className="bi bi-mic"/> Audio </>,
    };

    return (
        <ol className="contacts-list">
            {sortedContacts.map(contact => (
                <ul className={(props.currentContactId !== -1 && props.contacts[props.currentContactId].username === contact.username) ? "contact active" : "contact"}
                    key={contact.username} onClick={() => {
                    selectContact(contact)
                }}>
                    <span className="contact-meta-data">
                        {contact.unreadMessages > 0 &&
                            <div className="unread">
                                <span className="unread-count">{contact.unreadMessages}</span>
                            </div>
                        }
                        <div className="last-message-time">
                            <h6>
                                {(contact.messages.length) ? new Date(contact.messages.at(-1).timestamp).toLocaleTimeString('en-US', {
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
                                src={contact.profilePicture}
                                className="center" alt="profile-pic"/>
                        </span>
                        <span className="contact-info">
                            <div className="center">
                                <h6 className="contact-name">
                                    {contact.name}
                                </h6>
                                <h6 className="last-message-sent">
                                    {/* If last message sent is a text message, display its content. Else, display the right description */}
                                    {(contact.messages.length) ? (contact.messages.at(-1).type === "text" ? (contact.messages.at(-1).text) : (lastMessageDict[contact.messages.at(-1).type])) : ''}
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