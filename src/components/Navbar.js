
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  //  Update the rendering logic to display different content
  //  depending on whether the user is logged in or not
  return (
    <nav className="Navbar">

      <NavLink to="/"><button>Home</button></NavLink>

      {isLoggedIn && (
        <>
          <NavLink to="/my-kitchen"><button>My Kitchen</button></NavLink>
          <NavLink to="/recipes"><button>Recipes</button></NavLink>
          <NavLink to="/ingredients"><button>Ingredients</button></NavLink>

          <button onClick={logOutUser}>Logout</button>
          <span>{user && user.name}</span>
        </>
      )}

      {!isLoggedIn && (
        <>
          <NavLink to="/signup"><button>Sign Up</button></NavLink>
          <NavLink to="/login"><button>Login</button></NavLink>
        </>
      )}

      <NavLink to="/about"><button>About</button></NavLink>

    </nav>
  );
}

export default Navbar;
