import axios from 'axios';

class UserIngredientsService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5005',
    });

    // Automatically set JWT token in the headers for every request
    this.api.interceptors.request.use((config) => {
      // Retrieve the JWT token from the local storage
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }

      return config;
    });
  }

  // POST /api/user-ingredients
  createUserIngredient = (requestBody) => {
    return this.api.post('/api/user-ingredients', requestBody);
  };

  // GET /api/user-ingredients
  getAllUserIngredients = () => {
    return this.api.get('/api/user-ingredients');
  };

  // GET /api/user-ingredients/:userIngredientId
  getUserIngredient = (userIngredientId) => {
    return this.api.get(`/api/user-ingredients/${userIngredientId}`);
  };

  // PUT /api/user-ingredients/:userIngredientId
  updateUserIngredient = (userIngredientId, requestBody) => {
    return this.api.put(`/api/user-ingredients/${userIngredientId}`, requestBody);
  };

  // DELETE /api/user-ingredients/:userIngredientId
  deleteUserIngredient = (userIngredientId) => {
    return this.api.delete(`/api/user-ingredients/${userIngredientId}`);
  };
}

// Create one instance object
const userIngredientsService = new UserIngredientsService();

export default userIngredientsService;
