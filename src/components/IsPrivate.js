import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

import { useEffect } from "react";

function IsPrivate( { children } ) {

  const { isLoggedIn, isLoading, authenticateUser } = useContext(AuthContext);

  // operation(s) below must be perform in commit phase, not rendering phase, otherwise error:
  // Cannot update a component (`AuthProviderWrapper`) while rendering a different component (`IsPrivate`).
  useEffect(() => {
    authenticateUser() // force an update of the state of the authentification, otherwise if token is expired user keeps access until he reloads the App
  }, [])

  // If the authentication is still loading
  if (isLoading) return <p>Loading ...</p>;

  if (!isLoggedIn) {
  // If the user is not logged in
    return <Navigate to="/login" />;
  } else {
  // If the user is logged in, allow to see the page
    return children;
  }
}

export default IsPrivate;