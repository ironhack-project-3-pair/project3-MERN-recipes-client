import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import recipesService from '../services/recipes.service';
import weekPlanService from '../services/weekPlan.service';

function RecipeDetailsPage() {
  if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE) console.log('RecipeDetailsPage: rendering (mounting) or re-rendering (updating)');

  const [recipe, setRecipe] = useState(null);

  const [weekPlan, setWeekPlan] = useState({});
  const [selectedSlot, setSelectedSlot] = useState("dayMonday.0");
  const [notifMessage, setNotifMessage] = useState("");
  const slotsPerDay = 2;
  const slotsNames = [
    "Lunch",
    "Dinner"
  ]
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
    if (process.env.REACT_APP_DEBUG_COMPONENT_LIFECYCLE) console.log("RecipeDetailsPage: effect hook");
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
      recipesService
        .getRecipe(recipeId),
      weekPlanService
        .getWeekPlan()
    ])
      .then(([responseRecipe, responseWeekPlan]) => {
        setRecipe(responseRecipe.data);
        setWeekPlan(responseWeekPlan.data);
      })
      .catch((e) => console.log('error getting in useEffect (batched requests)', e));
  }, []);

  const handleChangeSelectedSlot = (e) => {
    setSelectedSlot(e.target.value);
    setNotifMessage("");
  }

  const handleSubmitAddToWeekPlan = (e) => {
    e.preventDefault();
    // const selectedSlotValue = e.target.selectedSlot.value; // or
    const selectedSlotValue = selectedSlot;
    const [selectedDay, selectedSlotOfDay] = selectedSlotValue.split(".")
    const newWeekPlan = {...weekPlan};
    if (newWeekPlan.weekPlanRecipes[selectedDay].length === 0) 
      for (let i = 0; i < slotsPerDay; i++) {
        newWeekPlan.weekPlanRecipes[selectedDay].push({}) // pushing 2 anyway in case selectedSlotOfDay = 1
      }
    newWeekPlan.weekPlanRecipes[selectedDay][selectedSlotOfDay].recipe = recipe;
    newWeekPlan.weekPlanRecipes[selectedDay][selectedSlotOfDay].consumed = false;
    // defaults to false as per model if not specified, but force the property in case user is trying to add to a slot which already contains a consumed recipe... 
    weekPlanService.updateWeekPlan(newWeekPlan)
      .then(response => {
        setWeekPlan(newWeekPlan);
        setNotifMessage("Added!");
      })
      .catch(e => {
        console.log("error updating week plan: ", e)
        setNotifMessage("Something went wrong...");
      })
  }

  return (
    <div className="RecipeDetailsPage">
      {recipe && (
        <>
          {!recipe.image 
            ? <img
              src="https://static.vecteezy.com/system/resources/previews/008/695/917/original/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
              alt="default"
            />
            : <img src={recipe.image} alt={recipe.name} />
          }
          <h3>{recipe.name}</h3>
          <p>Preparation: {recipe.durationInMin} min</p>
          <h4>Ingredients</h4>
          <ul>
          {recipe.recipeIngredients.map((recipeIngredient) => {
            // JSX collapses whitespaces
            // backticks are required with the white-space attribute in JSX
            return <li key={recipeIngredient._id} style={{whiteSpace: "no-wrap"}}>
              {`
                ${recipeIngredient.ingredient.name} 
                ${recipeIngredient.ingredient.emoji} | 
                ${recipeIngredient.qtyInGrams} g
              `}
            </li>
          })}
          </ul>
          <h4>Instructions</h4>
          <p>{recipe.instructions}</p>
          <Link to={`/recipes/edit/${recipe._id}`}>Edit</Link>
          <form onSubmit={handleSubmitAddToWeekPlan}>
            <label>Affect this recipe to a slot: 
              <select
                name="selectedSlot"
                value={selectedSlot}
                onChange={handleChangeSelectedSlot}
              >
              { Object.keys(weekPlan.weekPlanRecipes ? weekPlan.weekPlanRecipes : {})
                  .reduce((slots, day) => {
                    for (let slotOfDay = 0; slotOfDay < slotsPerDay; slotOfDay++) {
                      slots.push(
                        <option key={`${day}.${slotOfDay}`} value={`${day}.${slotOfDay}`}>
                          {`${day.slice(3)} - ${slotsNames[slotOfDay]}`}
                        </option>
                      );
                    }
                    return slots;
                  }, [])
                }
              </select>
            </label>
            <button> Add to Week Plan </button>
          </form>
          { notifMessage && <p className="notif-message">{notifMessage}</p>}
        </>
      )}
    </div>
  );
}
export default RecipeDetailsPage;