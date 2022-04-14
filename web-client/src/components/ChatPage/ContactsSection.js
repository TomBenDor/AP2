import './ContactsSection.css'
import ContactsList from "./ContactsList";
import {useState} from "react";

const ContactsSection = (props) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const openContactDialog = () => {
        console.log("openContactDialog");
    };

    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
        setProfilePicture(reader.result);
    }, false);
    reader.readAsDataURL(props.user.profilePicture);

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
                        <i className="bi bi-plus-circle"/>
                    </button>
                </span>
            </div>
            <div className="contacts">
                <ContactsList user={props.user}
                              contacts={props.contacts}
                              setContacts={props.setContacts}
                              currentContact={props.currentContact}
                              setCurrentContact={props.setCurrentContact}/>
            </div>
        </>
    );
}

export default ContactsSection;