import './ContactsSection.css'
import ContactsList from "./ContactsList";
import {useEffect, useRef} from "react";

const ContactsSection = ({
                             user,
                             setUser,
                             currentChatID,
                             setCurrentChatID,
                             messagesCache,
                             setMessagesCache,
                             token
                         }) => {
    const contactUsernameInput = useRef(null);
    const contactNameInput = useRef(null);
    const contactServerInput = useRef(null);
    useEffect(() => {
        const contactModal = document.getElementById("addContactModal");
        contactModal.addEventListener("hidden.bs.modal", () => {
            contactUsernameInput.current.value = "";
            document.getElementById("add-contact-input").classList.remove("is-invalid");
            contactNameInput.current.value = "";
            document.getElementById("contact-name-input").classList.remove("is-invalid");
            contactServerInput.current.value = "";
            document.getElementById("contact-server-input").classList.remove("is-invalid");
        });
    }, []);

    const addContact = async (e) => {
        e.preventDefault()
        document.getElementById("add-contact-input").classList.remove("is-invalid");
        let hasError = false;
        const requestedContact = contactUsernameInput.current.value.trim();
        if (requestedContact === "") {
            document.getElementById("add-contact-error").innerHTML = "Contact name cannot be empty";
            hasError = true;
        } else if (requestedContact === user.username) {
            document.getElementById("add-contact-error").innerHTML = "You can't add yourself";
            hasError = true;
        } else if (Object.values(user.chats).find(chat => chat.type === "one-to-one" && chat.members.includes(requestedContact))) {
            document.getElementById("add-contact-error").innerHTML = "This contact is already in your list";
            hasError = true;
        }

        if (hasError) {
            document.getElementById("add-contact-input").classList.add("is-invalid");
            return;
        }
        const contact = {
            "id": contactUsernameInput.current.value,
            "name": contactNameInput.current.value,
            "server": contactServerInput.current.value
        };

        // Search for user in database
        const contactUser = await fetch('https://localhost:7090/api/contacts', {
            method: "POST", headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
                'Accept': 'application/json',
            }, body: JSON.stringify(contact)
        });
        if (!contactUser.ok) {
            //get body of contactUser
            const contactUserBody = await contactUser.json();
            if (contactUserBody === "Could not find remote server") {
                document.getElementById("add-contact-server-error").innerHTML = contactUserBody;
                document.getElementById("contact-server-input").classList.add("is-invalid");
            } else {
                document.getElementById("add-contact-error").innerHTML = contactUserBody;
                document.getElementById("add-contact-input").classList.add("is-invalid");
            }
            return;
        }

        if (contactUser) {
            // Generate chat id
            const chatID = `${user.username}-${requestedContact}`;
            const chat = {
                type: "one-to-one",
                members: [user.username, requestedContact],
                messages: []
            }
            setUser(u => ({
                ...u,
                chats: {...u.chats, [chatID]: {...chat, "unreadMessages": 0}}
            }));


            setMessagesCache({
                ...messagesCache, [chatID]: ""
            });
            // Clear input field
            contactUsernameInput.current.value = "";
            // Close modal
            document.getElementById("close-modal-button").click();
        } else {
            document.getElementById("add-contact-input").classList.add("is-invalid");
            document.getElementById("add-contact-error").innerHTML = "User not found";
        }
    };
    const handleKeyPress = (e) => {
        document.getElementById("add-contact-input").classList.remove("is-invalid");
        // If user presses enter, add contact
        if (e.key === "Enter") {
            addContact(e);
            return;
        }
        //Prevent user from entering invalid characters
        if (!/[a-zA-Z0-9-]$/.test(e.key)) {
            document.getElementById("add-contact-error").innerHTML = "Username must contain only letters, numbers, and hyphens";
            document.getElementById("add-contact-input").classList.add("is-invalid");
            e.preventDefault();
        }
    }
    // Clear error message on change
    const clearUsernameError = () => {
        document.getElementById("add-contact-input").classList.remove("is-invalid");
        document.getElementById("add-contact-error").innerHTML = "";
    }

    return (
        <>
            <div className="contacts-section-header">
                <span className="user-header">
                    <span className="profile-pic">
                        <img
                            src="media/profile_picture.png"
                            className="center" alt="profile-pic"/>
                    </span>
                    <span className="user-header-title">
                        <div className="center">
                            {user.name}
                        </div>
                    </span>
                </span>
                <span className="buttons">
                    <button className="icon-button center" data-bs-toggle="modal" data-bs-target="#addContactModal">
                        <i className="bi bi-person-plus"/>
                    </button>
                </span>
            </div>

            <div className="contacts">
                <ContactsList user={user} setUser={setUser} currentChatID={currentChatID}
                              setCurrentChatID={setCurrentChatID}/>
            </div>

            <div className="modal fade" id="addContactModal">
                <div className="modal-dialog">
                    <div className="modal-content add-contact-popup">
                        <div className="modal-header">
                            <h4 className="modal-title">Add Contact</h4>
                            <button type="button" className="close-button" data-bs-dismiss="modal"
                                    id="close-modal-button">
                                <i className="bi bi-x"/>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="floatingInput" className="form-help"
                                       id="username-label">username</label>
                                <input type="text" ref={contactUsernameInput} className="add-contact-input form-control"
                                       id="add-contact-input" onKeyPress={handleKeyPress}
                                       onChange={clearUsernameError}/>
                                <label className="invalid-feedback" id="add-contact-error"/>
                                <label htmlFor="floatingInput" className="form-help" id="username-label">display
                                    name</label>
                                <input type="text" ref={contactNameInput} className="add-contact-input form-control"
                                       id="contact-name-input"/>
                                <label className="invalid-feedback" id="add-contact-name-error"/>
                                <label htmlFor="floatingInput" className="form-help" id="username-label">server</label>
                                <input type="text" ref={contactServerInput} className="add-contact-input form-control"
                                       id="contact-server-input"/>
                                <label className="invalid-feedback" id="add-contact-server-error"/>

                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="icon-button" onClick={addContact}>
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