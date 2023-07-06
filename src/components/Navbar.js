import { Container, Nav, Navbar } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { NavLink } from 'react-router-dom';

function AppNavbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      style={{
        backgroundColor: '#ffdf38',
        fontSize: '1.3em',
      }}
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          style={{
            fontSize: '1.5em',
            fontWeight: 'bold',
          }}
          to="/"
        >
          My Kitchen
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && (
              <>
                {/* <Nav.Link to="/my-kitchen">My Kitchen</Nav.Link> */}
                <Nav.Link as={NavLink} to="/recipes">
                  Recipes
                </Nav.Link>
                <Nav.Link as={NavLink} to="/ingredients">
                  Ingredients
                </Nav.Link>
                <Nav.Link as={NavLink} to="/week-plan">Week Plan</Nav.Link>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/signup">Sign Up</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
          </Nav>

          {isLoggedIn && (
            <Nav>
              <Nav.Link
                style={{
                  fontSize: '1.2em',
                  display: 'flex',
                  alignItems: 'center',
                }}
                disabled
              >
                {user && user.name}
              </Nav.Link>
              <Nav.Link
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={logOutUser}
              >
                Logout
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
