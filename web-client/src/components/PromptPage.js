import {Link} from 'react-router-dom';

const PromptPage = () => {
    return (
        <div className="landing-page-frame floater">
            <div>
                <h1 className="landing-page-name-top">MaKoRe</h1>
                <h1 className="landing-page-name">MaKoRe,</h1>
                <h1 className="landing-page-slogan">We connect people.</h1>
                <Link to="/signup">
                    <div className="button landing-page-button">sign up</div>
                </Link>
                <Link to="/signin">
                    <div className="button landing-page-button">sign in</div>
                </Link>
            </div>
            <div className="floater">
                <img src={"landing_page_photo.svg"} className="landing-photo" alt="landing_page_photo"/>
            </div>
        </div>
    )
};

export default PromptPage;