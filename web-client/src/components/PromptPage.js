import {Link} from 'react-router-dom';

const PromptPage = () => {
    return (
        <div className="landing-page-frame">
            <div className="top-section">
                <h1 className="landing-page-name-top">MaKore</h1>
            </div>
            <div className="bottom-section">
                <div className="floater-right">
                    <img src={"landing_page_photo.svg"} alt="landing_page_photo" className="center"/>
                </div>
                <div className="floater-left">
                    <div className="slogan-section">
                        <div className="center">
                            <h1 className="landing-page-name">MaKore,</h1>
                            <h1 className="landing-page-slogan">We Connect People.</h1>
                        </div>
                    </div>
                    <div className="button-section">
                        <text>Have an account?</text>
                        <Link to="/signin">Sign In</Link>
                        <text>New Here?</text>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                </div>

            </div>
            {/*<div>*/}
            {/*    <h1 className="landing-page-name">MaKore,</h1>*/}
            {/*    <h1 className="landing-page-slogan">We Connect People.</h1>*/}
            {/*    <Link to="/signup">*/}
            {/*        <button className="button landing-page-button">SIGN UP</button>*/}
            {/*    </Link>*/}
            {/*    <Link to="/signin">*/}
            {/*        <button className="button landing-page-button">SIGN IN</button>*/}
            {/*    </Link>*/}
            {/*</div>*/}
            {/*<div className="col-md-4">*/}
            {/*    <img src={"landing_page_photo.svg"} className="landing-photo" alt="Two people chatting"/>*/}
            {/*</div>*/}
        </div>
    )
};

export default PromptPage;