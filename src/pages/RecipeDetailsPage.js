import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import recipesService from '../services/recipes.service';

function RecipeDetailsPage() {
  const [recipe, setRecipe] = useState(null);
  const { recipeId } = useParams();

  const getRecipe = () => {
    recipesService
      .getRecipe(recipeId)
      .then((res) => {
        setRecipe(res.data);
      })
      .catch((e) => console.log('error getting the recipe\'s details', e));
  };

  useEffect(() => {
    getRecipe();
  }, []);

  return (
    <div className="RecipeDetailsPage">
      {recipe && (
        <>
          {!recipe.image 
            ? <img
              src="https://static.vecteezy.com/system/resources/previews/008/695/917/original/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
              alt="default"
            />
            : <img src={recipe.image} alt={recipe.name} />
          }
          <h3>{recipe.name}</h3>
          <p>Preparation: {recipe.durationInMin} min</p>
          <h4>Ingredients</h4>
          <ul>
          {recipe.recipeIngredients.map((recipeIngredient) => {
            // JSX collapses whitespaces
            // backticks are required with the white-space attribute in JSX
            return <li key={recipeIngredient._id} style={{whiteSpace: "no-wrap"}}>
              {`
                ${recipeIngredient.ingredient.name} 
                ${recipeIngredient.ingredient.emoji} | 
                ${recipeIngredient.qtyInGrams} g
              `}
            </li>
          })}
          </ul>
          <h4>Instructions</h4>
          <p>{recipe.instructions}</p>
          <Link to={`/recipes/edit/${recipe._id}`}>Edit</Link>
        </>
      )}
    </div>
  );
}
export default RecipeDetailsPage;