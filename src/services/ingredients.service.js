import axios from 'axios';

class IngredientsService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5005'
    });

    // Automatically set JWT token in the headers for every request
    this.api.interceptors.request.use(config => {
      // Retrieve the JWT token from the local storage
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }

      return config;
    });
  }

  // POST /api/ingredients
  createIngredient = requestBody => {
    return this.api.post('/api/ingredients', requestBody);
  };

  // GET /api/ingredients
  getAllIngredients = () => {
    return this.api.get('/api/ingredients')
  };

  // GET /api/ingredients/:ingredientId
  getIngredient = ingredientId => {
    return this.api.get(`/api/ingredients/${ingredientId}`);
  };
}

// Create one instance object
const ingredientsService = new IngredientsService();

export default ingredientsService;