import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Row } from 'react-bootstrap';


import recipesService from '../services/recipes.service';
import ingredientsService from '../services/ingredients.service';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

function EditRecipePage() {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [durationInMin, setDurationInMin] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);

//messages
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const { recipeId } = useParams();
  //pre-populate with details previously stored in DB
  const getRecipe = () => {
    recipesService
      .getRecipe(recipeId)
      .then((res) => {
        const recipeToEdit = res.data;

        setName(recipeToEdit.name);
        setInstructions(recipeToEdit.instructions);
        setDurationInMin(recipeToEdit.durationInMin);
        setRecipeIngredients(recipeToEdit.recipeIngredients);

        // If recipeIngredients is empty, add an empty ingredient
        if (recipeToEdit.recipeIngredients.length === 0) {
          addIngredient();
        }
      })
      .catch((e) => console.log('Error GET details from API', e));
  };

  //get all ingredients in the database to show in the ingredient selections
  const getAvailableIngredients = () => {
    
    ingredientsService
      .getAllIngredients()
      .then((res) => {
        setAvailableIngredients(res.data);
      })
      .catch((e) => console.log('Error GET available ingredients from API', e));
  };

  //add more ingredients to current recipe
  const addIngredient = () => {
    setRecipeIngredients([
      ...recipeIngredients,
      {
        ingredient: '',
        qtyInGrams: 0,
      },
    ]);
  };

  //delete ingredients from current recipe
  function removeIngredient(index) {

    // prevent user to remove last ingredient inputs
    if (recipeIngredients.length === 1) {
      return;
    }
    const newIngredients = [...recipeIngredients];
    newIngredients.splice(index, 1);
    setRecipeIngredients(newIngredients);
  }

  // Update an ingredient based on the index
  const updateIngredient = (index, inputField, inputFieldValue) => {
    const newRecipeIngredients = [...recipeIngredients];
    if (inputField === 'ingredient' && inputFieldValue === '') {
      // Set ingredient to an empty object when "No selection" is selected
      newRecipeIngredients[index][inputField] = {};
    } else {
      newRecipeIngredients[index][inputField] = inputFieldValue;
    }
    setRecipeIngredients(newRecipeIngredients);
  };

  useEffect(() => {
    getAvailableIngredients();
    getRecipe();
  }, [recipeId]); //change the state when the id of the recipe is different


  //Methods of validation inputs of creating new recipe
  const isRecipeNameProvided = () => {
    if (!name) {
      setErrorMessage(
        "Recipe's name is required. Please provide a name for the recipe."
      );
      return false;
    }
    return true;
  };

  const isRecipeNameUnique = async () => {
    try {
      const response = await recipesService.getAllRecipes();
      const recipes = response.data;

      console.log('name------', name);

      for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].name === name && recipes[i]._id !== recipeId) {
          setErrorMessage(
            'The recipe name already exists. Provide different name'
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log('Error checking uniqueness of recipe name', error);
      setErrorMessage('Recipe name needs to be unique');
      return false;
    }
  };

  // Ensure that ingredients are valid
  const areIngredientsValid = () => {
    // Make sure there is at least one ingredient
    if (recipeIngredients.length === 0) {
      setErrorMessage('At least one ingredient is required');
      return false;
    }

    const invalidIngredients = recipeIngredients.filter((ingredient) => {
      // Make sure ingredient is not 'No selection' or an empty string
      return (
        !ingredient.ingredient ||
        ingredient.ingredient === 'No selection' ||
        ingredient.qtyInGrams <= 0
      );
    });

    if (invalidIngredients.length > 0) {
      setErrorMessage('Please provide valid ingredient and quantity');
      return false;
    }

    return true;
  };

  //update current recipe details with new details
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate if recipe name is provided
      if (!isRecipeNameProvided()) {
        throw new Error(
          "Recipe's name is required. Please provide a name for the recipe."
        );
      }

      // Validate if recipe name is unique
      let isNameUnique = await isRecipeNameUnique();
      if (!isNameUnique) {
        throw new Error(
          'The recipe name already exists. Provide different name'
        );
      }

      // Validate user input for ingredients:
      if (!areIngredientsValid()) {
        throw new Error(
          'Please provide valid ingredient and quantity should be greater than 0'
        );
      }
    
      // After passing the validation checks, create the new recipe
      const newDetails = {
        name,
        instructions,
        durationInMin,
        recipeIngredients,
      };

      await recipesService
      .updateRecipe(recipeId, newDetails);
      
      navigate(`/recipes/${recipeId}`);
      
    } catch(e) {console.log('Error PUT update to API', e)};
  };

  return (
    <div className="EditRecipePage mt-3">
      {/* <Container className='m-3'> */}
        <h3 className='d-flex justify-content-center'>Edit Recipe</h3>

        <Form  onSubmit={handleSubmit}>
          {/* Input field Name */}
          <Form.Group className="mt-3">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Text className="d-block text-end text-muted px-3">
              Name is required.
            </Form.Text>
          </Form.Group>

          {/* Input field Instructions */}
          <Form.Group className="mt-3">
            <Form.Label>Instructions:</Form.Label>
            <Form.Control
              as="textarea"
              name="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Form.Group>

          {/* Input field Preparation */}
          <Form.Group className="mt-3">
            <Form.Label>Preparation (minutes):</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="durationInMin"
              value={durationInMin}
              onChange={(e) => setDurationInMin(e.target.value)}
            />
          </Form.Group>

          {/* Input field recipeIngredients */}
          {recipeIngredients.map((ingredient, index) => (
            <Form.Group className="mt-3" key={index}>
              <Form.Label className="m-0 p-0 d-flex align-items-center justify-content-center">
                {`Ingredient: ${index + 1}`}
                {/* button to delete ingredient */}

                <Button
                  className="text-decoration-none link-hover pb-3"
                  variant="link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1.7rem',
                    color: 'black',
                  }}
                  type={'button'}
                  onClick={() => removeIngredient(index)}
                  disabled={recipeIngredients.length === 1}
                >
                  x
                </Button>


                {/* button to add ingredient */}

                <Button
                  className="text-decoration-none link-hover pb-3"
                  variant="link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1.7rem',
                    color: 'black',
                  }}
                  type={'button'}
                  onClick={addIngredient}
                >
                  +
                </Button>
              </Form.Label>

              {/* Select ingredients from availableIngredients in DB */}
              <Row className="ingredient-row">
                <FormGroup>
                  <Form.Select
                    className="m-0"
                    as="select"
                    name="ingredient"
                    value={ingredient.ingredient ? ingredient.ingredient._id : ''}
                    onChange={(e) =>
                      updateIngredient(index, 'ingredient', e.target.value)
                    }
                  >
                    {/* No Selection option */}
                    <option value="">No selection</option>
                    {availableIngredients.map((availIngredient) => (
                      <option
                        key={availIngredient._id}
                        value={availIngredient._id}
                      >
                        {availIngredient.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="d-block pt-0 text-end text-muted pe-1">
                    Ingredient's required
                  </Form.Text>
                </FormGroup>

                {/* input field for qtyInGrams */}
                <FormGroup>
                  <Form.Control
                    type="number"
                    min="1"
                    name="qtyInGrams"
                    value={ingredient.qtyInGrams}
                    onChange={(e) =>
                      updateIngredient(index, 'qtyInGrams', e.target.value)
                    }
                  />
                  <Form.Text className="d-block pt-0 text-end text-muted pe-1">
                    Must greater than 0
                  </Form.Text>
                </FormGroup>
              </Row>
            </Form.Group>
          ))}
          <Button className="mt-3" variant="outline-dark" type="submit">
            Add Recipe
          </Button>
        </Form>

        {/* show message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      {/* </Container> */}
    </div>
  );
}
export default EditRecipePage;
