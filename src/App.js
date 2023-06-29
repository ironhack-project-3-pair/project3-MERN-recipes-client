import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage.js';
import LoginPage from './pages/LoginPage.js';
import RecipesListPage from './pages/RecipesListPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesListPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/recipes/:recipeId" element={<RecipeDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
