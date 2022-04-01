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
    };


    useEffect(() => {
        // If user is signed in, redirect to main page.
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    return (
        <div id="form-frame">
            <h1 className="form-title">Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label htmlFor="floatingInput">Username</label>
                    <input ref={usernameBox} className="form-control" type="text" id="floatingUsername"  required />
                </div>
                <div className="form-group">
                    <label htmlFor="floatingPassword">Password</label>
                    <input ref={passwordBox} className="form-control" type="password" id="floatingPassword"  required />
                </div>
                <div className="form-group">
                    <label htmlFor="floatingConfirmedPassword">Confirm password</label>
                    <input ref={confirmPasswordBox} className="form-control" type="password" id="floatingConfirmedPassword" required />
                </div>
                <div className="form-group">
                    <label htmlFor="floatingInput">Display name</label>
                    <input ref={displayNameBox} className="form-control" type="text" id="floatingDisplayName" required />
                </div>
                <div>
                    <label htmlFor="floatingProfilePicture">Profile picture</label>
                    <input ref={profilePictureBox} className="form-control" type="file" id="floatingProfilePicture" required />
                </div>
                <button type="submit" className="submit-button">SIGN UP</button>
            </form>
            <p className="form-question">Have an account already? <Link to={"/signin"}>Sign in</Link></p>
        </div>
    )
};

export default SignUpForm;