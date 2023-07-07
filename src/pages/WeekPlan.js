import { useState, useEffect } from 'react';
import { Container, Row, Button, Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
  const [isConsumingRecipes, setIsConsumingRecipes] = useState({});

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
      console.log(
        '%cWeekPlan:%c effect hook', 
        'color: #badaff', 
        'color: red');
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

    if (!isConsumingRecipes[consumingDay]) isConsumingRecipes[consumingDay] = [];
    isConsumingRecipes[consumingDay][consumingSlotOfDay] = true;
    setIsConsumingRecipes({...isConsumingRecipes}); // changes the object ref, updates states, trigger re-render (spread operator otherwise ref is the same and no re-render triggered)
    consumeUserIngredients(recipeId)
      .then(response => {
        isConsumingRecipes[consumingDay][consumingSlotOfDay] = false;
        setIsConsumingRecipes(isConsumingRecipes);
        updateWeekPlan(consumingDay, consumingSlotOfDay)
      })
      .catch(e => console.log('error handling click: ', e));
  };

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
        consumingRecipe.recipeIngredients.forEach(consumingRecipeIngredient => {
          const newUserIngredient = newUserIngredients.find(newUserIngredient2 => {
            return newUserIngredient2.ingredient._id.toString() === consumingRecipeIngredient.ingredient._id.toString();
          })
          if (newUserIngredient) {
            if (newUserIngredient.qtyInGrams > consumingRecipeIngredient.qtyInGrams)
              newUserIngredient.qtyInGrams -= consumingRecipeIngredient.qtyInGrams;
            else {
              newUserIngredients.splice(newUserIngredients.indexOf(newUserIngredient), 1)
            }
          }
        })
        return userIngredientsService
          .updateUserIngredients(newUserIngredients);
      })
      .then(response => {
        // console.log(response)
        return response;
      })
      .catch((e) => {
        console.log('error consuming user ingredients: ', e);
        throw e;
      });
  };

  const updateWeekPlan = (consumingDay, consumingSlotOfDay) => {
    const newWeekPlan = {...weekPlan};
    newWeekPlan.weekPlanRecipes[consumingDay][consumingSlotOfDay].consumed = true;
    weekPlanService
      .updateWeekPlan(newWeekPlan)
      .then(response => {
        setWeekPlan(newWeekPlan);
      })
      .catch(e => {
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
      .catch(e => {
        console.log('error resetting week plan: ', e);
      });
  };

  return (
    <div className="WeekPlan">
      <Button className='m-3' variant="outline-warning" onClick={resetWeekPlan}>Reset Week Plan</Button>
      <Container fluid>
        <Row className="cards-row m-3 p-2">
          {weekPlan.weekPlanRecipes 
            ? days.map((day) => {
              return (
                <Card key={day} className="WeekPlan-day-wrapper col m-3" id={day}>
                  <Card.Title className="p-2" style={{ fontSize: '2rem' }}>
                    {day.slice(3)}
                  </Card.Title>
                  <Card.Body className="WeekPlan-day-recipes-wrapper">
                    {weekPlan.weekPlanRecipes[day]?.length > 0 &&
                      // always true since the default value was added for the day fields
                      weekPlan.weekPlanRecipes[day].map((weekPlanRecipe, i) => {
                        return weekPlanRecipe.recipe
                          ? <Card key={weekPlanRecipe.recipe?._id + '.' + i} className={
                              weekPlanRecipe.consumed 
                              ? "WeekPlan-day-recipe-consumed-wrapper"
                              : "WeekPlan-day-recipe-wrapper"
                            } >
                            <Card.Subtitle style={{fontSize:"1.3rem"}}>{slotsNames[i]}</Card.Subtitle>
                            <div>
                              <Card.Title className="link-hover mb-0">
                              <Link to={`/recipes/${weekPlanRecipe.recipe._id}`} className="text-decoration-none text-center"
                              >
                                {weekPlanRecipe.recipe?.name}
                              </Link>
                              </Card.Title>
                            </div>
                            { !weekPlanRecipe.consumed 
                              ? <Button variant='outline-dark' className='m-3' onClick={
                                    () => handleClick(weekPlanRecipe.recipe?._id, day, i)
                                  }
                                > 
                                  { 
                                    !isConsumingRecipes?.[day]?.[i] 
                                    ? "Consume" 
                                    : "Consuming..."
                                  } 
                                </Button>
                              : <p>Consumed</p>
                            }
                          </Card>
                         : <Card key={'.' + i} className="WeekPlan-day-recipe-empty-wrapper">
                            <Card.Subtitle style={{fontSize:"1.3rem"}}>{slotsNames[i]}</Card.Subtitle>
                            <div>Empty Slot</div>
                          </Card>
                      })
                    }
                  </Card.Body>
                </Card>
              );
            })
            : <p>Loading week plan...</p>
          }
        </Row>
      </Container>
    </div>
  );

}

export default WeekPlan;