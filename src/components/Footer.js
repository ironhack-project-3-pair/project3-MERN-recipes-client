import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Container fluid>
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <Col md={4} className="text-start mb-0 text-muted ps-3">
                    <p>&copy; {new Date().getFullYear()} Tit-Tit Kitchen</p>
                </Col>

                <Col md={4} className="d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <Link to="/">
                    </Link>
                </Col>

                <Col md={4} className="d-flex justify-content-end pe-4">
                    <Nav className="nav">
                        <Nav.Item className="nav-item">
                            <Nav.Link as={NavLink} to="/" className="nav-link px-2 text-muted">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item">
                            <Nav.Link as={NavLink} to="/signup" className="nav-link px-2 text-muted">Sign Up</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item">
                            <Nav.Link as={NavLink} to="/login" className="nav-link px-2 text-muted">Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item">
                            <Nav.Link as={NavLink} to="/about" className="nav-link px-2 text-muted">About</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
            </footer>
        </Container>
    );
};

export default Footer;
