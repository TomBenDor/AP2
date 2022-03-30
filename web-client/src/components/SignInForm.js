import { useRef } from "react";

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
                <div className="form-floating">
                    <label htmlFor="floatingInput">Username:</label>
                    <input ref={usernameBox} type="text" className="form-control" id="floatingInput" placeholder="Username" />
                </div>
                <div className="form-floating">
                    <label htmlFor="floatingPassword">Password:</label>
                    <input ref={passwordBox} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                </div>
                <button type="submit">Sign in</button>
            </form>
        </>
    )
};

export default SignInForm;