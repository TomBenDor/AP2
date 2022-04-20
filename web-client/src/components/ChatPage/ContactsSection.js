import './ContactsSection.css'
import ContactsList from "./ContactsList";
import {useRef, useState} from "react";

const ContactsSection = (props) => {
    const [showInput, setShowInput] = useState(false);
    const contactInput = useRef(null);
    const [profilePicture, setProfilePicture] = useState(props.user.profilePicture);
    const openContactDialog = () => {
        setShowInput(!showInput);
    };
    const ContactDialog = () => {
        return (<div>
            <input type="text" ref={contactInput}/>
            <button className="btn btn-primary" onClick={addContact}>add contact</button>
        </div>)
    }
    const addContact = () => {
        const contactUser = props.users.find(user => user.username === contactInput.current.value);
        if(contactUser.username===props.user.username){
            return;
        }
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
                    <button className="add-contact-button" onClick={openContactDialog}>
                        <i className="bi bi-person-plus"/>
                    </button>
                </span>
            </div>
            {showInput ? <ContactDialog/> : null}

            <div className="contacts">
                <ContactsList user={props.user}
                              contacts={props.contacts}
                              setContacts={props.setContacts}
                              currentContactId={props.currentContactId}
                              setCurrentContactId={props.setCurrentContactId}/>
            </div>
        </>
    );
}

export default ContactsSection;