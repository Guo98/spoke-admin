import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./app/store";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Nunito Sans",
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const getOrgId = () => {
  return localStorage.getItem("orgId") || undefined;
};

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENTID!}
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE!}
      scope="admin"
      useRefreshTokens={true}
      organization={getOrgId() === undefined ? undefined : getOrgId()}
    >
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
