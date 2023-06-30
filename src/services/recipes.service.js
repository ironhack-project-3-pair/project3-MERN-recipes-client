import axios from 'axios';

class RecipesService {
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

  // POST /api/recipes
  createRecipe = requestBody => {
    return this.api.post('/api/recipes', requestBody);
  };

  // GET /api/recipes
  getAllRecipes = () => {

    return this.api.get('/api/recipes') // if the server returns an error, axios will reject the promise and set the value the promise was rejected with to the error
      .then(undefined, onRejectedReason => { // onFulfilled is not a function (undefined), so it is replaced by the identity function ((x) => x) which simply passes the fulfillment value forward
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#return_value
        // return onRejectedReason // the returned promise gets **fulfilled** with the error as its value
        throw onRejectedReason // the returned promise gets **rejected** with the error as its value
      })
      // this previous .then() has no effect :)
      .catch(error => { // shortcut for Promise.prototype.then(undefined, onRejected)
        if (error.response.data.UnauthorizedError.name === "TokenExpiredError") {
          console.log("token expired!");
          // Hooks (useContext API) can only be called inside of the body of a function component
          // so not possible to retreive the logOutUser function in this service :(
        }
        throw error; 
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch#return_value
        // Promise.prototype.catch() returns a new promise, always pending when returned, regardless of the current promise's status. 
        // It's eventually rejected if onRejected throws an error or returns a Promise which is itself rejected; otherwise, it's eventually fulfilled.
        // 
        // The thrown error will be catched by the function scheduled by the call to the catch() method on the promise returned by this catch() method
      })
      // The error TokenExpiredError must still be handled here after adding 
      // the IsPrivate parent component to protect the route, because in the 
      // commit phase, the getAllRecipes() effect from the RecipesListPage 
      // child component will be called first
  };

  // GET /api/recipes/:id
  getRecipe = id => {
    return this.api.get(`/api/recipes/${id}`);
  };

  // PUT /api/recipes/:id
  updateRecipe = (id, requestBody) => {
    return this.api.put(`/api/recipes/${id}`, requestBody);
  };

  // DELETE /api/recipes/:id
  deleteRecipe = id => {
    return this.api.delete(`/api/recipes/${id}`);
  };
}

// Create one instance object
const recipesService = new RecipesService();

export default recipesService;