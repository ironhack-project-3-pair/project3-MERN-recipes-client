import React, { useState, useEffect } from "react";

// import axios from "axios";
// const API_URL = "http://localhost:5005";

import authService from "./../services/auth.service";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {

  console.log("rendering AuthProviderWrapper")

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTokenExpired, setHasTokenExpired] = useState(false);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    authenticateUser();
  }, []);

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