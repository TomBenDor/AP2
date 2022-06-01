import {Link} from 'react-router-dom';
import SvgAnimation from '../SvgAnimation/SvgAnimation';
import "./LandingPage.css";


const PromptPage = () => {
    return (
        <div className="landing-page-frame">
            <div className="top-section">
                <h1 className="landing-page-name-top">MaKore</h1>
            </div>
            <div className="bottom-section">
                <div className="floater-right">
                    <SvgAnimation/>
                </div>
                <div className="floater-left">
                    <div className="slogan-section">
                        <div className="center">
                            <h1 className="landing-page-name">MaKore,</h1>
                            <h1 className="landing-page-slogan">We Connect People.</h1>
                        </div>
                    </div>
                    <div className="button-section">
                        <span>Have an account?</span>
                        <Link to="/signin">Sign In</Link>
                        <span>New Here?</span>
                        <Link to="/signup">Sign Up</Link>
                        <br/><br/>
                        <span>See what our customers are saying <a href='https://localhost:7095/' target="_blank" rel="noreferrer">here</a></span>
                    </div>
                </div>

            </div>
        </div>
    )
};

export default PromptPage;