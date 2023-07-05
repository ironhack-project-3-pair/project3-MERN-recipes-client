import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// import axios from "axios";
// const API_URL = "http://localhost:5005";

import authService from "./../services/auth.service";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const REACT_APP_DEBUG_COMPONENT_LIFECYCLE = process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE || false
  // react-scripts only define env variable for the process the ones that are prefixed with "REACT_APP_"
  // others will be undefined in process.env
  // don't forget to restart
  // https://stackoverflow.com/questions/53237293/react-evironment-variables-env-return-undefined/53237511#53237511
  // https://create-react-app.dev/docs/adding-custom-environment-variables/
  // if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE) console.log("rendering AuthProviderWrapper")
  if (REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
    console.log(
      '%cAuthProviderWrapper:', 
      'color: #bada55', 
      ' rendering (mounting) or re-rendering (updating)');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTokenExpired, setHasTokenExpired] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();

  const storeToken = (token) => {
    localStorage.setItem('authToken', token);
  }

  const authenticateUser = () => {

    // Get the token stored in the browser's localStorage of the user
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken) {
      // Send the JWT token in the request's "Authorization" Headers
      // axios.get(
      //   `${API_URL}/auth/verify`,
      //   { headers: { Authorization: `Bearer ${storedToken}`} }
      // )
      authService.verify()
      .then((response) => {
        // The server has verified that the JWT token is valid and we receive 
        // in the body of the request the token's payload containing the user's 
        // data
        const user = response.data;
        // Update state variables
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);
      })
      .catch((error) => {
        // The server sends an error response (invalid token)
        // Update state variables
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
        
        if (error.response.data.UnauthorizedError?.name === "TokenExpiredError") {
          console.log("token expired!");
          setHasTokenExpired(true)
          logOutUser(); // remove the expired token
        }
      });
    } else {
      // The token is not available (or is removed)
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  }

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem("authToken");
  }

  const logOutUser = () => {
    // To log out the user, remove the token
    removeToken();
    // and update the state variables
    authenticateUser();
  }

  const cleanup = () => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cAuthProviderWrapper:', 
        'color: #bada55', 
        ' cleaning after component removed from DOM (unmounted)');
  }

  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cAuthProviderWrapper:%c effect hook', 
        'color: #bada55',
        'color: red');
    // effect when rendering (mounting) only, not when re-rendering if stateful var updated (because of the empty dependency array)
    authenticateUser();
    return cleanup;
  // }, []);
  }, [location]);

  return (
    <AuthContext.Provider value={
      {
        isLoggedIn, 
        isLoading, 
        user, 
        storeToken, 
        authenticateUser, 
        logOutUser,
        hasTokenExpired
      }
    }>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProviderWrapper, AuthContext };