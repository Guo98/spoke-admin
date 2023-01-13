import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import SpokeDrawer from "./components/LeftNav/Drawer";
import AppContainer from "./components/AppContainer/AppContainer";
import Box from "@mui/material/Box";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header/Header";
import "./App.css";

function App() {
  const { isAuthenticated, loginWithRedirect, isLoading, user } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated]);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        {window.location.pathname.substring(1) !== "logout" && (
          <Box
            component="nav"
            sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
          >
            <SpokeDrawer />
          </Box>
        )}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {window.location.pathname.substring(1) !== "logout" && <Header />}
          <RouterProvider router={AppContainer} />
        </Box>
      </Box>
    </div>
  );
}

export default App;
