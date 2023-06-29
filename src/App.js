import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
// import RecipesListPage from "./pages/ProjectListPage";
// import RecipeDetailsPage from "./pages/ProjectDetailsPage";
// import EditRecipePage from "./pages/EditProjectPage";
import SignupPage from "./pages/SignupPage.js";
import LoginPage from "./pages/LoginPage.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

    </div>
  );
}

export default App;