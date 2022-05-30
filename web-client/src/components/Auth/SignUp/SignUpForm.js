import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "./SignUpForm.css";
import "../auth.css";
import {signIn} from "../SignIn/SignInForm";

const SignUpForm = ({user, setUser}) => {
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);
    const passwordConfirmationBox = useRef(null);
    const displayNameBox = useRef(null);

    const navigate = useNavigate();

    const [usernameFieldValid, setUsernameFieldValid] = useState(false);
    const [passwordFieldValid, setPasswordFieldValid] = useState(false);
    const [passwordConfirmationFieldValid, setPasswordConfirmationFieldValid] = useState(false);
    const [displayNameValid, setDisplayNameFieldValid] = useState(false);
    const [typeInConfirmation, setTypeInConfirmation] = useState(false);


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
        // If didn't type in confirmation field, don't validate
        if (!typeInConfirmation) {
            return;
        }

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

    const handleSignUp = async (e) => {
        // Validate username, password and display name
        // If valid, create new user, sign him in and redirect to main page

        e.preventDefault();

        const username = usernameBox.current.value;
        const password = passwordBox.current.value;
        const displayName = displayNameBox.current.value;

        // Create new user
        const newUser = {
            "username": username,
            "password": password,
            "confirmPassword": password,
            "name": displayName,
        };
        // Sign up user
        const response = await fetch("https://localhost:7090/api/contacts/signup", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify(newUser)
        });
        if (response.ok) {
            const user = await signIn(username, password, setUser);
            if (user) {
                setUser(user);
                navigate("/");
            } else {
                // Show error messages
                document.getElementById("floatingUsername").classList.add("is-invalid");
                document.getElementById("username-label").classList.add("text-danger");
                // Disable submit button
                document.getElementById("sign-in-button").disabled = true;
            }
        } else {
            // Since the server returns a 400 error, we can assume that the username is already taken

            document.getElementById("username-error").innerHTML = "Username is already taken";
            document.getElementById("floatingUsername").classList.add("is-invalid");
            document.getElementById("username-label").classList.add("text-danger");
            setUsernameFieldValid(false);
        }
    }

    useEffect(() => {
        // Check if all fields are valid, if not, disable submit button
        document.getElementById("sign-up-button").disabled = !usernameFieldValid || !passwordFieldValid || !passwordConfirmationFieldValid || !displayNameValid;
    }, [usernameFieldValid, passwordFieldValid, passwordConfirmationFieldValid, displayNameValid]);

    return (<div id="form-frame">
        <h1 className="form-title">Sign Up</h1>
        <form onSubmit={handleSignUp}>
            <div className="form-group">
                <label htmlFor="floatingInput" className="form-help" id="username-label">Username</label>
                <input ref={usernameBox} className="form-control" type="text" id="floatingUsername"
                       onChange={validateUsername} onKeyPress={enforceUsernameRegEx} onBlur={clearUsernameError}
                       maxLength="30" required/>
                <label className="invalid-feedback" id="username-error">Invalid</label>
            </div>
            <div className="form-group">
                <label htmlFor="floatingPassword" className="form-help" id="password-label">Password</label>
                <input ref={passwordBox} className="form-control" type="password" id="floatingPassword"
                       onChange={() => {
                           validatePasswordField();
                           validatePasswordConfirmation();
                       }} maxLength="30" required/>
                <label className="invalid-feedback" id="password-error">Invalid</label>
            </div>
            <div className="form-group">
                <label htmlFor="floatingConfirmedPassword" className="form-help" id="password-confirmation-label">Confirm
                    password</label>
                <input ref={passwordConfirmationBox} className="form-control" type="password"
                       id="floatingConfirmedPassword" maxLength="30" required
                       onChange={() => {
                           setTypeInConfirmation(true);
                           validatePasswordConfirmation();
                       }}/>
                <label className="invalid-feedback" id="password-confirmation-error">Invalid</label>
            </div>
            <div className="form-group">
                <label htmlFor="floatingInput" className="form-help" id="display-name-label">Display name</label>
                <input ref={displayNameBox} className="form-control" type="text" id="floatingDisplayName"
                       onChange={validateDisplayName} onKeyPress={enforceDisplayNameRegEx}
                       onBlur={clearDisplayNameError} maxLength="30" required/>

                <label className="invalid-feedback" id="display-name-error">Invalid</label>
            </div>
            <button type="submit" className="submit-button" id="sign-up-button" disabled>SIGN UP</button>
        </form>
        <p className="form-question">Have an account already? <Link to={"/signin"}>Sign in</Link></p>
    </div>)
};

export default SignUpForm;