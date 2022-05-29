import {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignInForm from "./components/Auth/SignIn/SignInForm";
import SignUpForm from "./components/Auth/SignUp/SignUpForm";
import ChatPage from "./components/ChatPage/ChatPage";
import LandingPage from "./components/LandingPage/LandingPage";

const FILE = require('./database.json');

const App = () => {
    // Current signed in user
    const [token, setToken] = useState(null);

    const [theme, setTheme] = useState('light');

    return (
        <Router>
            <div className="App" data-theme={theme}>
                <main>
                    <Routes>
                        <Route path='/' element={
                            // Check if user is signed in or not. If not, render landing page.
                            // If signed in, Render the Chat page.
                            token ?
                                <ChatPage token={token} theme={theme} setTheme={setTheme}/> :
                                <LandingPage/>
                        }/>
                        <Route path='/signin' element={
                            // Render the SignIn component.
                            <>
                                <SignInForm token={token} setToken={setToken}/>
                            </>
                        }/>
                        <Route path='/signup' element={
                            // Render the Signup component.
                            <>
                                <SignUpForm token={token} setToken={setToken}/>
                            </>
                        }/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
