import { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Row } from 'react-bootstrap';

import recipesService from '../services/recipes.service';
import ingredientsService from '../services/ingredients.service';
import messagesService from '../services/messages.service';

import axios from 'axios';
const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5005';

function AddRecipe(props) {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [durationInMin, setDurationInMin] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState([
    {
      ingredient: 'No selection',
      qtyInGrams: 0,
    },
  ]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [picture, setPicture] = useState("");

  //messages
  const [errorMessage, setErrorMessage] = useState('');

  // get all ingredients in the database
  const getAvailableIngredients = () => {
    // // Get the token from the localStorage
    // const storedToken = localStorage.getItem('authToken');

    // axios
    //   .get(`${API_URL}/api/ingredients`, {
    //     headers: { Authorization: `Bearer ${storedToken}` },
    //   })
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

  // //delete ingredients from current recipe
  function removeIngredient(index) {
    const newIngredients = [...recipeIngredients];
    newIngredients.splice(index, 1);
    setRecipeIngredients(newIngredients);
  }

  // Update an ingredient based on the index
  const updateIngredient = (index, inputField, inputFieldValue) => {
    const newRecipeIngredients = [...recipeIngredients];
    newRecipeIngredients[index][inputField] = inputFieldValue;
    setRecipeIngredients(newRecipeIngredients);
  };

  useEffect(() => {
    getAvailableIngredients();
  }, []);

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
        if (recipes[i].name === name) {
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

  const areIngredientsValid = () => {
    const invalidIngredients = recipeIngredients.filter((ingredient) => {
      return ingredient.ingredient === '' || ingredient.qtyInGrams <= 0;
    });

    if (invalidIngredients.length > 0) {
      setErrorMessage('Please provide valid ingredient and quantity');
      return false;
    }

    return true;
  };

  const handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append("picture", e.target.files[0]);
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      axios.post(API_URL + "/api/upload", uploadData, { 
        headers: { Authorization: `Bearer ${storedToken}`}
      })
        .then(response => {
          setPicture(response.data.picture);
        })
        .catch(err => console.log("Error while uploading the file: ", err));
    } else {
      console.log("token required for upload");
    }
  };

  //create new recipe
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
      const invalidIngredients = recipeIngredients.filter((ingredient) => {
        return ingredient.ingredient === '' || ingredient.qtyInGrams <= 0;
      });

      if (invalidIngredients.length > 0) {
        throw new Error(
          'Please provide valid ingredient and quantity should be greater than 0'
        );
      }

      // After passing the validation checks, create the new recipe
      const newRecipe = {
        name,
        instructions,
        durationInMin,
        recipeIngredients,
        picture
      };

      const response = await recipesService.createRecipe(newRecipe);
      
      // Set message after successful creation
      messagesService.showCreateMessage(name, props.setCreateMessage);

      // To update the recipe list
      props.callbackToUpdateList();

      // Reset the state
      setName('');
      setInstructions('');
      setDurationInMin('');
      setRecipeIngredients([
        {
          ingredient: '',
          qtyInGrams: 0,
        },
      ]);
      setErrorMessage(''); // Clear any error messages
      setPicture("");
    } catch (error) {
      console.log('Error while validating or creating recipe', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="AddRecipe ">
      <h3>Add New Recipe</h3>

      <Form onSubmit={handleSubmit}>
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

        <Form.Control type="file" onChange={(e) => handleFileUpload(e)} />

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
                <Form.Control
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
                </Form.Control>
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
    </div>
  );
}
export default AddRecipe;
