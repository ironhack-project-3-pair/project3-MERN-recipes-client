import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import IngredientCard from '../components/IngredientCard';

import userIngredientsService from '../services/userIngredients.service';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

function MyKitchen() {
  const [userIngredients, setUserIngredients] = useState([]);

  // // Get the token from the localStorage
  const storedToken = localStorage.getItem('authToken');

  // const { userIngredientId } = useParams();

  const getUserIngredients = () => {
    // axios
    //   .get(`${API_URL}/api/user-ingredients`, {
    //     headers: { Authorization: `Bearer ${storedToken}` },
    //   })
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

  //delete ingredient from userIngredients
  const deleteUserIngredient = (userIngredientId) => {
    // axios
    //   .delete(`${API_URL}/api/user-ingredients/${userIngredientId}`, {
    //     headers: { Authorization: `Bearer ${storedToken}` },
    //   })
    userIngredientsService
      .deleteUserIngredient(userIngredientId)
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
          <IngredientCard
            key={ingredient._id}
            ingredient={ingredient}
            deleteUserIngredient={deleteUserIngredient}
          />
        );
      })}
    </Container>
  );
}

export default MyKitchen;
