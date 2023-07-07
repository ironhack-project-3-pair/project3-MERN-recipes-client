import { Container } from "react-bootstrap";

import Carousel from 'react-bootstrap/Carousel';
import { Link } from "react-router-dom";

function HomePage() {

  return (
    <div className="HomePage">
      <h1>Welcome to Tit-Tit Kitchen</h1>
      <h4></h4>
      <div className="">
        <h3 className="card-title">Stay Healthy With Delicious Recipes</h3>
        <img src="https://res.cloudinary.com/dbnedjfqu/image/upload/v1688721457/ironhack-project3-mern-recipes/screenshots/recipes_gyzeky.png" alt="Screen shot Recipes Library" />
      </div>
      <div className="">
        <h3 className="card-title">Get Control On Your Ingredients</h3>
        <img src="https://res.cloudinary.com/dbnedjfqu/image/upload/v1688721456/ironhack-project3-mern-recipes/screenshots/kitchen_cdb58g.png" alt="Screen shot My Kitchen" />
      </div>
      <div className="">
        <h3 className="card-title">Or Explore Our Ingredients</h3>
        <img src="https://res.cloudinary.com/dbnedjfqu/image/upload/v1688721456/ironhack-project3-mern-recipes/screenshots/ingredients_msdfav.png" alt="Screen shot Ingredients" />
      </div>
      <div className="">
        <h3 className="card-title">Plan Your Healthy Meals with Week Plan</h3>
        <img src="https://res.cloudinary.com/dbnedjfqu/image/upload/v1688721456/ironhack-project3-mern-recipes/screenshots/week-plan_ftqjw0.png" alt="Screen shot week plan" />
      </div>
      <div className="">
        <h3 className="card-title">Lets Tit-Tit</h3>
        <p><Link to="/signup">Signup</Link> if you dont have Account</p>
        <p><Link to="/login">Login</Link> if you have Account</p>
        

      </div>
    </div>
  )
}

export default HomePage;