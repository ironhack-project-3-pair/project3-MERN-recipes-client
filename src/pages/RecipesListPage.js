import axios from 'axios';
import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';


const API_URL = 'http://localhost:5005';

function RecipesListPage() {
  const [recipes, setRecipes] = useState([]);

  const getAllRecipes = () => {
    axios
      .get(`${API_URL}/api/recipes`)
      .then((response) => setRecipes(response.data))
      .catch((error) => console.log(error));
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
