import './ContactsList.css'

const ContactsList = (props) => {
    const selectContact = (contact) => {
        props.setCurrentContact(contact.id);
        props.setContacts(props.contacts.map(c => {
            if (c.username === contact.username) {
                c.unreadMessages = 0;
            }
            return c;
        }));
    }

    return (
        <ol className="contacts-list">
            {props.contacts.map(contact => (
                <ul className={(props.contacts[props.currentContact].username === contact.username) ? "contact active" : "contact"}
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
                                {(contact.messages.length) ? contact.messages.at(-1).timestamp : ''}
                            </h6>
                        </div>
                    </span>
                    <span className="user-header">
                        <span className="profile-pic">
                            <img
                                src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
                                className="center" alt="profile-pic"/>
                        </span>
                        <span className="contact-info">
                            <div className="center">
                                <h6 className="contact-name">
                                    {contact.name}
                                </h6>
                                <h6 className="last-message-sent">
                                    {(contact.messages.length) ? contact.messages.at(-1).text : ''}
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