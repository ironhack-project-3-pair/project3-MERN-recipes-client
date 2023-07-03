import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function IngredientCard({
  ingredient,
  deleteUserIngredient,
  isDelete,
  children,
}) {
  return (
    <Row
      key={ingredient._id}
      className="justify-content-center ingredient-card"
    >
      <Card
        className="m-1 flex-row row"
        style={{ width: `${children ? '45vw' : '25vw'} ` }}
      >
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
          {children}
        </Card.Text>
        {!isDelete && (
          // button to delete ingredient
          <Col className="flex-column align-right col-1">
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
