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
        "profilePicture": "profile_picture.png"
    }]);

    const [contacts, setContacts] = useState([
        {
            id: 0,
            username: 'Panda',
            name: 'Panda Bear',
            profilePicture: 'panda.jpg',
            unreadMessages: 1,
            messages: [
                {
                    id: 1,
                    sender: 'left',
                    text: 'Do you got any bamboo left?',
                    timestamp: '4/16/2022, 14:49:00',
                    type: 'text'
                },
                {
                    id: 2,
                    sender: 'right',
                    text: 'Not for you, sorry.',
                    timestamp: '4/16/2022, 15:01:00',
                    type: 'text'
                }
            ]
        },
        {
            id: 1,
            username: 'Koala',
            name: 'Koala Bear',
            profilePicture: 'koala.jpg',
            unreadMessages: 1,
            messages: [
                {
                    id: 1,
                    sender: 'right',
                    text: 'Wanna have a sleepover?',
                    timestamp: '4/16/2022, 12:32:00',
                    type: 'text'
                },
            ]
        },
        {
            id: 2,
            username: 'Crisr7',
            name: 'Cristiano Ronaldo',
            profilePicture: 'cr7.jpg',
            unreadMessages: 3,
            messages: [
                {
                    id: 1,
                    sender: 'right',
                    text: 'Ayo my dude, remember my celebration?',
                    timestamp: '4/18/2022, 12:41:00',
                    type: 'text'
                },
                {
                    id: 2,
                    sender: 'left',
                    text: 'No, I forgot. Sorry 🙁',
                    timestamp: '4/18/2022, 12:42:42',
                    type: 'text'
                },
                {
                    id: 3,
                    sender: 'right',
                    text: 'Ok, I got you covered my boi.',
                    timestamp: '4/18/2022, 12:42:43',
                    type: 'text'
                },
                {
                    id: 4,
                    sender: 'right',
                    text: 'cr7-siuuu.mp4',
                    timestamp: '4/18/2022, 12:42:55',
                    type: 'video'
                },
                {
                    id: 5,
                    sender: 'right',
                    text: 'siuuu.gif',
                    timestamp: '4/18/2022, 12:42:59',
                    type: 'image'
                },
            ]
        },
        {
            id: 3,
            username: 'drake6942',
            name: 'Drake',
            profilePicture: 'drake.jpg',
            unreadMessages: 0,
            messages: [
                {
                    id: 1,
                    sender: 'right',
                    text: 'Yo hear my new song bro',
                    timestamp: '4/19/2021, 8:42:00',
                    type: 'text'
                },
                {
                    id: 2,
                    sender: 'right',
                    text: 'sheesh.mp3',
                    timestamp: '4/19/2021, 8:44:00',
                    type: 'audio'
                },
                {
                    id: 3,
                    sender: 'left',
                    text: 'Lit bro 🔥🔥🔥🔥',
                    timestamp: '4/19/2021, 8:45:00',
                    type: 'text'
                },
            ]
        },
        {
            id: 4,
            username: 'zuckyhomeboy',
            name: 'Mark Zuckerberg',
            profilePicture: 'zuck.jpg',
            unreadMessages: 3,
            messages: [
                {
                    id: 1,
                    sender: 'right',
                    text: 'Listen, I got a crazy idea. But don\'t tell anyone about it.',
                    timestamp: '4/20/2021, 8:42:00',
                    type: 'text'
                },
                {
                    id: 2,
                    sender: 'left',
                    text: 'What is it?',
                    timestamp: '4/20/2021, 8:43:00',
                    type: 'text'
                },
                {
                    id: 4,
                    sender: 'right',
                    text: 'So it goes like this:\n\nLet\'s create like an app that lets you send messages to other people. Like a messenger app.\nand like create group chats and stuff..\nIt will look something like this:',
                    timestamp: '4/19/2021, 8:45:00',
                    type: 'text'
                },
                {
                    id: 7,
                    sender: 'right',
                    text: 'screenshot.jpg',
                    timestamp: '4/19/2021, 8:45:23',
                    type: 'image'
                },
                {
                    id: 8,
                    sender: 'right',
                    text: 'I even thought about a name for it, "WhatsApp".\nWhat you thinking bro?',
                    timestamp: '4/19/2021, 8:46:24',
                    type: 'text'
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
