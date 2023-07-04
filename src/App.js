import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecipesListPage from './pages/RecipesListPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import IngredientsListPage from './pages/IngredientsListPage';
import MyKitchen from './pages/MyKitchen';
import WeekPlan from './pages/WeekPlan';

import SignupPage from './pages/SignupPage.js';
import LoginPage from './pages/LoginPage.js';
import AboutPage from './pages/AboutPage.js';

import IsPrivate from './components/IsPrivate';
import IsAnon from './components/IsAnon';
import EditRecipePage from './pages/EditRecipePage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>

      <Routes>
        <Route path="/"                       element={<IsAnon><HomePage /></IsAnon>}/>
        <Route path="/my-kitchen"             element={<IsPrivate><MyKitchen /></IsPrivate>}/>
        <Route path="/recipes"                element={<IsPrivate><RecipesListPage /></IsPrivate>}/>
        <Route path="/recipes/:recipeId"      element={<IsPrivate><RecipeDetailsPage /></IsPrivate>}/>
        <Route path="/recipes/edit/:recipeId" element={<IsPrivate><EditRecipePage /></IsPrivate>}/>
        <Route path="/ingredients"            element={<IsPrivate><IngredientsListPage /></IsPrivate>} />
        <Route path="/week-plan"              element={<IsPrivate><WeekPlan /></IsPrivate>} />

        <Route path="/signup"                 element={<SignupPage />} />
        <Route path="/login"                  element={<LoginPage />} />

        <Route path="/about"                  element={<AboutPage />} />
      </Routes>
    </div>
  );
}

export default App;