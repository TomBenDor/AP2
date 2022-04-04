import {Link} from 'react-router-dom';

const PromptPage = () => {
    return (
        <div id="form-frame">
            <h1 className="form-title">Join MaKore today!</h1>
            <Link to="/signup">
                <button className="submit-button">SIGN UP</button>
            </Link>
            <h1 className="form-title">Have an account already?</h1>
            <Link to="/signin">
                <button className="submit-button">SIGN IN</button>
            </Link>
        </div>
    )
};

export default PromptPage;