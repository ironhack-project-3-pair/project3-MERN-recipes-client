import { Row, Col, Card, Button } from 'react-bootstrap';
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
        className="d-flex flex-row align-items-center mb-3 p-0"
        style={{ width: `${children ? '30vw' : '20vw'}`, height: '5rem' }}
      >
        <Card.Body
          className={`d-flex flex-row align-items-center justify-content-between p-1 p-0 ${
            isDelete ? 'col-12' : 'col-10'
          }`}
        >
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
          <div className="d-flex flex-row align-items-center justify-content-between">
            {children}
          </div>
        </Card.Body>
        {!isDelete && (
          <Col className="flex-column align-right p-0 m-0">
            <Button
              className="p-0 m-0 text-decoration-none"
              style={{color:"black"}}
              variant="link"
              onClick={() => deleteUserIngredient(ingredient._id)}
            >
              ⨉
            </Button>
          </Col>
        )}
      </Card>
    </Row>
  );
}

export default IngredientCard;
