import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import RecipeCard from '../components/RecipeCard';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

import recipesService from '../services/recipes.service';

import AddRecipe from '../components/AddRecipe';

function RecipesListPage() {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
    console.log(
      '%cRecipesListPage:',
      'color: #eedd88',
      ' rendering (mounting) or re-rendering (updating)'
    );

  const [recipes, setRecipes] = useState([]);

  //messages
  const [deleteMessage, setDeleteMessage] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  //hide addIngredient form by default
  const [showForm, setShowForm] = useState(false);

  const getAllRecipes = () => {
    // // Get the token from the localStorage
    // const storedToken = localStorage.getItem("authToken");

    // axios
    // // .get(`${API_URL}/api/recipes`)
    // .get(`${API_URL}/api/recipes`, { headers: { Authorization: `Bearer ${storedToken}` } })
    recipesService
      .getAllRecipes()
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log('error getting the recipes: ', error, error.response.data);
      });
  };

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cRecipesListPage:%c effect hook',
        'color: #eedd88',
        'color: red'
      );
    getAllRecipes();
  }, []);

  return (
    <div className="RecipeListPage">
      {/* button to show AddRecipe form */}
      <Button className='m-3' variant="outline-warning" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Add New Recipe'}
      </Button>
      {showForm && (
        <>
          <AddRecipe
            callbackToUpdateList={getAllRecipes}
            setCreateMessage={setCreateMessage}
          />
        </>
      )}

      {/* Show the message */}
      {createMessage && <p>{createMessage}</p>}
      {deleteMessage && <p>{deleteMessage}</p>}

      <hr />

      {/* render list of recipesa */}
      {recipes.map((recipe) => {
        return (
          <RecipeCard
            key={recipe._id}
            callbackToUpdateList={getAllRecipes}
            recipe={recipe}
            setDeleteMessage={setDeleteMessage}
          />
        );
      })}
    </div>
  );
}

export default RecipesListPage;
