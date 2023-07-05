import { useState, useEffect } from 'react';
import { Button, FormControl } from 'react-bootstrap';

import AddIngredient from '../components/AddIngredient';
import IngredientCard from '../components/IngredientCard';

import ingredientsService from '../services/ingredients.service';
import userIngredientsService from '../services/userIngredients.service';
import messagesService from '../services/messages.service';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

function IngredientsListPage() {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
    console.log(
      '%cIngredientsListPage:',
      'color: #badacc',
      ' rendering (mounting) or re-rendering (updating)'
    );

  const [ingredients, setIngredients] = useState([]);
  const [query, setQuery] = useState(''); //query for search functionality
  const [quantity, setQuantity] = useState({});
  const [userIngredients, setUserIngredients] = useState([]);

  //messages
  const [warningMessage, setWarningMessage] = useState('');
  const [addMessage, setAddMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  //hide addIngredient form by default
  const [showForm, setShowForm] = useState(false);

  const getAllIngredients = () => {
    // axios
    //   .get(`${API_URL}/api/ingredients`, {
    //     headers: { Authorization: `Bearer ${storedToken}` },
    //   })
    ingredientsService
      .getAllIngredients()
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
          'error getting the userIngredients:',
          error,
          error.response.data
        );
      });
  };

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cIngredientsListPage:%c effect hook',
        'color: #badacc',
        'color: red'
      );

    getAllIngredients();
    getUserIngredients();
    // each call updates a stateful variable
    // the component will sometime be rendered once, sometimes twice
    // using the updater function syntax of the useEffect hook (which takes the pending state and calculates/returns the next state from it)
    // does not change how react schedules and queues the update of the stateful variable
    // it is only intended to retieve the previous state
    // setStatefulVar(prevState => prevState + 1);
    // https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
    // so I think the component is re-rendered twice when the time elapsed between responses is greater than a certain value fixed by react...
    // good example to use Promise.all() --> see proof of concept in RecipeDetailsPage
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
      messagesService.showWarningMessage(
        ingredientToAdd.name,
        setWarningMessage
      );
      return;
    }

    //update quantity for existing ingredient
    if (existingIngredient) {
      const updatedQuantity = parseInt(quantity[ingredientToAdd._id]);

      // axios
      //   .put(
      //     `${API_URL}/api/user-ingredients/${existingIngredient._id}`,
      //     {
      //       //       userId: 'user-id', // Replace with the actual user ID
      //       qtyInGrams: updatedQuantity,
      //     },
      //     {
      //       headers: { Authorization: `Bearer ${storedToken}` },
      //     }
      //   )
      userIngredientsService
        .updateUserIngredient(existingIngredient._id, {
          qtyInGrams: updatedQuantity,
        })
        .then((response) => {
          //show message for update User Ingredient
          messagesService.showUpdateMessage(
            existingIngredient.ingredient.name,
            setUpdateMessage
          );

          // Refresh the ingredients list
          getAllIngredients();
        })
        .catch((error) => {
          console.log('Error updating quantity in kitchen', error);
        });
    } else {
      // Add a new ingredient to the kitchen
      // axios
      //   .post(
      //     `${API_URL}/api/user-ingredients`,
      //     {
      //       // userId: 'user-id', // Replace with the actual user ID
      //       ingredientId: ingredientToAdd._id,
      //       qtyInGrams: quantity[ingredientToAdd._id],
      //     },
      //     {
      //       headers: { Authorization: `Bearer ${storedToken}` },
      //     }
      //   )
      userIngredientsService
        .addUserIngredient({
          ingredientId: ingredientToAdd._id,
          qtyInGrams: quantity[ingredientToAdd._id],
        })
        .then((response) => {
          //show message for update User Ingredient
          messagesService.showAddMessage(ingredientToAdd.name, setAddMessage);
          setUserIngredients([...userIngredients, response.data[response.data.length - 1]])
          // Refresh the ingredients list
          getAllIngredients();
        })
        .catch((error) => {
          console.log('Error adding ingredient to kitchen', error);
        });
    }
    setQuantity({}); // Clear the input field
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
        <Button className='m-3'
          variant="outline-warning"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : 'Add New Ingredient'}
        </Button>
        {showForm && (
          <>
            <AddIngredient
              setCreateMessage={setCreateMessage}
              refreshIngredientsList={getAllIngredients}
            />
            {createMessage && <p>{createMessage}</p>}
          </>
        )}
        {/* search bar */}
        <Container>
          <Row>
            <Col lg={8} md={8} className="mx-auto">
              <FormControl
                aria-label="Input Label"
                name="search"
                value={query}
                type="text"
                onChange={handleInput}
                placeholder="Search your ingredients here"
              />
            </Col>
          </Row>
        </Container>
        {/* showing message if theres search input */}
        {query !== '' &&
          (filteredIngredients.length === 0
            ? 'No result found'
            : `${filteredIngredients.length} results`)}

        {/* Show the message */}
        {warningMessage && <p>{warningMessage}</p>}
        {addMessage && <p>{addMessage} to Kitchen</p>}
        {updateMessage && <p>{updateMessage}</p>}

        <hr />

        {filteredIngredients.map((ingredient) => {
          return (
            <IngredientCard
              key={ingredient._id}
              ingredient={ingredient}
              isDelete={true}
              className="flex-row"
            >
              {/* <Col className="col-7 "> */}
              <FormControl
                aria-label="Quantity of Ingredient in Gram"
                style={{ width: '7vw' }}
                className="col-2 px-1"
                min={0}
                type="number"
                value={quantity[ingredient._id] || ''}
                onChange={(e) => handleQuantityChange(e, ingredient._id)}
                placeholder="grams"
              />
              <Button
                variant="outline-warning"
                className="align-self-center btn btn-outline-warning col-4 mx-1"
                onClick={() => handleAddToKitchen(ingredient)}
              >
                +
              </Button>
              {/* </Col> */}
            </IngredientCard>
          );
        })}
      </div>
    );
  }
}

export default IngredientsListPage;
