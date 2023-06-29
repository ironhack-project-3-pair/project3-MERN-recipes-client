import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5005';

function RecipeDetailsPage() {
  const [recipe, setRecipe] = useState(null);
  console.log('RecipeCard............');
  const { recipeId } = useParams();

  const getRecipe = () => {
    axios
      .get(`${API_URL}/api/recipes/${recipeId}`)
      .then((res) => {
        console.log('RESPONSE......', res);
        setRecipe(res.data);
      })
      .catch((e) => console.log('Error GET details from API', e));
  };

  useEffect(() => {
    getRecipe();
  }, []);
  return (
    <div className="RecipeDetailsPage">
      {recipe && (
        <>
          {!recipe.image ? (
            <img
              src="https://static.vecteezy.com/system/resources/previews/008/695/917/original/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
              alt="no image"
            />
          ) : (
            <img src={recipe.image} alt={recipe.name} />
          )}
          <h3>{recipe.name}</h3>
          <p>Preparation: {recipe.durationInMin} mins</p>
          <h4>Ingredients</h4>
          <p>{recipe.recipeIngredients}</p>
          <h4>Instructions</h4>
          <p>{recipe.instructions}</p>
          
        </>
      )}
    </div>
  );
}
export default RecipeDetailsPage;
