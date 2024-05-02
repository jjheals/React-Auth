

// Imports
import { createContext, useState } from "react";

// Constants 
const AuthContext = createContext();

// Endpoint for authenticating a username and password 
const authenticationURL = 'http://url-for-auth.com/api/authenticate';

// Endpoint for checking if a token is valid
const checkTokenURL = 'http://url-for-auth.com/api/check-token';

const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null);

    /** setToken(userToken)
     * @abstract Sets the user token in session storage
     * @param { String } userToken 
     * @returns { null }
     */
    function setToken(userToken) {
        sessionStorage.setItem('token', userToken);
    };

    /** submitToken(token) 
     * @abstract Function that submits the given token to the 'check-token' endpoint on the API to check if the given token is valid. 
     * Used as a preliminary check in checkStoredToken and is not meant to provide assured authentication.
     * @param { String } token 
     * @returns { Object } 
     */
    function submitToken(token) { 
        return fetch(checkTokenURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'token': token})
        })
        .then(data => data.json());
    }

    /** checkStoredToken() 
     * @abstract Function that gets the currently stored token and submits it to the API endpoint for validation. Note that this
     * is used for a preliminary "client-side" check rather than a full check, since the token must be provided with every API call. 
     * This function's primary purpose is to redirect the user to the dashboard page if they laod the login page and already have 
     * a valid token - it is not meant to provide assured authentication. 
     * @returns { Boolean } true if the token is valid, false otherwise
     */
    async function checkStoredToken() { 
        // Retrieve the token from session storage
        const token = sessionStorage.getItem('token');
        
        // Base case: token is null or undefined
        if(!token) return false;
        else { 
            // Submit the token to the check-token api endpoint
            const response = await submitToken(token);

            // Check the response status 
            if(response.status != 200) return false;
            else return true;
        }
    }

    /** submitCredentials(credentials)
     * @abstract Function to submit the login credentials to the API endpoint 
     * @param { Object } credentials 
     * @returns { Object } Returns the content of the response (JSON)
     */
    async function submitCredentials(credentials) {
        return fetch(authenticationURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(data => data.json());
    }

    /** login(username, password, errorFunc)
     * @abstract Function that uses submitCredentials() to send the given username and password to the API and handles the
     * response; either redirects to the dashboard page or sets the on-screen error.
     * @param { String } username 
     * @param { String } password 
     * @param { function } errorFunc
     * @returns { null }
     */
    async function login(username, password, errorFunc) { 
        // Hit login API endpoint
        const response = await submitCredentials({
            username,
            password
        });

        // Check for unauthorized error
        if(response.status == 200) {
            setToken(response.token);
            setUser(response.username);
            window.location.href = '/dashboard';
        } else { 
            errorFunc();
        }
    }

    /** logout(credentials)
     * @abstract Function that logs out the user 
     * @returns { null }
     */
    const logout = () => {
        setUser(null);
        setToken(null);
    };

    // Value provided by the context
    const authContextValue = {
        user,
        login,
        logout,
        checkStoredToken
    };

    return (
        <AuthContext.Provider value={authContextValue}>
          {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };