import {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignInForm from "./components/Auth/SignIn/SignInForm";
import SignUpForm from "./components/Auth/SignUp/SignUpForm";
import ChatPage from "./components/ChatPage/ChatPage";
import LandingPage from "./components/LandingPage/LandingPage";
let DB = require('./database.json');

const App = () => {
    // Current signed in user
    const [currentUser, setCurrentUser] = useState(null);
  
    const [users, setUsers] = useState(DB.users);
    const [contacts, setContacts] = useState(DB.contacts);

    return (
        <Router>
            <div className="App">
                <main>
                    <Routes>
                        <Route path='/' element={
                            // Check if user is signed in or not. If not, render landing page.
                            // If signed in, Render the Chat page.
                            currentUser ? <ChatPage user={currentUser} contacts={contacts} setContacts={setContacts}
                                                    users={users}/> :
                                <LandingPage/>
                        }/>
                        <Route path='/signin' element={
                            // Render the SignIn component.
                            <>
                                <SignInForm users={users} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
                            </>
                        }/>
                        <Route path='/signup' element={
                            // Render the Signup component.
                            <>
                                <SignUpForm users={users} setUsers={setUsers} currentUser={currentUser}
                                            setCurrentUser={setCurrentUser}/>
                            </>
                        }/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
