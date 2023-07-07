import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';

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
  const [query, setQuery] = useState(''); // for the search functionality
  const [quantities, setQuantities] = useState({});
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

  // messages
  const [warningMessage, setWarningMessage] = useState('');
  const [addMessage, setAddMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  // hide addIngredient form by default
  const [showForm, setShowForm] = useState(false);

  const getAllIngredients = () => {
    // axios
    //   .get(`${API_URL}/api/ingredients`, {
    //     headers: { Authorization: `Bearer ${storedToken}` },
    //   })
    setIsLoadingIngredients(true);
    ingredientsService
      .getAllIngredients()
      .then((response) => {
        setIsLoadingIngredients(false);
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

  // handle input for qtyInGrams
  // use ingredient's _id as key of the quantities stateful variable object
  const handleQtyChange = (e, id) => {
    // if (isNaN(Number(e.target.value))) e.target.value = ""; 
    // prevent user from using negative number even if its the logic of the consume feature of the app
    // no, "-" does not trigger the event
    if (Number(e.target.value) < 0) {
      e.target.value = ""
      messagesService.showWarningMessage(
        ingredients.find(ingredient => ingredient._id.toString() === id).name,
        setWarningMessage
      );
    }
    setQuantities({...quantities, [id]: e.target.value});
  };

  const handleAddToKitchen = (ingredientToAdd) => {
    // check if the ingredient is already in the user's kitchen
    const existingIngredient = userIngredients.find(
      (userIngredient) => userIngredient.ingredient._id === ingredientToAdd._id
    );

    // check if the quantity is provided
    const ingredientQty = quantities[ingredientToAdd._id];
    if (!ingredientQty) {
      messagesService.showWarningMessage(
        ingredientToAdd.name,
        setWarningMessage
      );
      return;
    }

    // update quantity for existing ingredient
    if (existingIngredient) {
      const updatedQuantity = parseInt(quantities[ingredientToAdd._id]);

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
          // show update message
          messagesService.showUpdateMessage(
            existingIngredient.ingredient.name,
            setUpdateMessage
          );

          // refresh the ingredients list
          getAllIngredients();
        })
        .catch((error) => {
          console.log('Error updating quantity in kitchen', error);
        });
    } else {
      // add a new ingredient to the kitchen
      // axios
      //   .post(
      //     `${API_URL}/api/user-ingredients`,
      //     {
      //       // userId: 'user-id', // replace with the actual user id
      //       ingredientId: ingredientToAdd._id,
      //       qtyInGrams: quantities[ingredientToAdd._id],
      //     },
      //     {
      //       headers: { Authorization: `Bearer ${storedToken}` },
      //     }
      //   )
      userIngredientsService
        .addUserIngredient({
          ingredientId: ingredientToAdd._id,
          qtyInGrams: quantities[ingredientToAdd._id],
        })
        .then((response) => {
          // show update message
          messagesService.showAddMessage(ingredientToAdd.name, setAddMessage);
          setUserIngredients([
            ...userIngredients,
            response.data[response.data.length - 1],
          ]);
          // refresh the ingredients list
          getAllIngredients();
        })
        .catch((error) => {
          console.log('Error adding ingredient to kitchen', error);
        });
    }
    setQuantities({}); // clear the controlled input fields
  };

  // filter ingredients from the whole list of ingredients according to search query
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
        <Button
          className="m-3"
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
              <Form.Control
                aria-label="Input Label"
                name="search"
                value={query}
                type="text"
                onChange={handleInput}
                placeholder="Search public ingredients"
              />
            </Col>
          </Row>
        </Container>
        {/* showing message if theres search input */}
        {query !== '' &&
          (filteredIngredients.length === 0
            ? 'No result found'
            : `${filteredIngredients.length} results`)}

        {/* show messages */}
        {warningMessage && <p>{warningMessage}</p>}
        {addMessage && <p>{addMessage} to Kitchen</p>}
        {updateMessage && <p>{updateMessage}</p>}

        <hr />
        
        { isLoadingIngredients && <p>Loading ingredients...</p> }
        { !!ingredients.length && 
          filteredIngredients.map((ingredient) => {
            return (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
                isDelete={true}
              >

                <Col xs={7} md={7}>
                  <InputGroup className="d-flex align-items-center">
                    <Form.Control
                      aria-label="Quantity of ingredient in grams"
                      min={0}
                      type="number"
                      value={quantities[ingredient._id] || ''}
                      onChange={(e) => handleQtyChange(e, ingredient._id)}
                      placeholder="qty"
                    />
                    <InputGroup.Text>g</InputGroup.Text>
                  </InputGroup>
                </Col>

                {/*
                <Col xs={7} md={7}>
                  <Form.Label className="d-flex align-items-center mb-0">
                  <Form.Control className="me-2"
                    aria-label="Quantity of ingredient in grams"
                    min={0}
                    type="number"
                    // does not prevent negative number....
                    value={quantities[ingredient._id] || ''}
                    onChange={(e) => handleQtyChange(e, ingredient._id)}
                    placeholder="qty"
                  />
                    <span>g</span>
                  </Form.Label>
                </Col>
                */}

                <Col xs={3} md={3}>
                  <Button
                    variant="outline-warning"
                    className="align-self-center btn btn-outline-warning mx-1"
                    onClick={() => handleAddToKitchen(ingredient)}
                  >
                    +
                  </Button>
                </Col>
              </IngredientCard>
            );
          })
        }
      </div>
    );
  }
}

export default IngredientsListPage;
