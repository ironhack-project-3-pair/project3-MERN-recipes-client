import './App.css';
import { Routes, Route } from 'react-router-dom';

import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
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

import { RecipesProviderWrapper } from './context/recipes.context.js';

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <header className="App-header">
        <AppNavbar />
      </header>

      <RecipesProviderWrapper>

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

      </RecipesProviderWrapper>
      <footer className="App-footer mt-auto w-100 ">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
