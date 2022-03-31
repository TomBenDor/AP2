import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpForm = ({ users, setUsers, currentUser, setCurrentUser }) => {
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);
    const confirmPasswordBox = useRef(null);
    const displayNameBox = useRef(null);
    const profilePictureBox = useRef(null);

    const navigate = useNavigate();

    const handleSignUp = (e) => {
        // Validate username, password and display name
        // If valid, create new user, sign him in and redirect to main page

        e.preventDefault();

        const username = usernameBox.current.value;
        const password = passwordBox.current.value;
        const confirmPassword = confirmPasswordBox.current.value;
        const displayName = displayNameBox.current.value;
        const profilePicture = profilePictureBox.current.value;

        // Check if all fields are filled
        if (username === "" || password === "" || confirmPassword === "" || displayName === "" || profilePicture === "") {
            console.log("Please fill in all fields");
            return;
        }
        // Check if passwords match
        if (password !== confirmPassword) {
            console.log("Passwords don't match");
            return;
        }
        // Check if password is at least 6 characters long
        if (password.length < 6) {
            console.log("Password must be at least 6 characters long");
            return;
        }
        // Check if password contains at least one number, one lowercase and one uppercase character
        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            console.log("Password must contain at least one number, one lowercase and one uppercase character");
            return;
        }
        // Check if username is already taken
        const user = users.find(user => user.username === username);
        if (user) {
            console.log("Username is already taken");
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
        // Redirect to main page
        navigate("/");
    };


    useEffect(() => {
        // If user is signed in, redirect to main page.
        if (currentUser) {
            navigate("/");
        }
    }, []);

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