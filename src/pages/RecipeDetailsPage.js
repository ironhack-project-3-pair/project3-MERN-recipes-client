import { useEffect, useState } from 'react';

import { useContext } from 'react';
import { RecipesContext } from '../context/recipes.context';

import { Link, useParams, useNavigate } from 'react-router-dom';

import recipesService from '../services/recipes.service';
import weekPlanService from '../services/weekPlan.service';
import messagesService from '../services/messages.service';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function RecipeDetailsPage() {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
    console.log(
      '%cRecipeDetailsPage:',
      'color: #6666cc',
      ' rendering (mounting) or re-rendering (updating)'
    );

  const [recipe, setRecipe] = useState(null);

  const navigate = useNavigate();
  const { setDeleteMessageCtxRecipesListPage } = useContext(RecipesContext);

  const [weekPlan, setWeekPlan] = useState({});
  const [selectedSlot, setSelectedSlot] = useState('dayMonday.0');
  const [notifMessage, setNotifMessage] = useState('');
  const slotsPerDay = 2;
  const slotsNames = ['Lunch', 'Dinner'];
  // const days = [
  //   "dayMonday",
  //   "dayTuesday",
  //   "dayWednesday",
  //   "dayThursday",
  //   "dayFriday",
  //   "daySaturday",
  //   "daySunday"
  // ]

  const { recipeId } = useParams();

  // const getRecipe = () => {
  //   recipesService
  //     .getRecipe(recipeId)
  //     .then((response) => {
  //       setRecipe(response.data);
  //     })
  //     .catch((e) => console.log('error getting the recipe\'s details', e));
  // };
  // const getWeekPlan = () => {
  //   weekPlanService
  //     .getWeekPlan()
  //     .then((response) => {
  //       setWeekPlan(response.data);
  //     })
  //     .catch((e) => console.log('error getting week plan', e));
  // };

  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cRecipeDetailsPage:%c effect hook',
        'color: #6666cc',
        'color: red'
      );
    //   (async () => {
    //     try {
    //       await Promise.all([
    //         getRecipe(),
    //         getWeekPlan()
    //       ]);
    //   } catch(e) {
    //     console.log("error in effect: ", e)
    //   }
    //   })() // IIFE
    // not possible with Promise.all to batch the 2 updates to always re-render once (instead of twice sometimes)

    Promise.all([
      recipesService.getRecipe(recipeId),
      weekPlanService.getWeekPlan(),
    ])
      .then(([responseRecipe, responseWeekPlan]) => {
        setRecipe(responseRecipe.data);
        setWeekPlan(responseWeekPlan.data);
      })
      .catch((e) =>
        console.log('error getting in useEffect (batched requests)', e)
      );

    return cleanup;
  }, []);

  const handleChangeSelectedSlot = (e) => {
    setSelectedSlot(e.target.value);
    setNotifMessage('');
  };

  const showNotificationMessage = (message) => {
    setNotifMessage(message);
    setTimeout(() => {
      setNotifMessage('');
    }, 2000);
  };

  const handleSubmitAddToWeekPlan = (e) => {
    e.preventDefault();
    // const selectedSlotValue = e.target.selectedSlot.value; // or
    const selectedSlotValue = selectedSlot;
    const [selectedDay, selectedSlotOfDay] = selectedSlotValue.split('.');
    const newWeekPlan = { ...weekPlan };
    if (newWeekPlan.weekPlanRecipes[selectedDay].length === 0)
      for (let i = 0; i < slotsPerDay; i++) {
        newWeekPlan.weekPlanRecipes[selectedDay].push({}); // pushing 2 anyway in case selectedSlotOfDay = 1
      }
    newWeekPlan.weekPlanRecipes[selectedDay][selectedSlotOfDay].recipe = recipe;
    newWeekPlan.weekPlanRecipes[selectedDay][
      selectedSlotOfDay
    ].consumed = false;
    // defaults to false as per model if not specified, but force the property in case user is trying to add to a slot which already contains a consumed recipe...
    weekPlanService
      .updateWeekPlan(newWeekPlan)
      .then((response) => {
        setWeekPlan(newWeekPlan);
        showNotificationMessage('Successfully added to Week Plan!');
      })
      .catch((e) => {
        console.log('error updating week plan: ', e);
        setNotifMessage('Something went wrong...');
      });
  };

  const deleteRecipe = () => {
    recipesService
      .deleteRecipe(recipeId)
      .then(() => {
        // show message in UI after successful deletion
        messagesService.showDeleteMessage(
          recipe.name,
          setDeleteMessageCtxRecipesListPage
        );
        navigate('/recipes');
      })
      .catch((e) => console.log('error deleting recipe: ', e));
  };

  const cleanup = () => {
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE)
      console.log(
        '%cRecipeDetailsPage:',
        'color: #6666cc',
        ' cleaning after component removed from DOM (unmounted)'
      );
  };

  return (
    <Container className="text-center">
      <Row className="justify-content-center m-3">
        <Col md="auto">
          <Card className="RecipeDetailsPage" style={{ width: '20rem' }}>
            {recipe && (
              <>
                {!recipe.image ? (
                  <Card.Img
                    variant="top"
                    src="https://static.vecteezy.com/system/resources/previews/008/695/917/original/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
                    alt="default"
                  />
                ) : (
                  <Card.Img
                    variant="top"
                    src={recipe.image}
                    alt={recipe.name}
                  />
                )}
                <Card.Title className="text-center">{recipe.name}</Card.Title>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>
                    <Card.Subtitle>Preparation</Card.Subtitle>
                    <Card.Body>
                      {recipe.durationInMin
                        ? `${recipe.durationInMin} min`
                        : 'Not specified'}
                    </Card.Body>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Card.Subtitle>Ingredients</Card.Subtitle>
                    <ListGroup as="ul">
                      {recipe.recipeIngredients.map((recipeIngredient) => {
                        // JSX collapses whitespaces
                        // backticks are required with the white-space attribute in JSX
                        return (
                          <ListGroup.Item
                            as="li"
                            key={recipeIngredient._id}
                            style={{ whiteSpace: 'no-wrap' }}
                          >
                            {`
                    ${recipeIngredient.ingredient.name} 
                    ${recipeIngredient.ingredient.emoji} | 
                    ${recipeIngredient.qtyInGrams} g
                    `}
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Card.Subtitle>Instructions</Card.Subtitle>
                    <Card.Body>
                      {recipe.instructions
                        ? `${recipe.instructions}`
                        : 'Not specified'}
                    </Card.Body>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Card.Subtitle>Actions</Card.Subtitle>
                    <Link
                      to={`/recipes/edit/${recipe._id}`}
                      role="button"
                      className="btn btn-outline-warning m-3 col-4"
                    >
                      Edit
                    </Link>
                    <Button
                      className="btn btn-outline-warning m-3 col-4 "
                      variant="outline-warning"
                      onClick={deleteRecipe}
                    >
                      Delete
                    </Button>
                    {/* do not use react-bootstrap <Card.Link> as it will reload the page */}

                    <hr />
                    <Form onSubmit={handleSubmitAddToWeekPlan}>
                      <Form.Label style={{ width: '100%' }}>
                        Add this recipe to a slot:
                        <Form.Select
                          className="mt-2 mb-0 mx-0"
                          name="selectedSlot"
                          value={selectedSlot}
                          onChange={handleChangeSelectedSlot}
                        >
                          {Object.keys(
                            weekPlan.weekPlanRecipes
                              ? weekPlan.weekPlanRecipes
                              : {}
                          ).reduce((slots, day) => {
                            for (
                              let slotOfDay = 0;
                              slotOfDay < slotsPerDay;
                              slotOfDay++
                            ) {
                              slots.push(
                                <option
                                  key={`${day}.${slotOfDay}`}
                                  value={`${day}.${slotOfDay}`}
                                >
                                  {`${day.slice(3)} - ${slotsNames[slotOfDay]}`}
                                </option>
                              );
                            }
                            return slots;
                          }, [])}
                        </Form.Select>
                      </Form.Label>
                      {/* Button does not default to type "submit" when in FOrm with react bootstrap... */}
                      <Button
                        variant="warning"
                        type="submit"
                        style={{ width: '100%' }}
                      >
                        {' '}
                        Add to Week Plan{' '}
                      </Button>
                    </Form>
                    {notifMessage && (
                      <p className="notif-message">{notifMessage}</p>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default RecipeDetailsPage;
