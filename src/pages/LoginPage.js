import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { AuthContext } from '../context/auth.context';
// import axios from "axios";
// const API_URL = "http://localhost:5005";

import authService from './../services/auth.service';

import TokenExpired from '../components/TokenExpired';

function LoginPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // updates only the HTMLInputElement's checked IDL attribute, not the content attribute of the actual HTML tag (only a default value for when page is loaded) - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser, hasTokenExpired } =
    useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleRememberMe = (e) => setRememberMe(e.target.checked);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password, rememberMe };

    // axios.post(`${API_URL}/auth/login`, requestBody)
    authService
      .login(requestBody)
      .then((response) => {
        // Request to the server's endpoint `/auth/login` returns a response
        // with the JWT string ->  response.data.authToken
        console.log('JWT token', response.data.authToken);

        storeToken(response.data.authToken);

        // Verify the token by sending a request
        // to the server's JWT validation endpoint.
        authenticateUser();

        navigate('/');
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="LoginPage">
      <Container>
        {hasTokenExpired && (
          <div className="TokenExpired">
            <TokenExpired />
          </div>
        )}

        <h1 className="m-3">Login</h1>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form onSubmit={handleLoginSubmit}>
              <FormGroup className="mb-3">
                <FormLabel>Email:</FormLabel>
                <FormControl
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmail}
                />
                <Form.Text className="d-block text-end text-muted px-3">
                  Email is required.
                </Form.Text>
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>Password:</FormLabel>
                <FormControl
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePassword}
                />
                <Form.Text className="d-block text-end text-muted px-3">
                  Password is required.
                </Form.Text>
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>Remember me:</FormLabel>
                <FormCheck
                  type="checkbox"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
              </FormGroup>

              <Button className="mb-3" variant="outline-warning" type="submit">
                Login
              </Button>
            </Form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <p>Don't have an account yet?</p>
            <Button
              style={{ color: 'black' }}
              className="text-decoration-none link-hover"
              variant="link"
              as={Link}
              to={'/signup'}
            >
              {' '}
              Sign Up
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;
