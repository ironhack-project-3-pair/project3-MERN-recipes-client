import { Row, Col, Card, Button } from 'react-bootstrap';

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
          className={`d-flex flex-row align-items-center justify-content-center p-1 p-0 ${
            isDelete ? 'col-10' : 'col-9'
          }`}
        >
          <span className="m-1 col-6">
            {ingredient.ingredient
              ? ingredient.ingredient.name
              : ingredient.name}
            {ingredient.ingredient
              ? ingredient.ingredient.emoji
              : ingredient.emoji}
          </span>
          {ingredient.qtyInGrams && (
            <span className="m-1 col-2">{ingredient.qtyInGrams} g</span>
          )}
          <div className="d-flex flex-row align-items-center justify-content-evenly">
            {children}
          </div>
        </Card.Body>
        {!isDelete && (
          <Col className="flex-column align-right p-0 m-0">
            <Button
              className="px-3 m-0 text-decoration-none link-hover "
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
