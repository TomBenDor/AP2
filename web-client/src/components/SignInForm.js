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
    }, [currentUser, navigate]);

    return (
        <div id="form-frame">
            <h1 className="form-title">Sign In</h1>
            <form onSubmit={handleSignIn}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="floatingUsername" ref={usernameBox} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="floatingPassword" ref={passwordBox} />
                </div>
                <button type="submit" className="submit-button">SIGN IN</button>
            </form>
            <p className="form-question">Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
    )
};

export default SignInForm;