import { useEffect, useState } from 'react';

import recipesService from '../services/recipes.service';
import ingredientsService from '../services/ingredients.service';
import messagesService from '../services/messages.service';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

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

  //create new recipe
  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecipe = {
      name,
      instructions,
      durationInMin,
      recipeIngredients,
    };

    recipesService
      .createRecipe(newRecipe)
      .then(() => {
        //set message after creation
        messagesService.showCreateMessage(name, props.setCreateMessage);
        //To update the recipe list
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
      })
      .catch((e) => console.log('Error POST newRecipe to API', e));
  };

  return (
    <div className="AddRecipe">
      <form onSubmit={handleSubmit}>
        {/* Input field Name */}
        <label>Name (* required):</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Input field Instructions */}
        <label>Instructions:</label>
        <textarea
          name="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        {/* Input field Preparation */}
        <label>Preparation (minutes):</label>
        <input
          type="Number"
          min="1"
          name="durationInMin"
          value={durationInMin}
          onChange={(e) => setDurationInMin(e.target.value)}
        />

        {/* Input field recipeIngredients */}
        {recipeIngredients.map((ingredient, index) => (
          <div key={index}>
            <label className="ingredient-label">
              {`Ingredient: ${index + 1}`}
              {/* button to delete ingredient */}
              <span>
                <button type={'button'} onClick={() => removeIngredient(index)}>
                  x
                </button>
              </span>
              {/* button to add ingredient */}
              <span>
                <button type={'button'} onClick={addIngredient}>
                  +
                </button>
              </span>
            </label>

            {/* Select ingredients from availableIngredients in DB */}
            <div className="ingredient-row">
              <select
                className="option-input"
                name="ingredient"
                value={ingredient.ingredient ? ingredient.ingredient._id : ''}
                onChange={(e) =>
                  updateIngredient(index, 'ingredient', e.target.value)
                }
              >
                {/* No Selection option */}
                <option value="">No selection</option>
                {availableIngredients.map((availIngredient) => (
                  <option key={availIngredient._id} value={availIngredient._id}>
                    {availIngredient.name}
                  </option>
                ))}
              </select>

              {/* Input field quantity */}
              <label className="qty-label">Qty (in gr):</label>
              <input
                className="qty-input"
                type="number"
                min="0"
                name="qtyInGrams"
                value={ingredient.qtyInGrams}
                onChange={(e) =>
                  updateIngredient(index, 'qtyInGrams', e.target.value)
                }
              />
            </div>
            <hr />
          </div>
        ))}

        <input type="submit" value="Submit" />
      </form>
      {/* <button onClick={deleteRecipe}>Delete Recipe</button> */}
    </div>
  );
}
export default AddRecipe;
