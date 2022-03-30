import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MainPage from "./components/MainPage";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={
            // Should check if user is signed in or not. If not, redirect to login page.
            // If signed in, render the Main component.
            <>
              <MainPage />
            </>
          } />
          <Route path='/login' element={
            // Should check if user is signed in or not. If signed in, redirect to main page.
            // If not, render the Login component.
            <>
              <LoginForm />
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
