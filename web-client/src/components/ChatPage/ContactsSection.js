import './ContactsSection.css'
import ContactsList from "./ContactsList";

const ContactsSection = (props) => {
    const openContactDialog = () => {
        console.log("openContactDialog");
    };

    return (
        <>
            <div className="contacts-section-header">
                <span className="user-header">
                    <span className="profile-pic">
                        <img
                            src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
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