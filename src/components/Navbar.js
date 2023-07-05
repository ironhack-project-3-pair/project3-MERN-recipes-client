import { Container, Nav, Navbar } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

function NavbarComponent() {
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
          style={{
            fontSize: '1.5em',
            fontWeight: 'bold',
          }}
          href="/"
        >
          My Kitchen
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && (
              <>
                {/* <Nav.Link href="/my-kitchen">My Kitchen</Nav.Link> */}
                <Nav.Link href="/recipes">Recipes</Nav.Link>
                <Nav.Link href="/ingredients">Ingredients</Nav.Link>
                <Nav.Link href="/week-plan">Week Plan</Nav.Link>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
            <Nav.Link href="/about">About</Nav.Link>
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

export default NavbarComponent;
