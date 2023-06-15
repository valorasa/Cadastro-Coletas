import React from "react";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/style/form.module.css"

import { createRoot } from "react-dom/client";
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
