import axios from 'axios';


class WeekPlanService {
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

  // PUT /api/week-plan
  updateWeekPlan = requestBody => {
    return this.api.put('/api/week-plan', requestBody);
  };
  resetWeekPlan = () => {
    return this.getWeekPlan()
      .then(response => {
        const weekPlan = response.data;
        weekPlan.weekPlanRecipes = {};
        return this.updateWeekPlan(weekPlan);
      })
      .catch(e => {
        throw e;
      })
  };

  // GET /api/week-plan
  getWeekPlan = () => {
    return this.api.get('/api/week-plan')
  };

}

// Create one instance object
const weekPlanService = new WeekPlanService();

export default weekPlanService;