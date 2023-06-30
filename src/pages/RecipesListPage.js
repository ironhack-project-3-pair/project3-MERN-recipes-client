import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

import recipesService from '../services/recipes.service';

function RecipesListPage() {

  console.log("rendering RecipesListPage")

  const [recipes, setRecipes] = useState([]);

  const getAllRecipes = () => {
    // Get the token from the localStorage
    // const storedToken = localStorage.getItem("authToken");

    // axios
      // .get(`${API_URL}/api/recipes`)
      // .get(`${API_URL}/api/recipes`, { headers: { Authorization: `Bearer ${storedToken}` } })
    recipesService.getAllRecipes()
      .then((response) => {
        setRecipes(response.data)
      })
      .catch((error) => {
        console.log("error getting the recipes: ", error, error.response.data)
      });
  };

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {
    getAllRecipes();
  }, []);

  return (
    <div className="RecipeListPage">
      {recipes.map((recipe) => {
        return <RecipeCard key={recipe.id} recipe={recipe} />;
      })}
    </div>
  );
}

export default RecipesListPage;
