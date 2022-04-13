import {useState} from "react";
import './ContactsList.css'

const ContactsList = (props) => {
    const [currentContact, setCurrentContact] = useState(null);

    const selectContact = (username) => {
        setCurrentContact(username);
        props.setContacts(props.contacts.map(c => {
            if (c.username === username) {
                c.unreadMessages = 0;
            }
            return c;
        }));
    }

    return (
        <ol className="contacts-list">
            {props.contacts.map(contact => (
                <ul className={(currentContact === contact.username) ? "contact active" : "contact"}
                    key={contact.username} onClick={() => {
                    selectContact(contact.username)
                }}>
                    <span className="contact-meta-data">
                        {contact.unreadMessages > 0 &&
                            <div className="unread">
                                <span className="unread-count">{contact.unreadMessages}</span>
                            </div>
                        }
                        <div className="last-message-time">
                            <h6>{contact.lastMessageTime}</h6>
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
                                    {contact.lastMessage}
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