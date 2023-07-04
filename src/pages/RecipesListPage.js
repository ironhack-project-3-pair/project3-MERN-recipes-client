import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import RecipeCard from '../components/RecipeCard';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

import recipesService from '../services/recipes.service';

import AddRecipe from '../components/AddRecipe';

function RecipesListPage() {
  console.log('rendering RecipesListPage');

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
    getAllRecipes();
  }, []);

  return (
    <div className="RecipeListPage">
      {/* button to show AddIngredient form */}
      <Button variant="outline-warning" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Add New Ingredient'}
      </Button>
      {showForm && (
        <AddRecipe
          callbackToUpdateList={getAllRecipes}
          setCreateMessage={setCreateMessage}
        />
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
