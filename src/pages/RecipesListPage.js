import { Button, Container, Col, Form, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useContext } from 'react';

import { RecipesContext } from '../context/recipes.context';

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
  const [query, setQuery] = useState(''); //query for search functionality

  // messages
  const [deleteMessage, setDeleteMessage] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  const { deleteMessageCtxRecipesListPage } = useContext(RecipesContext);

  // hide addRecipe form by default
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
        ' cleaning after component removed from DOM (unmounted)'
      );
  };

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

  //Filter recipes from the whole list of recipes according to search input
  let filteredRecipes = recipes;
  if (recipes === null) {
    return <p>loading...</p>;
  } else {
    const handleInput = (e) => {
      setQuery(e.target.value);
    };
    filteredRecipes = recipes.filter((recipe) => {
      return recipe.name.toLowerCase().includes(query.toLowerCase());
    });

    return (
      <div className="RecipeListPage">
        {/* button to show AddRecipe component */}
        <Button
          className="m-3"
          variant="outline-warning"
          onClick={() => setShowForm(!showForm)}
        >
          {/* button to show AddRecipe form */}
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
        {/* search bar */}
        <Container>
          <Row>
            <Col lg={8} md={8} className="mx-auto">
              <Form.Control
                aria-label="Input Label"
                name="search"
                value={query}
                type="text"
                onChange={handleInput}
                placeholder="Search your recipes here"
              />
            </Col>
          </Row>
        </Container>
        {/* showing message if theres search input */}
        {query !== '' &&
          (filteredRecipes.length === 0
            ? 'No result found'
            : `${filteredRecipes.length} result${
                filteredRecipes.length > 1 ? 's' : ''
              }`)}

        {/* show messages */}
        {createMessage && <p>{createMessage}</p>}
        {deleteMessage && <p>{deleteMessage}</p>}

        <hr />

        <Container fluid>
          <Row className="justify-content-center m-3 p-2">
            {/* render list of recipesa */}
            {recipes.map((recipe) => {
              return (
                <RecipeCard
                  key={recipe._id}
                  callbackToUpdateList={getAllRecipes}
                  recipe={recipe}
                  setDeleteMessage={setDeleteMessage}
                />
              );
            })}
          </Row>
        </Container>
      </div>
    );
  }
}

export default RecipesListPage;
