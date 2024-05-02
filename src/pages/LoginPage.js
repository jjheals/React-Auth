/** src/pages/LoginPage.js
 * @abstract Simple login page that sends the inputted credentials to the API endpoints specified in ../AuthProvider.
 * 
 * @exports 
 *    @function LoginPage
 */

// Imports
import React, { useState, useEffect, useContext } from 'react';

// For authentication
import { AuthContext } from '../AuthProvider';

// Stylesheets
import '../css/LoginPage.css';


/** LoginPage(setToken)
 * @abstract Renders the login page 
 * @param { function } setToken  
 * @returns { null }
 */
function LoginPage() {
  const { user, login, logout, checkStoredToken } = useContext(AuthContext);
  const [error, setError] = useState('Invalid username or password.');
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  // useEffect => redirect to the protected page if the user is already logged in
  useEffect(() => {
    async function checkToken() { 
      await checkStoredToken()
      .then(response => { 
        if(response.status == 200) window.location.href = '/protected-page';
      });
    }
    checkToken();
  }, [checkStoredToken])

  /** setAuthError()
   * @abstract Set the authorization error on the screen 
   * @returns { null }
   */
  function setAuthError() { 
    document.getElementById('authorizationMessage').classList.remove('hidden');
  }

  /** removeAuthError() 
   * @abstract Remove the authorization error on the screen 
   * @returns { null }
   */
  function removeAuthError() { 
    document.getElementById('authorizationMessage').classList.add('hidden');
  }

  /** handleLogin
   * @abstract Event handler for submitting the login using loginUser() 
   * @param { Event } e 
   * @returns { null }
   */
  const handleLogin = async e => { 
    e.preventDefault();
    
    // Remove any previous auth errors
    removeAuthError();

    // Login 
    login(username, password, setAuthError);
  }

  // useEffect => add event listeners to the proper elements when the page loads
  useEffect(() => { 

    const submitButton = document.getElementById('submitButton');     // Submit button element 
    const usernameInput = document.getElementById('username_input');  // Username input element
    const passwordInput = document.getElementById('password_input');  // Password input element 

    // Listen for user click on the submit button
    submitButton.addEventListener('click', handleLogin);
    
    // Listen for keyup "Enter" in the username input box
    usernameInput.addEventListener('keyup', event => {
      if (event.key === 'Enter') {
        submitButton.click(); // Trigger the button click event
      }
    });

    // Listen for keyup "Enter" in the password input box
    passwordInput.addEventListener('keyup', event => {
      if (event.key === 'Enter') {
        submitButton.click(); // Trigger the button click event
      }
    });
  }, []);

  return (
    <div id='login-page-container' className='login-page-container'>
        <div class="login-form-container" id="login-form-container">
            <h1>Login</h1>
            <form className='login-form' onSubmit={ handleLogin }>

              {/* Username input */}
              <input
                type="text"
                className="login-input"
                id="username_input"
                name="username"
                placeholder="Username"
                onChange={ e => setUsername(e.target.value) }
              />

              {/* Password input */}
              <input
                type="password"
                className="login-input"
                id="password_input"
                name="password"
                placeholder="Password"
                onChange={ e => setPassword(e.target.value) }
              />

              {/* Error message */}
              <div id="authorizationMessage" className="authorization-message hidden">{error}</div>
              
              {/* Submit button */}
                <button className='login-submit-button' type="submit" id="submitButton">Submit</button>
              

              {/* Loading message */}
              <div id="loadingMessage" className="loading-message hidden">Loading...</div>
            </form>
        </div>
    </div>
  );
};

export default LoginPage;
