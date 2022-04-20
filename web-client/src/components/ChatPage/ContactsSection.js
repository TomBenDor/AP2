import './ContactsSection.css'
import ContactsList from "./ContactsList";
import {useRef, useState} from "react";

const ContactsSection = (props) => {
    const contactInput = useRef(null);
    const [profilePicture, setProfilePicture] = useState(props.user.profilePicture);

    const addContact = () => {
        document.getElementById("add-contact-input").classList.remove("is-invalid");
        const requestedContact = contactInput.current.value;
        if (requestedContact === "") {
            document.getElementById("add-contact-input").classList.add("is-invalid");
            document.getElementById("add-contact-error").innerHTML = "Contact name cannot be empty";
            return;
        }
        if (requestedContact === props.user.username) {
            document.getElementById("add-contact-input").classList.add("is-invalid");
            document.getElementById("add-contact-error").innerHTML = "You can't add yourself";
            return;
        }

        if (props.contacts.find(contact => contact.username === requestedContact)) {
            document.getElementById("add-contact-input").classList.add("is-invalid");
            document.getElementById("add-contact-error").innerHTML = "This contact is already in your list";
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
        } else {
            document.getElementById("add-contact-input").classList.add("is-invalid");
            document.getElementById("add-contact-error").innerHTML = "User not found";
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

            <div className="modal fade" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add Contact</h4>
                            <button type="button" className="close-button" data-bs-dismiss="modal"
                                    onClick={() => {
                                        contactInput.current.value = "";
                                        document.getElementById("add-contact-input").classList.remove("is-invalid");
                                    }}>
                                <i className="bi bi-x"/>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <input type="text" ref={contactInput} className="add-contact-input form-control"
                                       id="add-contact-input"/>
                                <label className="invalid-feedback" id="add-contact-error"/>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="add-contact-button" onClick={addContact}>
                                <i className="bi bi-plus-circle"/>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactsSection;