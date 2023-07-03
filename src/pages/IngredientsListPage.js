import { useState, useEffect } from 'react';
import { Button, Col } from 'react-bootstrap';

import AddIngredient from '../components/AddIngredient';

import axios from 'axios';
import IngredientCard from '../components/IngredientCard';
const API_URL = 'http://localhost:5005';

function IngredientsListPage() {
  console.log('rendering IngredientsListPage');

  const [ingredients, setIngredients] = useState([]);
  const [query, setQuery] = useState(''); //query for search functionality
  const [quantity, setQuantity] = useState('');

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

  //Handle input for qtyInGrams
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  //Filter ingredients from the whole list of ingredients according to search input
  let filteredIngredients = ingredients;
  if (ingredients === null) {
    return <p>loading...</p>;
  } else {
    const handleInput = (e) => {
      setQuery(e.target.value);
    };
    filteredIngredients = ingredients.filter((ingredient) => {
      return ingredient.name.toLowerCase().includes(query.toLowerCase());
    });

    return (
      <div className="IngredientsListPage">
        {/* button to show AddIngredient form */}
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Add New Ingredient'}
        </button>
        {showForm && (
          <AddIngredient refreshIngredientsList={getAllIngredients} />
        )}
        {/* search bar */}
        <div>
          {/* <label for="search" className="mx-2">
            Search
          </label> */}
          <input
            aria-label="Input Label"
            name="search"
            className="col-10"
            value={undefined}
            type="text"
            onChange={handleInput}
            placeholder="Search your ingredients here"
          />
        </div>

        {/* showing message if theres search input */}
        {query !== '' &&
          (filteredIngredients.length === 0
            ? 'No result found'
            : `${filteredIngredients.length} results`)}

        <hr />

        {filteredIngredients.map((ingredient) => {
          return (
            <IngredientCard
              key={ingredient._id}
              ingredient={ingredient}
              isDelete={true}
            >
             
            </IngredientCard>
          );
        })}
      </div>
    );
  }
}

export default IngredientsListPage;
