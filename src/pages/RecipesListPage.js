import { useState, useEffect } from 'react';

import { useContext } from "react";
import { RecipesContext } from "../context/recipes.context";

import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import RecipeCard from '../components/RecipeCard';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

import recipesService from '../services/recipes.service';

import AddRecipe from '../components/AddRecipe';

function RecipesListPage() {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
    console.log(
      '%cRecipesListPage:',
      'color: #eedd88',
      ' rendering (mounting) or re-rendering (updating)'
    );

  const [recipes, setRecipes] = useState([]);

  // messages
  const [deleteMessage, setDeleteMessage] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  const { deleteMessageCtxRecipesListPage } = useContext(RecipesContext);

  // hide addIngredient form by default
  const [showForm, setShowForm] = useState(false);

  const getAllRecipes = () => {
    // // Get the token from the localStorage
    // const storedToken = localStorage.getItem("authToken");

    // axios
    // // .get(`${API_URL}/api/recipes`)
    // .get(`${API_URL}/api/recipes`, { headers: { Authorization: `Bearer ${storedToken}` } })
    recipesService
      .getAllRecipes()
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log('error getting the recipes: ', error, error.response.data);
      });
  };

  const cleanup = () => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cRecipesListPage:', 
        'color: #eedd88', 
        ' cleaning after component removed from DOM (unmounted)');
  }

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cRecipesListPage:%c effect hook',
        'color: #eedd88',
        'color: red'
      );

      // set the delete message keeping the old state
      // avoid changing JSX to conditionally render deleteMessageCtxRecipesListPage instead
      setDeleteMessage(deleteMessageCtxRecipesListPage);

    getAllRecipes();

    return cleanup;
  }, [deleteMessageCtxRecipesListPage]);

  return (
    <div className="RecipeListPage">
      {/* button to show AddRecipe component */}
      <Button className='m-3' variant="outline-warning" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Add New Recipe'}
      </Button>
      {showForm && (
        <>
          <AddRecipe
            callbackToUpdateList={getAllRecipes}
            setCreateMessage={setCreateMessage}
          />
        </>
      )}

      {/* show messages */}
      {createMessage && <p>{createMessage}</p>}
      {deleteMessage && <p>{deleteMessage}</p>}

      <hr />

      {/* render list of recipes */}
      <Container>
        <Row>
        {recipes.map((recipe) => {
          return (
            <Col key={recipe._id}>
              <RecipeCard
                recipe={recipe}
              />
            </Col>
          );
        })}
        </Row>
      </Container>
    </div>
  );
}

export default RecipesListPage;