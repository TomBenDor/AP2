import './ContactsSection.css'
import ContactsList from "./ContactsList";
import {useRef, useState} from "react";

const ContactsSection = (props) => {
    const contactInput = useRef(null);
    const [profilePicture, setProfilePicture] = useState(props.user.profilePicture);

    const addContact = () => {
        const requestedContact = contactInput.current.value;
        if (requestedContact === "" || requestedContact === props.user.username) {
            return;
        }
        // Search for user in database
        const contactUser = props.users.find(user => user.username === requestedContact);
        
        if (contactUser) {
            const contact = {
                id: props.contacts.length,
                username: contactUser.username,
                name: contactUser.displayName,
                profilePicture: contactUser.profilePicture,
                unreadMessages: 0,
                messages: []
            }
            props.setContacts([...props.contacts, contact]);
        }
    };

    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
        setProfilePicture(reader.result);
    }, false);
    if (typeof props.user.profilePicture !== 'string') {
        reader.readAsDataURL(props.user.profilePicture);
    }
    return (
        <>
            <div className="contacts-section-header">
                <span className="user-header">
                    <span className="profile-pic">
                        <img
                            src={profilePicture}
                            className="center" alt="profile-pic"/>
                    </span>
                    <span className="user-header-title">
                        <div className="center">
                            {props.user.displayName}
                        </div>
                    </span>
                </span>
                <span className="contacts-section-header-controls">
                    <button className="add-contact-button center" data-bs-toggle="modal" data-bs-target="#myModal">
                        <i className="bi bi-person-plus"/>
                    </button>
                </span>
            </div>

            <div className="contacts">
                <ContactsList user={props.user}
                              contacts={props.contacts}
                              setContacts={props.setContacts}
                              currentContactId={props.currentContactId}
                              setCurrentContactId={props.setCurrentContactId}/>
            </div>

            <div className="modal" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Add Contact</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            Some input here
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Add</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactsSection;