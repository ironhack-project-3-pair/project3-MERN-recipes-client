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
  const [quantity, setQuantity] = useState({});
  const [userIngredients, setUserIngredients] = useState([]);

  //message
  const [errorMessage, setErrorMessage] = useState('');

  // Get the token from the localStorage
  const storedToken = localStorage.getItem('authToken');

  //hide addIngredient form by default
  const [showForm, setShowForm] = useState(false);

  const getAllIngredients = () => {
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

  //Get userIngredients
  const getUserIngredients = () => {
    axios
      .get(`${API_URL}/api/user-ingredients`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setUserIngredients(res.data);
        console.log('USERINGREDIENT------', res.data);
      })
      .catch((error) => {
        console.log(
          'error getting the userIngredients:',
          error,
          error.response.data
        );
      });
  };

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {
    getAllIngredients();
    getUserIngredients();
  }, []);

  // Handle input for qtyInGrams,
  // use ingredient's _id as key of the quantity object
  const handleQuantityChange = (e, id) => {
    setQuantity({
      ...quantity,
      [id]: e.target.value,
    });
  };

  const handleAddToKitchen = (ingredientToAdd) => {
    // Check if the ingredient is already in the user's kitchen
    const existingIngredient = userIngredients.find(
      (userIngredient) => userIngredient.ingredient._id === ingredientToAdd._id
    );

    // Check if the quantity is provided
    const ingredientQuantity = quantity[ingredientToAdd._id];

    if (!ingredientQuantity) {
      setErrorMessage('Please provide a quantity for the ingredient');
      return;
    }

    //update quantity for existing ingredient
    if (existingIngredient) {
      const updatedQuantity = parseInt(quantity[ingredientToAdd._id]);

      axios
        .put(
          `${API_URL}/api/user-ingredients/${existingIngredient._id}`,
          {
            //       userId: 'user-id', // Replace with the actual user ID
            qtyInGrams: updatedQuantity,
          },
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        )
        .then((response) => {
          console.log(
            `Updated quantity for ${existingIngredient.ingredient.name} in kitchen`,
            existingIngredient
          );
          // Refresh the ingredients list
          getAllIngredients();
          setQuantity({}); // Clear the input field
          setErrorMessage(''); // Clear the error message
        })
        .catch((error) => {
          console.log('Error updating quantity in kitchen', error);
        });
    } else {
      // Add a new ingredient to the kitchen
      axios
        .post(
          `${API_URL}/api/user-ingredients`,
          {
            // userId: 'user-id', // Replace with the actual user ID
            ingredientId: ingredientToAdd._id,
            qtyInGrams: quantity[ingredientToAdd._id],
          },
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        )
        .then((response) => {
          console.log(`Added ${ingredientToAdd.name} to kitchen`);
          // Refresh the ingredients list
          getAllIngredients();
        })
        .catch((error) => {
          console.log('Error adding ingredient to kitchen', error);
        });
    }
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

        {/* Show the error message */}
        {errorMessage && <p>{errorMessage}</p>}

        <hr />

        {filteredIngredients.map((ingredient) => {
          return (
            <IngredientCard
              key={ingredient._id}
              ingredient={ingredient}
              isDelete={true}
              className="flex-row"
            >
              <Col className="flex-row justify-content-center ">
                <input
                  min={0}
                  type="number"
                  value={quantity[ingredient._id] || ''}
                  onChange={(e) => handleQuantityChange(e, ingredient._id)}
                  placeholder="g"
                />
                <Button
                  className="text-decoration-none"
                  onClick={() => handleAddToKitchen(ingredient)}
                >
                  Add to Kitchen
                </Button>
              </Col>
            </IngredientCard>
          );
        })}
      </div>
    );
  }
}

export default IngredientsListPage;
