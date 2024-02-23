import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const NavigationBar = () => {
function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.reload();
}

  return (
    <header>
      <Navbar style={{ backgroundColor: "#35a854" }} variant="light" sticky="top">
        <Container>
          {/* <Navbar.Brand></Navbar.Brand> */}
          <Nav className="me-auto">
            <NavLink
              to="/pickups"
              className="text-white mx-2 text-decoration-none"
            >
              Coletas
            </NavLink>
            <NavLink
              to="/destination"
              className="text-white mx-2 text-decoration-none"
            >
              Destinação
            </NavLink>
            <NavLink
              to="/refuelling"
              className="text-white mx-2 text-decoration-none"
            >
              Abastecimento
            </NavLink>
          </Nav> 
            <Button variant="outline-light" onClick={logout}>Logout</Button>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavigationBar;
