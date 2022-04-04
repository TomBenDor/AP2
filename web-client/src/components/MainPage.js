import {Link} from 'react-router-dom';

const MainPage = () => {
    return (
        <div id="form-frame">
            <h1 className="form-title">Join MaKore today!</h1>
            <Link to="/signup">
                <button className="button main-page-button">Sign Up</button>
            </Link>
            <h1 className="form-title">Already have an account?</h1>
            <Link to="/signin">
                <button className="button main-page-button">Login</button>
            </Link>
        </div>
    )
};

export default MainPage;