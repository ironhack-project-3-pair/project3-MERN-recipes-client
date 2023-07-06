import { Card, CardImg } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import recipesService from '../services/recipes.service';
import messagesService from '../services/messages.service';

function RecipeCard(props) {

  return (
    // <div className=" card">
    <Card className="RecipeCard col m-3">
      {!props.recipe.image ? (
        <CardImg
          style={{ width: '200px', margin: 'auto' }}
          src="https://static.vecteezy.com/system/resources/previews/008/695/917/original/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
          alt="default"
        />
      ) : (
        <CardImg
          style={{ width: '200px', margin: 'auto' }}
          src={props.recipe.image}
          alt={props.recipe.name}
        />
      )}

      <Card.Title className="d-block  link-hover">
        <Link
          className="text-decoration-none text-center"
          to={`/recipes/${props.recipe._id}`}
        >
          {props.recipe.name}
        </Link>
        {/* button to delete recipe */}
        {/* <span>
          <button onClick={deleteRecipe}>x</button>
        </span> */}
      </Card.Title>
    </Card>
    // </div>
  );
}

export default RecipeCard;
