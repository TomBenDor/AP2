import { useRef } from "react";

const LoginForm = () => {
    const usernameBox = useRef(null);
    const passwordBox = useRef(null);

    const handleLogin = (e) => {
        // Validate username and password
        // If valid, save current user and redirect to main page

        e.preventDefault();

        let currentUsername = usernameBox.current.value;
        let currentPassword = passwordBox.current.value;
    };


    return (
        <>
            <h1>Login Form</h1>
            <form onSubmit={handleLogin}>
                <div className="form-floating">
                    <label htmlFor="floatingInput">Username:</label>
                    <input ref={usernameBox} type="text" className="form-control" id="floatingInput" placeholder="Username" />
                </div>
                <div className="form-floating">
                    <label htmlFor="floatingPassword">Password:</label>
                    <input ref={passwordBox} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </>
    )
};

export default LoginForm;