import {useRef, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const SignUpForm = ({users, setUsers, currentUser, setCurrentUser}) => {
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);
    const confirmPasswordBox = useRef(null);
    const displayNameBox = useRef(null);
    const profilePictureBox = useRef(null);

    const navigate = useNavigate();

    const [usernameValid, setUsernameValid] = useState(false);
    const [passwordFieldsValid, setPasswordFieldsValid] = useState(false);
    const [displayNameValid, setDisplayNameValid] = useState(false);
    const [profilePictureValid, setProfilePictureValid] = useState(false);

    // Check if all fields are empty
    const validateEmptyFields = () => {
        setUsernameValid(usernameBox.current.value !== "");
        setPasswordFieldsValid(passwordBox.current.value !== "" && confirmPasswordBox.current.value !== "");
        setDisplayNameValid(displayNameBox.current.value !== "");
        setProfilePictureValid(profilePictureBox.current.files.length !== 0);
    }

    // Validate username field and show appropriate error message
    const validateUsername = () => {
        let hasError = false;
        const username = usernameBox.current.value;

        // Clear username error message
        document.getElementById("floatingUsername").classList.remove("is-invalid");
        document.getElementById("username-label").classList.remove("text-danger");

        // Check if username is empty
        if (username === "") {
            hasError = true;
        }
        // Check if username is only letters, numbers and hyphens
        else if (!/^[a-zA-Z0-9-]+$/.test(username)) {
            document.getElementById("username-error").innerHTML = "Username can only contain letters, numbers and hyphens";
            document.getElementById("floatingUsername").classList.add("is-invalid");
            document.getElementById("username-label").classList.add("text-danger");
            hasError = true;
        }

        setUsernameValid(!hasError);
    }

    // Validate password fields and show appropriate error messages
    const validatePasswordFields = () => {
        let hasError = false;
        const password = passwordBox.current.value;
        const confirmPassword = confirmPasswordBox.current.value;

        // Clear password fields error messages
        document.getElementById("floatingPassword").classList.remove("is-invalid");
        document.getElementById("floatingConfirmedPassword").classList.remove("is-invalid");
        document.getElementById("password-label").classList.remove("text-danger");
        document.getElementById("password-confirmation-label").classList.remove("text-danger");

        // Check if password is at least 6 characters long
        if (password.length < 6) {
            document.getElementById("password-error").innerHTML = "Password must be at least 6 characters long";
            document.getElementById("floatingPassword").classList.add("is-invalid");
            document.getElementById("password-label").classList.add("text-danger");
            hasError = true;
        }
        // Check if password contains at least one number, one lowercase and one uppercase character
        else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            document.getElementById("password-error").innerHTML = "Password must contain at least one number, one lowercase and one uppercase character";
            document.getElementById("floatingPassword").classList.add("is-invalid");
            document.getElementById("password-label").classList.add("text-danger");
            hasError = true;
        }
        // Check if passwords match
        else if (password !== confirmPassword) {
            document.getElementById("password-confirmation-error").innerHTML = "Passwords do not match";
            document.getElementById("floatingConfirmedPassword").classList.add("is-invalid");
            document.getElementById("password-confirmation-label").classList.add("text-danger");
            hasError = true;
        }

        setPasswordFieldsValid(!hasError);
    }

    const validateDisplayName = () => {
        let hasError = false;
        const displayName = displayNameBox.current.value;

        // Clear display name error message
        document.getElementById("floatingDisplayName").classList.remove("is-invalid");
        document.getElementById("display-name-label").classList.remove("text-danger");

        // Check if display name is empty
        if (displayName === "") {
            hasError = true;
        }
        // Check if display name is only letters and spaces
        else if (!/^[a-zA-Z ]+$/.test(displayName)) {
            document.getElementById("display-name-error").innerHTML = "Display name can only contain letters and spaces";
            document.getElementById("floatingDisplayName").classList.add("is-invalid");
            document.getElementById("display-name-label").classList.add("text-danger");
            hasError = true;
        }

        setDisplayNameValid(!hasError);
    }


    const handleSignUp = (e) => {
        // Validate username, password and display name
        // If valid, create new user, sign him in and redirect to main page

        e.preventDefault();

        const username = usernameBox.current.value;
        const password = passwordBox.current.value;
        const displayName = displayNameBox.current.value;
        const profilePicture = profilePictureBox.current.files[0];

        validateEmptyFields();
        validateUsername();
        validatePasswordFields();
        // If one of the fields is not valid, disable the submit button and return
        if (!usernameValid || !passwordFieldsValid || !displayNameValid || !profilePictureValid) {
            document.getElementById("signup-button").disabled = true;
            return;
        }

        // Check if username is already taken
        const user = users.find(user => user.username === username);
        if (user) {
            // Display error message
            document.getElementById("username-error").innerHTML = "Username is already taken";
            document.getElementById("floatingUsername").classList.add("is-invalid");
            document.getElementById("username-label").classList.add("text-danger");
            return;
        }

        // Create new user
        const newUser = {
            "username": username,
            "password": password,
            "displayName": displayName,
            "profilePicture": profilePicture
        };
        // Add new user to users array
        setUsers([...users, newUser]);
        // Sign in user
        setCurrentUser(newUser);
    };

    useEffect(() => {
        // If user is signed in, redirect to main page.
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        // Check if all fields are valid, if not, disable submit button
        if (!usernameValid || !passwordFieldsValid || !displayNameValid || !profilePictureValid) {
            document.getElementById("sign-up-button").disabled = true;
        } else {
            document.getElementById("sign-up-button").disabled = false;
        }
    }, [usernameValid, passwordFieldsValid, displayNameValid, profilePictureValid]);

    return (
        <div id="form-frame">
            <h1 className="form-title">Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label htmlFor="floatingInput" className="form-help" id="username-label">Username</label>
                    <input ref={usernameBox} className="form-control" type="text" id="floatingUsername"
                           onChange={() => {
                               validateEmptyFields();
                               validateUsername()
                           }} required/>
                    <label className="invalid-feedback" id="username-error">Invalid</label>
                </div>
                <div className="form-group">
                    <label htmlFor="floatingPassword" className="form-help" id="password-label">Password</label>
                    <input ref={passwordBox} className="form-control" type="password" id="floatingPassword"
                           onChange={() => {
                               validateEmptyFields();
                               validatePasswordFields()
                           }} required/>
                    <label className="invalid-feedback" id="password-error">Invalid</label>
                </div>
                <div className="form-group">
                    <label htmlFor="floatingConfirmedPassword" className="form-help" id="password-confirmation-label">Confirm
                        password</label>
                    <input ref={confirmPasswordBox} className="form-control" type="password"
                           id="floatingConfirmedPassword"
                           onChange={() => {
                               validateEmptyFields();
                               validatePasswordFields()
                           }} required/>
                    <label className="invalid-feedback" id="password-confirmation-error">Invalid</label>
                </div>
                <div className="form-group">
                    <label htmlFor="floatingInput" className="form-help" id="display-name-label">Display name</label>
                    <input ref={displayNameBox} className="form-control" type="text" id="floatingDisplayName"
                           onChange={() => {
                               validateEmptyFields();
                               validateDisplayName()
                           }} required/>
                    <label className="invalid-feedback" id="display-name-error">Invalid</label>
                </div>
                <div>
                    <label htmlFor="floatingProfilePicture" className="form-help">Profile picture</label>
                    <input ref={profilePictureBox} className="form-control" type="file" id="floatingProfilePicture"
                           onChange={validateEmptyFields} required accept="image/*"/>
                </div>
                <button type="submit" className="submit-button" id="sign-up-button" disabled>SIGN UP</button>
            </form>
            <p className="form-question">Have an account already? <Link to={"/signin"}>Sign in</Link></p>
        </div>
    )
};

export default SignUpForm;