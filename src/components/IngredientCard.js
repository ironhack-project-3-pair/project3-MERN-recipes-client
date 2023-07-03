import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function IngredientCard({ ingredient, deleteUserIngredient, isDelete }) {
  return (
    <Row
      key={ingredient._id}
      className="justify-content-center ingredient-card"
    >
      <Card className="m-1 flex-row" style={{ width: '15vw' }}>
        <Card.Text className={`my-2 mx-1 ${isDelete ? 'col-12' : 'col-10'}`}>
          <span className="m-1">
            {ingredient.ingredient
              ? ingredient.ingredient.name
              : ingredient.name}
            {ingredient.ingredient
              ? ingredient.ingredient.emoji
              : ingredient.emoji}
          </span>
          {ingredient.qtyInGrams && (
            <span className="m-1">{ingredient.qtyInGrams}g</span>
          )}
        </Card.Text>
        {!isDelete && (
          // button to delete ingredient
          <Col className="flex-column justify-content-start col-2">
            <Link
              className="text-decoration-none"
              onClick={() => {
                deleteUserIngredient(ingredient._id);
              }}
            >
              ⨉
            </Link>
          </Col>
        )}
      </Card>
    </Row>
  );
}

export default IngredientCard;
