import {Link} from 'react-router-dom';

const PromptPage = () => {
    return (
        <div id="form-frame">
            <h1 className="form-title">Join MaKore today!</h1>
            <Link to="/signup">
                <button className="submit-button">Sign Up</button>
            </Link>
            <h1 className="form-title">Already have an account?</h1>
            <Link to="/signin">
                <button className="submit-button">Login</button>
            </Link>
        </div>
    )
};

export default PromptPage;