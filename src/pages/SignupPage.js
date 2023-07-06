import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';

// import axios from "axios";
// const API_URL = "http://localhost:5005";

import authService from './../services/auth.service';

function SignupPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name };

    // Make an axios request to the API
    // If the POST request is a successful redirect to the login page
    // If the request resolves with an error, set the error message in the state
    // axios.post(`${API_URL}/auth/signup`, requestBody)
    authService
      .signup(requestBody)
      .then((response) => {
        navigate('/login');
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="SignupPage">
      <Container>
        <h1 className="m-3">Sign Up</h1>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form onSubmit={handleSignupSubmit} sx={10} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmail}
                />
                <Form.Text className="d-block text-end text-muted px-3">
                  Email is required.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePassword}
                />
                <Form.Text className="d-block text-end text-muted px-3">
                  Password is required.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={handleName}
                />
                <Form.Text className="d-block text-end text-muted px-3">
                  Name is required.
                </Form.Text>
              </Form.Group>

              <Button className="mb-3" variant="outline-warning" type="submit">
                Sign Up
              </Button>
            </Form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <p>Already have an account?</p>
            <Button
              style={{ color: 'black' }}
              className="text-decoration-none link-hover"
              variant="link"
              as={Link}
              to={'/login'}
            >
              Login
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignupPage;
