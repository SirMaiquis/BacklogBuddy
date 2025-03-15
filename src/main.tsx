import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Only import and initialize TempoDevtools if VITE_TEMPO is true
if (import.meta.env.VITE_TEMPO === "true") {
  import("tempo-devtools").then(({ TempoDevtools }) => {
    TempoDevtools.init();
  });
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
