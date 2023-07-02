import { Link, useParams } from 'react-router-dom';

import recipesService from '../services/recipes.service';

function RecipeCard(props) {
  const recipeId = props.recipe._id;
  //delete from API
  const deleteRecipe = () => {
    recipesService
      .deleteRecipe(recipeId)
      .then(() => {
        // Set deletion message after successful deletion
        props.setDeleteMessage(`Deleted ${props.recipe.name}`);
        // Clear message after awhile
        setTimeout(() => props.setDeleteMessage(''), 400);
        //To update the recipe list
        props.callbackToUpdateList();
      })
      .catch((e) => console.log('Error DELETE from API', e));
  };

  return (
    <div className="RecipeCard card">
      {!props.recipe.image ? (
        <img
          src="https://static.vecteezy.com/system/resources/previews/008/695/917/original/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
          alt="default"
        />
      ) : (
        <img src={props.recipe.image} alt={props.recipe.name} />
      )}
      <h3>
        <Link to={`/recipes/${props.recipe._id}`}>{props.recipe.name}</Link>
        {/* button to delete recipe */}
        <span>
          <button onClick={deleteRecipe}>x</button>
        </span>
      </h3>
    </div>
  );
}

export default RecipeCard;
