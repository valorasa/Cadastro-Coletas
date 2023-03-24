import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      navigate("/");

    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return isAuthenticated ? <Component {...rest} /> : null;
};

export default PrivateRoute;