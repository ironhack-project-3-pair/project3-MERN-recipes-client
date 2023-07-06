import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

// import axios from "axios";
// const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5005';

import ingredientsService from '../services/ingredients.service';
import messagesService from '../services/messages.service';

function AddIngredient(props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');

  //messages

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object representing the body of the POST request
    const requestBody = { name, emoji };

    // axios
    //   .post(`${API_URL}/api/ingredients`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
    ingredientsService
      .createIngredient(requestBody)
      .then((response) => {
        // Set message after successful creation
        messagesService.showCreateMessage(name, props.setCreateMessage);

        // Reset the state to clear the inputs
        setName('');
        setEmoji('');
        setErrorMessage('');

        // Invoke the callback function coming through the props
        // from the IngredientListPage, to refresh the list of ingredients
        props.refreshIngredientsList();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.error?.message) {
          // ValidationError
          setErrorMessage(error.response.data.error.errors.name.message);
        } else if (error.response.data.error.message2) {
          // MongoServerError

          setErrorMessage(
            'Ingredient name already exists. Provide different ingredient'
          );
        }
      });
  };

  return (
    <div className="AddIngredient">
      <h3>Add New Ingredient</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mt-3">
          <Form.Label className="mt-3">Name:</Form.Label>
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

        <Form.Label className="mt-3">Emoji:</Form.Label>
        <Form.Control
          type="text"
          name="emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
        />

        <Button className="mt-3" variant="outline-dark" type="submit">
          Add Ingredient
        </Button>
      </Form>
      {/* show message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default AddIngredient;
