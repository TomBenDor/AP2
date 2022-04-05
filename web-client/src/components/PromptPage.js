import {Link} from 'react-router-dom';

const PromptPage = () => {
    return (
        <div className="landing-page-frame floater">
            <div>
                <h1 className="landing-page-name-top">MaKoRe</h1>
                <h1 className="landing-page-name">MaKoRe,</h1>
                <h1 className="landing-page-slogan">We Connect People.</h1>
                <Link to="/signup">
                    <button className="button landing-page-button">SIGN UP</button>
                </Link>
                <Link to="/signin">
                    <button className="button landing-page-button">SIGN IN</button>
                </Link>
            </div>
            <div className="floater">
                <img src={"landing_page_photo.svg"} className="landing-photo" alt="Two people chatting"/>
            </div>
        </div>
    )
};

export default PromptPage;