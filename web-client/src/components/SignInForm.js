import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignInForm = ({ users, currentUser, setCurrentUser }) => {
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        // Validate username and password
        // If valid, sign in user and redirect to main page

        e.preventDefault();

        const username = usernameBox.current.value;
        const password = passwordBox.current.value;
        // Check if username and password are empty
        if (username === "" || password === "") {
            console.log("Please enter a username and password");
            return;
        }

        // Check if username and password are valid
        const user = users.find(user => user.username === username && user.password === password);
        // If a valid user was found
        if (user) {
            // Sign in user
            setCurrentUser({ "username": username, "displayName": user.displayName, "profilePicture": user.profilePicture });
            // Redirect to main page
            navigate("/");
        } else {
            // Show error message
            console.log("Invalid username or password");
        }
    };

    useEffect(() => {
        // If user is signed in, redirect to main page.
        if (currentUser) {
            navigate("/");
        }
    }, []);

    return (
        <>
            <h1>Sign In Form</h1>
            <form onSubmit={handleSignIn}>
                <div>
                    <label htmlFor="floatingInput">Username:</label>
                    <input ref={usernameBox} type="text" id="floatingUsername" placeholder="Username" required />
                </div>
                <div>
                    <label htmlFor="floatingPassword">Password:</label>
                    <input ref={passwordBox} type="password" id="floatingPassword" placeholder="Password" required />
                </div>
                <button type="submit">Sign in</button>
            </form>
            <span>
                Don't have an account? <Link to={"/signup"}>Sign up</Link>
            </span>
        </>
    )
};

export default SignInForm;