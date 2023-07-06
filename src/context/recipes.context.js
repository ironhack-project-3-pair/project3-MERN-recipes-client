import React, { useState, useEffect } from "react";

const RecipesContext = React.createContext();

function RecipesProviderWrapper(props) {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
    console.log(
      '%cRecipesProviderWrapper:', 
      'color: #aa8833', 
      ' rendering (mounting) or re-rendering (updating)');

  const [deleteMessageCtxRecipesListPage, setDeleteMessageCtxRecipesListPage] = useState("");

  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cRecipesProviderWrapper:%c effect hook',
        'color: #aa8833',
        'color: red'
      );
  }, []);

  return (
    <RecipesContext.Provider value={
      {
        deleteMessageCtxRecipesListPage,
        setDeleteMessageCtxRecipesListPage
      }
    }>
      {props.children}
    </RecipesContext.Provider>
  )
}

export { RecipesProviderWrapper, RecipesContext };