import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5005';

function MyKitchen() {
  const [userIngredients, setUserIngredients] = useState([]);

  // // Get the token from the localStorage
  const storedToken = localStorage.getItem('authToken');

  // const { userIngredientId } = useParams();

  const getUserIngredients = () => {
    axios
      .get(`${API_URL}/api/user-ingredients`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setUserIngredients(res.data);
      })
      .catch((error) => {
        console.log(
          'error getting the userRecipes: ',
          error,
          error.response.data
        );
      });
  };

  useEffect(() => {
    getUserIngredients();
  }, []);

  //delete ingredient from userIngredients
  const deleteUserIngredient = (userIngredientId) => {
    axios
      .delete(`${API_URL}/api/user-ingredients/${userIngredientId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => getUserIngredients())
      .catch((error) => {
        console.log('error delete userRecipes: ', error, error.response.data);
      });
  };
  return (
    <Container>
      <h4 className="row">
        <span className="col-8 text-start">
          My Ingredients Have: {userIngredients.length} Items
        </span>
        <span className="col-4">
          <Link className="text-decoration-none" to={'/ingredients'}>
            +
          </Link>
        </span>
      </h4>
      {userIngredients.map((ingredient) => {
        return (
          <Row
            key={ingredient._id}
            className="justify-content-center ingredient-card"
          >
            <Card className="m-1 flex-row" style={{ width: '15vw' }}>
              <Card.Text className="my-2 mx-1 col-10">
                <span className="m-1">
                  {ingredient.ingredient.name}
                  {ingredient.ingredient.emoji && ingredient.ingredient.emoji}
                </span>
                <span className="m-1">{ingredient.qtyInGrams}g</span>
              </Card.Text>
              {/* button to delete ingredient */}
              <Col className="flex-column justify-content-start col-2">
                <Link
                  className='text-decoration-none'
                  onClick={() => {
                    deleteUserIngredient(ingredient._id);
                  }}
                >
                  ⨉
                </Link>
              </Col>
            </Card>
          </Row>
        );
      })}
    </Container>
  );
}

export default MyKitchen;
