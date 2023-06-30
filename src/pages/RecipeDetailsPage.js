import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import recipesService from '../services/recipes.service';

// const API_URL = 'http://localhost:5005';

function RecipeDetailsPage() {
  const [recipe, setRecipe] = useState(null);
  const { recipeId } = useParams();

  const getRecipe = () => {
    recipesService
      .getRecipe(recipeId)
      .then((res) => {
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

          {recipe.recipeIngredients &&
            recipe.recipeIngredients.map((ingredient, index) => (
              <>
                <div key={index}>
                  <span>
                    {ingredient.ingredient.name} -{' '}
                    <span>{`${ingredient.qtyInGrams}gr`}</span>
                  </span>
                </div>
              </>
            ))}

          <h4>Instructions</h4>
          <p>{recipe.instructions}</p>
          <Link to={`/recipes/edit/${recipe._id}`}>Edit</Link>
        </>
      )}
    </div>
  );
}
export default RecipeDetailsPage;
