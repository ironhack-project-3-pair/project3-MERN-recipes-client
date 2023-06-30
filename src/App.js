import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecipesListPage from './pages/RecipesListPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import MyKitchen from './pages/MyKitchen';

import SignupPage from './pages/SignupPage.js';
import LoginPage from './pages/LoginPage.js';

import IsPrivate from './components/IsPrivate';
import IsAnon from './components/IsAnon';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <IsAnon>
              <HomePage />
            </IsAnon>
          }
        />
        <Route
          path="/"
          element={
            <IsPrivate>
              <MyKitchen />
            </IsPrivate>
          }
        />
        <Route
          path="/recipes"
          element={
            <IsPrivate>
              <RecipesListPage />
            </IsPrivate>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/recipes/:recipeId"
          element={
            <IsPrivate>
              <RecipeDetailsPage />
            </IsPrivate>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
