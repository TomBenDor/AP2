import { useRef } from "react";
import { Link } from 'react-router-dom';

const SignInForm = () => {
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);

    const handleSignIn = (e) => {
        // Validate username and password
        // If valid, sign in user and redirect to main page

        e.preventDefault();

        let currentUsername = usernameBox.current.value;
        let currentPassword = passwordBox.current.value;
    };


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