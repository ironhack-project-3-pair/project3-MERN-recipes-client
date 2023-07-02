import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import recipesService from '../services/recipes.service';
import axios from 'axios';

const API_URL = 'http://localhost:5005';

function EditRecipePage() {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [durationInMin, setDurationInMin] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);

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

  //get all ingredients in the database
  const getAvailableIngredients = () => {
    // Get the token from the localStorage
    const storedToken = localStorage.getItem('authToken');

    axios
      .get(`${API_URL}/api/ingredients`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
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
        qtyInGrams: '',
      },
    ]);
  };

  //delete ingredients from current recipe
  function removeIngredient(index) {
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

  //update current recipe details with new details
  const handleSubmit = (e) => {
    e.preventDefault();

    const newDetails = {
      name,
      instructions,
      durationInMin,
      recipeIngredients,
    };

    recipesService
      .updateRecipe(recipeId, newDetails)
      .then(() => {
        navigate(`/recipes/${recipeId}`);
      })
      .catch((e) => console.log('Error PUT update to API', e));
  };

  return (
    <div className="EditRecipePage">
      <form onSubmit={handleSubmit}>
        <label>Name (* required):</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Instructions:</label>
        <textarea
          name="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <label>Preparation (minutes):</label>
        <input
          type="Number"
          min="1"
          name="durationInMin"
          value={durationInMin}
          onChange={(e) => setDurationInMin(e.target.value)}
        />

        {recipeIngredients.map((ingredient, index) => (
          <div key={index}>
            <label className="ingredient-label">
              {`Ingredient: ${index+1}`}
              <span>
                <button onClick={() => removeIngredient(index)}>x</button>
              </span>
              <span>
                <button onClick={addIngredient}>
                  +
                </button>
              </span>
            </label>

            <div className="ingredient-row">
              <select
                className="option-input"
                name="ingredient"
                value={ingredient.ingredient ? ingredient.ingredient._id : ''}
                onChange={(e) =>
                  updateIngredient(index, 'ingredient', e.target.value)
                }
              >
                <option value="">No selection</option>
                {availableIngredients.map((availIngredient) => (
                  <option key={availIngredient._id} value={availIngredient._id}>
                    {availIngredient.name}
                  </option>
                ))}
              </select>

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
export default EditRecipePage;
