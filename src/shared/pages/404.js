import { Container } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";

const PageNotFound = () => {
  return (
    <>
      <NavigationBar />
      <main>
        <Container>
          <h1 className="my-3">Página não encontrada</h1>
        </Container>
      </main>
    </>
  );
};

export default PageNotFound;
