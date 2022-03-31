import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from "./components/MainPage";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";

const App = () => {
  // Current signed in user
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={
            // Should check if user is signed in or not. If not, redirect to signin page.
            // If signed in, render the Main component.
            <>
              <MainPage />
            </>
          } />
          <Route path='/signin' element={
            // Should check if user is signed in or not. If signed in, redirect to main page.
            // If not, render the SignIn component.
            <>
              <SignInForm />
            </>
          } />
          <Route path='/signup' element={
            // Should check if user is signed in or not. If signed in, redirect to main page.
            // If not, render the Signup component.
            <>
              <SignUpForm />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
