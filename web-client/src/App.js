import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <p>
            MaKore
          </p>
        </header>
        <Routes>
          <Route path='/' element={
            // Should check if user is signed in or not. If not, redirect to login page.
            // If signed in, render the Main component.
            <>
              <p>Main page</p>
            </>
          } />
          <Route path='/login' element={
            // Should check if user is signed in or not. If signed in, redirect to main page.
            // If not, render the Login component.
            <>
              <p>Login page</p>
            </>
          } />
          <Route path='/signup' element={
            // Should check if user is signed in or not. If signed in, redirect to main page.
            // If not, render the Signup component.
            <>
              <p>Signup page</p>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
