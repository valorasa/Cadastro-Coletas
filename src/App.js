import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageNotFound from "./shared/pages/404";
import PickUpsPage from "./pages/PickUps";
import PickUpForm from "./pages/PickUps/form";
import LoginPage from "./shared/pages/login";
import PrivateRoute from "./shared/pages/privateRoute";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LoginPage />} />
        </Route>
        <Route exact path='/pickups' element={<PrivateRoute component={PickUpsPage} />} />
        <Route exact path='/pickups/new' element={<PrivateRoute component={PickUpForm} />} />
        <Route exact path='/pickups/new/:id' element={<PrivateRoute component={PickUpForm} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
