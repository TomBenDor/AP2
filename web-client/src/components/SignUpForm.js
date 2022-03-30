import { useRef } from "react";
import { Link } from 'react-router-dom';

const SignUpForm = () => {
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);
    const confirmPasswordBox = useRef(null);
    const displayNameBox = useRef(null);
    const profilePictureBox = useRef(null);

    const handleSignUp = (e) => {
        // Validate username, password and display name
        // If valid, create new user, sign him in and redirect to main page

        e.preventDefault();

        let currentUsername = usernameBox.current.value;
        let currentPassword = passwordBox.current.value;
        let currentDisplayName = displayNameBox.current.value;
    };

    return (
        <>
            <h1>Sign Up Form</h1>
            <form onSubmit={handleSignUp}>
                <div>
                    <label htmlFor="floatingInput">Username:</label>
                    <input ref={usernameBox} type="text" id="floatingUsername" placeholder="Username" required />
                </div>
                <div>
                    <label htmlFor="floatingPassword">Password:</label>
                    <input ref={passwordBox} type="password" id="floatingPassword" placeholder="Password" required />
                </div>
                <div>
                    <label htmlFor="floatingConfirmedPassword">Confirm password:</label>
                    <input ref={confirmPasswordBox} type="password" id="floatingConfirmedPassword" placeholder="Confirm password" required />
                </div>
                <div>
                    <label htmlFor="floatingInput">Display name:</label>
                    <input ref={displayNameBox} type="text" id="floatingDisplayName" placeholder="Display name" required />
                </div>
                <div>
                    <label htmlFor="floatingProfilePicture">Upload a profile picture:</label>
                    <input ref={profilePictureBox} type="file" id="floatingProfilePicture" required />
                </div>
                <button type="submit">Sign up</button>
            </form>
            <span>
                Have an account already? <Link to={"/signin"}>Sign in</Link>
            </span>
        </>
    )
};

export default SignUpForm;