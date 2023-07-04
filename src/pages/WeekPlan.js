import { useState, useEffect } from 'react';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

import weekPlanService from '../services/weekPlan.service';

function WeekPlan() {
  console.log('rendering WeekPlan');

  const [weekPlanRecipes, setWeekPlanRecipes] = useState({});

  const getWeekPlanRecipes = () => {
    // Get the token from the localStorage
    const storedToken = localStorage.getItem('authToken');

    // axios
    //   .get(`${API_URL}/api/week-plan`, {
    //     headers: { Authorization: `Bearer ${storedToken}` },
    weekPlanService.getWeekPlan()
      .then((response) => {
        setWeekPlanRecipes(response.data.weekPlanRecipes);
      })
      .catch((error) => {
        console.log(
          'error getting weekPlanRecipes: ',
          error,
          error.response.data
        );
      });
  };

  useEffect(() => {
    getWeekPlanRecipes();
  }, []);

  const days = [
    "dayMonday",
    "dayTuesday",
    "dayWednesday",
    "dayThursday",
    "dayFriday",
    "daySaturday",
    "daySunday"
  ]

  return (
    <div className="WeekPlan">
      { days.map(day => {
        return (
          <div key={day} className="WeekPlan-day-wrapper" id={day}>
            <h2>{day.slice(3)}</h2>
            { weekPlanRecipes[day]?.length > 0 &&
              <div className="WeekPlan-day-recipes-wrapper">
                {weekPlanRecipes[day].map((recipe, i) => {
                  return recipe &&
                    <div key={recipe._id + "_" + i} className="WeekPlan-day-recipe-wrapper">
                      {recipe.name}
                    </div>
                })}
              </div>
            }
          </div>
        )
      })}
    </div>
  );
}

export default WeekPlan;