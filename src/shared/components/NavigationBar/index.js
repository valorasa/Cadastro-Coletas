import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const NavigationBar = () => {
  return (
    <header>
      <Navbar bg="primary" variant="dark" sticky="top">
        <Container>
          <Navbar.Brand>Testes Roteirização</Navbar.Brand>
          <Nav className="me-auto">
            <NavLink
              to="/pickups"
              className="text-white mx-2 text-decoration-none"
            >
              Coletas
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavigationBar;
