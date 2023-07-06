import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import IngredientCard from '../components/IngredientCard';

import userIngredientsService from '../services/userIngredients.service';
import messageService from '../services/messages.service';

function MyKitchen() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState('');

  const storedToken = localStorage.getItem('authToken');

  const getUserIngredients = () => {
    userIngredientsService
      .getAllUserIngredients()
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

  const deleteUserIngredient = (userIngredientId) => {
    const userIngredientToDelete = userIngredients.find(
      (ingredient) => ingredient._id === userIngredientId
    );

    userIngredientsService
      .deleteUserIngredient(userIngredientId)
      .then((res) => {
        const deleteUserIngredient = res.data;
        messageService.showDeleteMessage(
          userIngredientToDelete.ingredient.name,
          setDeleteMessage
        );
        getUserIngredients();
      })
      .catch((error) => {
        console.log('error delete userRecipes: ', error, error.response.data);
      });
  };

  return (
    <Container>
      <h4
        className="row border-bottom"
        style={{ height: '3rem', display: 'flex', alignItems: 'center' }}
      >
        <span className="col-8 text-start">
          {userIngredients.length}{' '}
          {userIngredients.length === 1 ? 'Ingredient' : 'Ingredients'}
        </span>
        <span className="col-4">
          <Link className="text-decoration-none link-hover" to={'/ingredients'}>
            +
          </Link>
        </span>
      </h4>

      {deleteMessage && <p>{deleteMessage}</p>}

      <Row>
        {userIngredients.map((ingredient) => (
          <Col key={ingredient._id} sm={6} md={4} lg={3} xl={2} className="m-1">
            <IngredientCard
              ingredient={ingredient}
              deleteUserIngredient={deleteUserIngredient}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MyKitchen;
