import { useState, useEffect } from 'react';
import { Container, Row, Button, Card, Col } from 'react-bootstrap';

// import axios from 'axios';
// const API_URL = 'http://localhost:5005';

import weekPlanService from '../services/weekPlan.service';
import recipesService from '../services/recipes.service';
import userIngredientsService from '../services/userIngredients.service';

function WeekPlan() {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
    console.log(
      '%cWeekPlan:',
      'color: #badaff',
      ' rendering (mounting) or re-rendering (updating)'
    );

  const [weekPlan, setWeekPlan] = useState({});

  const getWeekPlan = () => {
    // Get the token from the localStorage
    // const storedToken = localStorage.getItem('authToken');

    // axios
    //   .get(`${API_URL}/api/week-plan`, {
    //     headers: { Authorization: `Bearer ${storedToken}` },
    weekPlanService
      .getWeekPlan()
      .then((response) => {
        setWeekPlan(response.data);
      })
      .catch((error) => {
        console.log('error getting weekPlan: ', error, error.response.data);
      });
  };

  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log('%cWeekPlan:%c effect hook', 'color: #badaff', 'color: red');
    getWeekPlan();
  }, []);

  const days = [
    'dayMonday',
    'dayTuesday',
    'dayWednesday',
    'dayThursday',
    'dayFriday',
    'daySaturday',
    'daySunday',
  ];
  const slotsNames = ['Lunch', 'Dinner'];

  const handleClick = (recipeId, consumingDay, consumingSlotOfDay) => {
    // recipeId param unnecessary, because it could also be retrieved with:
    // const recipeId = weekPlan.weekPlanRecipes[consumingDay][consumingSlotOfDay].recipe._id)
    consumeUserIngredients(recipeId)
      .then((response) => updateWeekPlan(consumingDay, consumingSlotOfDay))
      .catch((e) => console.log('error handling click: ', e));
  };

  const consumeUserIngredients = (recipeId) => {
    let consumingRecipe;
    return recipesService
      .getRecipe(recipeId)
      .then((response) => {
        consumingRecipe = response.data;
        return userIngredientsService.getAllUserIngredients();
      })
      .then((response) => {
        const userIngredients = response.data;
        // return Promise.all(
        //   consumingRecipe.recipeIngredients
        //     .map(consumingRecipeIngredient => {
        //       return userIngredients
        //         .filter(userIngredient => {
        //           return userIngredient.ingredient._id.toString() === consumingRecipeIngredient.ingredient._id.toString();
        //         })
        //         .map(consumingUserIngredient => {
        //           return userIngredientsService
        //             .updateUserIngredient(consumingUserIngredient._id, {qtyInGrams: -consumingRecipeIngredient.qtyInGrams})
        //         })[0];
        //     })
        // ) // might send too many requests

        const newUserIngredients = [...userIngredients];
        consumingRecipe.recipeIngredients.forEach(
          (consumingRecipeIngredient) => {
            const newUserIngredient = newUserIngredients.find(
              (newUserIngredient2) => {
                return (
                  newUserIngredient2.ingredient._id.toString() ===
                  consumingRecipeIngredient.ingredient._id.toString()
                );
              }
            );
            if (newUserIngredient) {
              if (
                newUserIngredient.qtyInGrams >
                consumingRecipeIngredient.qtyInGrams
              )
                newUserIngredient.qtyInGrams -=
                  consumingRecipeIngredient.qtyInGrams;
              else {
                newUserIngredients.splice(
                  newUserIngredients.indexOf(newUserIngredient),
                  1
                );
              }
            }
          }
        );
        return userIngredientsService.updateUserIngredients(newUserIngredients);
      })
      .then((response) => {
        // console.log(response)
        return response;
      })
      .catch((e) => {
        console.log('error consuming user ingredients: ', e);
        throw e;
      });
  };

  const updateWeekPlan = (consumingDay, consumingSlotOfDay) => {
    const newWeekPlan = { ...weekPlan };
    newWeekPlan.weekPlanRecipes[consumingDay][
      consumingSlotOfDay
    ].consumed = true;
    weekPlanService
      .updateWeekPlan(newWeekPlan)
      .then((response) => {
        setWeekPlan(newWeekPlan);
      })
      .catch((e) => {
        console.log('error updating week plan: ', e);
      });
  };

  const resetWeekPlan = () => {
    weekPlanService
      .resetWeekPlan()
      .then((response) => {
        const weekPlan = response.data;
        setWeekPlan(weekPlan);
      })
      .catch((e) => {
        console.log('error resetting week plan: ', e);
      });
  };

  return (
    <div className="WeekPlan">
      <Button variant="outline-warning" onClick={resetWeekPlan}>
        {' '}
        Reset Week Plan{' '}
      </Button>
      <Container fluid>
        <Row className="cards-row m-3 p-2">
          {weekPlan.weekPlanRecipes ? (
            days.map((day) => {
              return (
                <Card
                  
                  key={day}
                  className="WeekPlan-day-wrapper col mx-3 my-3"
                  id={day}
                >
                  <Card.Title className="p-2" style={{ fontSize: '2rem' }}>
                    {day.slice(3)}
                  </Card.Title>
                  <Card.Body className="WeekPlan-day-recipes-wrapper">
                    {weekPlan.weekPlanRecipes[day]?.length > 0 &&
                      // always true since the default value was added for the day fields
                      weekPlan.weekPlanRecipes[day].map((weekPlanRecipe, i) => {
                        return weekPlanRecipe.recipe ? (
                          <Card
                            key={weekPlanRecipe.recipe?._id + '.' + i}
                            className="WeekPlan-day-recipe-wrapper"
                          >
                            <Card.Subtitle style={{fontSize:"1.3rem"}}>{slotsNames[i]}</Card.Subtitle>
                            <div>{weekPlanRecipe.recipe?.name}</div>
                            {!weekPlanRecipe.consumed ? (
                              <Button
                                variant='outline-dark'
                                className='m-3'
                                onClick={() =>
                                  handleClick(
                                    weekPlanRecipe.recipe?._id,
                                    day,
                                    i
                                  )
                                }
                              >
                                {' '}
                                Consume{' '}
                              </Button>
                            ) : (
                              <p>Consumed</p>
                            )}
                          </Card>
                        ) : (
                          <Card
                            key={'.' + i}
                            className="WeekPlan-day-recipe-empty-wrapper"
                          >
                            <Card.Subtitle style={{fontSize:"1.3rem"}}>{slotsNames[i]}</Card.Subtitle>
                            <div>Empty Slot</div>
                          </Card>
                        );
                      })}
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <p>Loading...</p>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default WeekPlan;
