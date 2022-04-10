import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const SignUpForm = ({users, setUsers, currentUser, setCurrentUser}) => {
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);
    const passwordConfirmationBox = useRef(null);
    const displayNameBox = useRef(null);
    const profilePictureBox = useRef(null);

    const navigate = useNavigate();

    const [usernameFieldValid, setUsernameFieldValid] = useState(false);
    const [passwordFieldValid, setPasswordFieldValid] = useState(false);
    const [passwordConfirmationFieldValid, setPasswordConfirmationFieldValid] = useState(false);
    const [displayNameValid, setDisplayNameFieldValid] = useState(false);
    const [profilePictureValid, setProfilePictureValid] = useState(false);

    // Check if all fields are empty
    const validateProfilePicture = () => {
        setProfilePictureValid(profilePictureBox.current.files.length !== 0);
    }

    // Prevent user from entering invalid characters
    const enforceUsernameRegEx = (e) => {
        document.getElementById("floatingUsername").classList.remove("is-invalid");
        document.getElementById("floatingUsername").classList.remove("text-danger");
        if (!/[a-zA-Z0-9-]$/.test(e.key)) {
            document.getElementById("username-error").innerHTML = "Username must contain only letters, numbers, and hyphens";
            document.getElementById("floatingUsername").classList.add("is-invalid");
            document.getElementById("username-label").classList.add("text-danger");
            e.preventDefault();
        }
    }

    // Clear error messages when user switches focus
    const clearUsernameError = () => {
        if (document.getElementById("username-error").innerHTML === "Username must contain only letters, numbers, and hyphens") {
            document.getElementById("floatingUsername").classList.remove("is-invalid");
            document.getElementById("username-label").classList.remove("text-danger");
            validateUsername();
        }
    }


    const validateUsername = () => {
        let hasError = false;
        const username = usernameBox.current.value;

        // Clear error message
        document.getElementById("floatingUsername").classList.remove("is-invalid");
        document.getElementById("username-label").classList.remove("text-danger");

        // Check if username length is less than 3
        if (username.length < 3) {
            document.getElementById("username-error").innerHTML = "Username must be at least 3 characters long";
            document.getElementById("floatingUsername").classList.add("is-invalid");
            document.getElementById("username-label").classList.add("text-danger");
            hasError = true;
        }
        setUsernameFieldValid(!hasError);
    }

    // Validate password fields and show appropriate error messages
    const validatePasswordField = () => {
        let hasError = false;
        const password = passwordBox.current.value;

        // Clear password fields error messages
        document.getElementById("floatingPassword").classList.remove("is-invalid");
        document.getElementById("password-label").classList.remove("text-danger");

        // Check if password is at least 6 characters long
        if (password.length < 6) {
            document.getElementById("password-error").innerHTML = "Password must be at least 6 characters long";
            hasError = true;
        }
        // Check if password contains at least one number, one lowercase and one uppercase character
        else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            document.getElementById("password-error").innerHTML = "Password must contain at least one number, one lowercase and one uppercase character";
            hasError = true;
        }

        if (hasError) {
            document.getElementById("floatingPassword").classList.add("is-invalid");
            document.getElementById("password-label").classList.add("text-danger");
        }

        setPasswordFieldValid(!hasError);
    }

    const validatePasswordConfirmation = () => {
        let hasError = false;
        const password = passwordBox.current.value;
        const passwordConfirmation = passwordConfirmationBox.current.value;

        // Clear password confirmation fields error messages
        document.getElementById("floatingConfirmedPassword").classList.remove("is-invalid");
        document.getElementById("password-confirmation-label").classList.remove("text-danger");

        // Check if password and password confirmation match
        if (password !== passwordConfirmation) {
            document.getElementById("password-confirmation-error").innerHTML = "Password confirmation doesn't match";
            hasError = true;
        }

        if (hasError) {
            document.getElementById("floatingConfirmedPassword").classList.add("is-invalid");
            document.getElementById("password-confirmation-label").classList.add("text-danger");
        }

        setPasswordConfirmationFieldValid(!hasError);
    }

    // Prevent user from entering invalid characters
    const enforceDisplayNameRegEx = (e) => {
        document.getElementById("floatingDisplayName").classList.remove("is-invalid");
        document.getElementById("floatingDisplayName").classList.remove("text-danger");
        if (!/[a-zA-Z '\-.,]$/.test(e.key)) {
            document.getElementById("floatingDisplayName").classList.add("is-invalid");
            document.getElementById("display-name-label").classList.add("text-danger");
            document.getElementById("display-name-error").innerHTML = "Display name can only contain letters, spaces, hyphens, periods, dots, and commas";
            e.preventDefault();
        }
    }

    const validateDisplayName = () => {
        let hasError = false;
        const displayName = displayNameBox.current.value;

        // Clear error message
        document.getElementById("floatingDisplayName").classList.remove("is-invalid");
        document.getElementById("display-name-label").classList.remove("text-danger");

        // Check if username length is less than 3
        if (displayName.length < 3) {
            document.getElementById("display-name-error").innerHTML = "Display name must be at least 3 characters long";
            hasError = true;
        }

        if (hasError) {
            document.getElementById("floatingDisplayName").classList.add("is-invalid");
            document.getElementById("display-name-label").classList.add("text-danger");
        }

        setDisplayNameFieldValid(!hasError);
    }

    // Clear error messages when user switches focus
    const clearDisplayNameError = () => {
        if (document.getElementById("display-name-error").innerHTML === "Display name can only contain letters, spaces, hyphens, periods, dots, and commas") {
            document.getElementById("floatingDisplayName").classList.remove("is-invalid");
            document.getElementById("display-name-label").classList.remove("text-danger");
            validateDisplayName();
        }
    }

    const handleSignUp = (e) => {
        // Validate username, password and display name
        // If valid, create new user, sign him in and redirect to main page

        e.preventDefault();

        const username = usernameBox.current.value;
        const password = passwordBox.current.value;
        const displayName = displayNameBox.current.value;
        const profilePicture = profilePictureBox.current.files[0];

        // Check if username is already taken
        const user = users.find(user => user.username === username);
        if (user) {
            // Display error message
            document.getElementById("username-error").innerHTML = "Username is already taken";
            document.getElementById("floatingUsername").classList.add("is-invalid");
            document.getElementById("username-label").classList.add("text-danger");
            setUsernameFieldValid(false);
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
        document.getElementById("sign-up-button").disabled = !usernameFieldValid || !passwordFieldValid || !passwordConfirmationFieldValid || !displayNameValid || !profilePictureValid;
    }, [usernameFieldValid, passwordFieldValid, passwordConfirmationFieldValid, displayNameValid, profilePictureValid]);

    return (
        <div id="form-frame">
            <h1 className="form-title">Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label htmlFor="floatingInput" className="form-help" id="username-label">Username</label>
                    <input ref={usernameBox} className="form-control" type="text" id="floatingUsername"
                           onChange={validateUsername} onKeyPress={enforceUsernameRegEx} onBlur={clearUsernameError} maxLength="30" required/>
                    <label className="invalid-feedback" id="username-error">Invalid</label>
                </div>
                <div className="form-group">
                    <label htmlFor="floatingPassword" className="form-help" id="password-label">Password</label>
                    <input ref={passwordBox} className="form-control" type="password" id="floatingPassword"
                           onChange={validatePasswordField} maxLength="30" required/>
                    <label className="invalid-feedback" id="password-error">Invalid</label>
                </div>
                <div className="form-group">
                    <label htmlFor="floatingConfirmedPassword" className="form-help" id="password-confirmation-label">Confirm
                        password</label>
                    <input ref={passwordConfirmationBox} className="form-control" type="password"
                           id="floatingConfirmedPassword"
                           onChange={validatePasswordConfirmation} maxLength="30" required/>
                    <label className="invalid-feedback" id="password-confirmation-error">Invalid</label>
                </div>
                <div className="form-group">
                    <label htmlFor="floatingInput" className="form-help" id="display-name-label">Display name</label>
                    <input ref={displayNameBox} className="form-control" type="text" id="floatingDisplayName"
                           onChange={validateDisplayName} onKeyPress={enforceDisplayNameRegEx} onBlur={clearDisplayNameError} maxLength="30" required/>

                    <label className="invalid-feedback" id="display-name-error">Invalid</label>
                </div>
                <div>
                    <label htmlFor="floatingProfilePicture" className="form-help">Profile picture</label>
                    <input ref={profilePictureBox} className="form-control" type="file" id="floatingProfilePicture"
                           onChange={validateProfilePicture} required accept="image/*"/>
                </div>
                <button type="submit" className="submit-button" id="sign-up-button" disabled>SIGN UP</button>
            </form>
            <p className="form-question">Have an account already? <Link to={"/signin"}>Sign in</Link></p>
        </div>
    )
};

export default SignUpForm;