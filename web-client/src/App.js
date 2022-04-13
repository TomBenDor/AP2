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
            username: 'Panda',
            name: 'Panda Bear',
            lastMessage: 'Hi, Wanna eat some bamboo?',
            lastMessageTime: '13:49',
            profilePicture: '"https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"',
            unreadMessages: 1,
            messages: [
                {
                    id: 1,
                    sender: 'left',
                    text: 'Hi, How are you?',
                    timestamp: '12:00'
                },
                {
                    id: 2,
                    sender: 'right',
                    text: 'I am awesome!',
                    timestamp: '13:00'
                }
            ]
        },
        {
            username: 'Koala',
            name: 'Koala Bear',
            lastMessage: 'Let\'s have a sleepover!',
            lastMessageTime: '12:32',
            profilePicture: '"https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"',
            unreadMessages: 2,
            messages: []
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
