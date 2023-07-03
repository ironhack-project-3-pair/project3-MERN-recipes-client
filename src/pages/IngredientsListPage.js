import { useState, useEffect } from 'react';

import AddIngredient from '../components/AddIngredient';

import axios from 'axios';
const API_URL = 'http://localhost:5005';

function IngredientsListPage() {
  console.log('rendering IngredientsListPage');

  const [ingredients, setIngredients] = useState([]);

  //hide addIngredient form by default
  const [showForm, setShowForm] = useState(false);

  const getAllIngredients = () => {
    // Get the token from the localStorage
    const storedToken = localStorage.getItem('authToken');

    axios
      .get(`${API_URL}/api/ingredients`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setIngredients(response.data);
      })
      .catch((error) => {
        console.log(
          'error getting the ingredients: ',
          error,
          error.response.data
        );
      });
  };

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {
    getAllIngredients();
  }, []);

  return (
    <div className="IngredientsListPage">
      {/* button to show form */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Add New Ingredient'}
      </button>
      {showForm && <AddIngredient refreshIngredientsList={getAllIngredients} />}

      <ul>
        {ingredients.map((ingredient) => {
          return (
            <li key={ingredient._id}>
              {ingredient.name} {ingredient.emoji}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default IngredientsListPage;
