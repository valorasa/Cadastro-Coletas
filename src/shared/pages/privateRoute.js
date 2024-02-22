import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || token == '' || token == undefined || token == null) {
      navigate("/");

    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return isAuthenticated ? <Component {...rest} /> : null;
};

export default PrivateRoute;