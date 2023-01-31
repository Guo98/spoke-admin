import React, { useEffect, useState, useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  PaletteColorOptions,
  PaletteMode,
  ThemeOptions,
  useMediaQuery,
} from "@mui/material";
import SpokeDrawer from "./components/LeftNav/Drawer";
import AppContainer from "./components/AppContainer/AppContainer";
import Box from "@mui/material/Box";
import { useAuth0 } from "@auth0/auth0-react";
import { orgMapping } from "./utilities/mappings";
import { ColorModeContext } from "./utilities/color-context";
import { blueGrey } from "@mui/material/colors";
import "./App.css";

const getDesignTokens = (mode: PaletteMode) => ({
  typography: {
    allVariants: {
      fontFamily: "Nunito Sans",
    },
  },
  palette: {
    mode,
    ...(mode === "dark" && {
      primary: blueGrey,
      background: {
        default: "#1d252d",
        paper: "#1d252d",
      },
    }),
  },
});

function App() {
  const { isAuthenticated, loginWithRedirect, isLoading, user, logout } =
    useAuth0();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"dark" | "light">("light");

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (user && user.org_id) {
      localStorage.setItem("orgId", user.org_id);
      localStorage.setItem("spokeclient", btoa(orgMapping[user.org_id]));
    }
  }, [user]);

  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  let theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
            <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
              <RouterProvider router={AppContainer} />
            </Box>
          </Box>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
