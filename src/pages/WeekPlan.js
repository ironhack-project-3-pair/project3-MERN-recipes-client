import { useState, useEffect } from 'react';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

import weekPlanService from '../services/weekPlan.service';
import recipesService from '../services/recipes.service'
import userIngredientsService from '../services/userIngredients.service';

function WeekPlan() {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE) console.log('WeekPlan: rendering (mounting) or re-rendering (updating)');

  const [weekPlan, setWeekPlan] = useState({});

  const getWeekPlan = () => {
    // Get the token from the localStorage
    // const storedToken = localStorage.getItem('authToken');

    // axios
    //   .get(`${API_URL}/api/week-plan`, {
    //     headers: { Authorization: `Bearer ${storedToken}` },
    weekPlanService.getWeekPlan()
      .then((response) => {
        setWeekPlan(response.data);
      })
      .catch((error) => {
        console.log(
          'error getting weekPlan: ',
          error,
          error.response.data
        );
      });
  };

  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE) console.log("WeekPlan: effect hook")
    getWeekPlan();
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
  const slotsNames = [
    "Lunch",
    "Dinner"
  ]

  const handleClick = (recipeId, consumingDay, consumingSlotOfDay) => {
    // recipeId param unnecessary, because it could also be retrieved with:
    // const recipeId = weekPlan.weekPlanRecipes[consumingDay][consumingSlotOfDay].recipe._id)
    consumeUserIngredients(recipeId)
      .then(response => updateWeekPlan(consumingDay, consumingSlotOfDay))
      .catch(e => console.log("error handling click: ", e));
  }

  const consumeUserIngredients = (recipeId) => {
    let consumingRecipe;
    return recipesService
      .getRecipe(recipeId)
      .then(response => {
        consumingRecipe = response.data;
        return userIngredientsService.getAllUserIngredients();
      })
      .then(response => {
        const userIngredients = response.data;
        return Promise.all(
          consumingRecipe.recipeIngredients
            .map(consumingRecipeIngredient => {
              return userIngredients
                .filter(userIngredient => {
                  return userIngredient.ingredient._id.toString() === consumingRecipeIngredient.ingredient._id.toString();
                })
                .map(consumingUserIngredient => {
                  return userIngredientsService
                    .updateUserIngredient(consumingUserIngredient._id, {qtyInGrams: -consumingRecipeIngredient.qtyInGrams})
                })[0];
            })
        ) 
      })
      .then(response => {
        console.log(response)
        return response
      })
      .catch(e => {
        console.log("error consuming user ingredients: ", e)
        throw e;
      })

  }

  const updateWeekPlan = (consumingDay, consumingSlotOfDay) => {
    const newWeekPlan = {...weekPlan};
    newWeekPlan.weekPlanRecipes[consumingDay][consumingSlotOfDay].consumed = true;
    weekPlanService.updateWeekPlan(newWeekPlan)
      .then(response => {
        setWeekPlan(newWeekPlan);
      })
      .catch(e => {
        console.log("error updating week plan: ", e)
      })
  }

  const resetWeekPlan = () => {
    weekPlanService.resetWeekPlan()
      .then(response => {
        const weekPlan = response.data;
        setWeekPlan(weekPlan);
        console.log(weekPlan)
      })
      .catch(e => {
        console.log("error resetting week plan: ", e)
      })
  }

  return (
    <div className="WeekPlan">
      <button onClick={resetWeekPlan}> Reset Week Plan </button>
      { weekPlan.weekPlanRecipes
        ? days.map(day => {
          return (
            <div key={day} className="WeekPlan-day-wrapper" id={day}>
              <h2>{day.slice(3)}</h2>
              { weekPlan.weekPlanRecipes[day]?.length > 0 &&
                <div className="WeekPlan-day-recipes-wrapper">
                  { weekPlan.weekPlanRecipes[day].map((weekPlanRecipe, i) => {
                    return weekPlanRecipe.recipe &&
                      <div key={weekPlanRecipe.recipe?._id + "." + i} className="WeekPlan-day-recipe-wrapper">
                        <h3>{slotsNames[i]}</h3>
                        <h4>{weekPlanRecipe.recipe?.name}</h4>
                        { !weekPlanRecipe.consumed
                          ? <button onClick={() => handleClick(weekPlanRecipe.recipe?._id, day, i)}> Consume </button>
                          : <p>Consumed</p>
                        }
                      </div>
                  })}
                </div>
              }
            </div>
          )
        })
        : <p>Loading...</p>
      }
    </div>
  );
}

export default WeekPlan;