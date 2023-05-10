import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./app/store";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import { YbugProvider } from "ybug-react";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const getOrgId = () => {
  return localStorage.getItem("orgId") || undefined;
};

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH0_CLIENTID!}
    redirectUri={window.location.origin}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE!}
    scope="admin"
    organization={getOrgId() === undefined ? undefined : getOrgId()}
  >
    <Provider store={store}>
      <YbugProvider
        ybugId="a3cazwp84q6jb5sjvmjj"
        settings={{ launcher_position: "right-middle" }}
      >
        <App />
      </YbugProvider>
    </Provider>
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
