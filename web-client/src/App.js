import {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignInForm from "./components/Auth/SignIn/SignInForm";
import SignUpForm from "./components/Auth/SignUp/SignUpForm";
import ChatPage from "./components/ChatPage/ChatPage";
import LandingPage from "./components/LandingPage/LandingPage";

const App = () => {
    // Current signed in user
    // currentUser: { username: "", displayName: "", profilePicture: "" }
    const [currentUser, setCurrentUser] = useState(null);
    // Users from the database (for now it's just hardcoded)
    const [users, setUsers] = useState([{
        "username": "user123",
        "password": "pass123",
        "displayName": "Coolest dude ever",
        "profilePicture": null
    }]);

    const [contacts, setContacts] = useState([
        {
            id: 0,
            username: 'Panda',
            name: 'Panda Bear',
            profilePicture: '"https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"',
            unreadMessages: 1,
            messages: [
                {
                    id: 1,
                    sender: 'left',
                    text: 'Do you got any bamboo left?',
                    timestamp: '14:49'
                },
                {
                    id: 2,
                    sender: 'right',
                    text: 'Not for you, sorry.',
                    timestamp: '15:01'
                }
            ]
        },
        {
            id: 1,
            username: 'Koala',
            name: 'Koala Bear',
            profilePicture: '"https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"',
            unreadMessages: 1,
            messages: [
                {
                    id: 1,
                    sender: 'right',
                    text: 'Wanna have a sleepover?',
                    timestamp: '12:32'
                },
            ]
        },
    ]);

    return (
        <Router>
            <div className="App">
                <main>
                    <Routes>
                        <Route path='/' element={
                            // Check if user is signed in or not. If not, render landing page.
                            // If signed in, Render the Chat page.
                            currentUser ? <ChatPage user={currentUser} contacts={contacts} setContacts={setContacts}/> :
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
