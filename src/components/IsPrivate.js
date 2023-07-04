import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

import { useEffect } from "react";

function IsPrivate( { children } ) {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE) console.log("IsPrivate: rendering (mounting) or re-rendering (updating)")
  // this component uses context from AuthProviderWrapper, 
  // so IsPrivate is also re-rendered each time AppProviderWrapper is re-rendered
  // (even if IsPrivate has no useEffect hook set up)

  const { isLoggedIn, isLoading, authenticateUser } = useContext(AuthContext);

  const cleanup = () => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE) console.log("IsPrivate: cleaning after component removed from DOM (unmounted)")
  }
  // operation(s) below must be perform in commit phase, not rendering phase, otherwise error:
  // Cannot update a component (`AuthProviderWrapper`) while rendering a different component (`IsPrivate`).
  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE) console.log("IsPrivate effect hook")
    // note: when setting up a useEffect hook, it does not necessarily re-render the component 
    // (e.g. if no stateful var changes)

    // if (!isLoading) authenticateUser() 
    // force an update of the state of the authentification 
    // (only when component is mounting but the app is not because of the !isLoading condition), 
    // otherwise if token is expired user keeps access until he reloads the App

    // calling this callback will re-render the AuthProviderWrapper because it updates its stateful vars
    // it does not change the fact the AuthProviderWrapper can also re-render because of its own effect hook

    // in fact, this is not enought to log out the user when token expired
    // indeed, IsPrivate is not unmounted if navigating between routes using it
    // so for this effect to be triggered, user must navigate to a route not using it, to unmount this component,
    // then navigate back to a route using it, to mount it again, and so logging out the user
    // SOLUTION: useLocation hook
    return cleanup;
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