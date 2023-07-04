import { useState } from "react";

// import axios from "axios";
// const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5005';

import ingredientsService from '../services/ingredients.service';


function AddIngredient(props) {
  // Get the token from the localStorage
  const storedToken = localStorage.getItem("authToken");

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object representing the body of the POST request
    const requestBody = { name, emoji };

    // axios
    //   .post(`${API_URL}/api/ingredients`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
    ingredientsService
      .createIngredient(requestBody)
      .then((response) => {
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
          setErrorMessage(error.response.data.error?.message);
        } else {
          // MongoServerError
          setErrorMessage(error.response.data.error?.message2);
        }
      });
  };

  return (
    <div className="AddIngredient">
      <h3>Add New Ingredient</h3>

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Emoji:</label>
        <input
          type="text"
          name="emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
        />

        <button type="submit">Add Ingredient</button>
      </form>

      { errorMessage && <p className="error-message">{errorMessage}</p> }

    </div>
  );
}

export default AddIngredient;