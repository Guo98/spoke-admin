import React, { useEffect, useState, useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  PaletteMode,
  useMediaQuery,
  Hidden,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import SpokeDrawer from "./components/LeftNav/Drawer";
import AppContainer from "./components/AppContainer/AppContainer";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth0 } from "@auth0/auth0-react";
import { useYbugApi } from "ybug-react";
import { useDispatch } from "react-redux";
import { orgMapping } from "./utilities/mappings";
import { ColorModeContext } from "./utilities/color-context";
import { blueGrey } from "@mui/material/colors";
import { updateClient } from "./app/store";
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
  components: {
    mode,
    ...(mode === "dark" && {
      MuiButton: {
        variants: [
          {
            props: {
              variant: "contained" as
                | "contained"
                | "text"
                | "outlined"
                | undefined,
            },
            style: { backgroundColor: "#5c6bc0" },
          },
          {
            props: {
              variant: "text" as "contained" | "text" | "outlined" | undefined,
            },
            style: { color: "#ACB9FF" },
          },
        ],
      },
      MuiFab: {
        variants: [
          {
            props: {
              variant: "extended" as "extended" | "circular" | undefined,
            },
            style: { backgroundColor: "#5c6bc0" },
          },
          {
            props: {
              variant: "circular" as "extended" | "circular" | undefined,
            },
            style: { backgroundColor: "#5c6bc0" },
          },
        ],
      },
    }),
  },
});

function App() {
  const { user } = useAuth0();
  const YbugContext = useYbugApi();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"dark" | "light">("light");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.org_id) {
      localStorage.setItem("orgId", user.org_id);
      localStorage.setItem("spokeclient", btoa(orgMapping[user.org_id]));
      dispatch(updateClient(orgMapping[user.org_id]));

      if (YbugContext?.Ybug) {
        YbugContext.init({
          user: {
            email: user.email,
            name: user.name,
          },
        });
      }
    }
  }, [user]);

  useEffect(() => {
    const storageMode = localStorage.getItem("spoke-theme");

    if (!storageMode) {
      setMode(prefersDarkMode ? "dark" : "light");
    } else {
      setMode(storageMode as "dark" | "light");
    }
  }, [prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      mode: mode,
      toggleColorMode: () => {
        localStorage.setItem(
          "spoke-theme",
          mode === "light" ? "dark" : "light"
        );
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  let theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <Box sx={{ display: "flex" }}>
            {window.location.pathname.substring(1) !== "logout" && (
              <>
                <Hidden mdUp>
                  <AppBar position="fixed">
                    <Toolbar>
                      <IconButton
                      // onClick={() => setMobileOpen((prevOpen) => !prevOpen)}
                      >
                        <MenuIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>
                </Hidden>
                <Box
                  component="nav"
                  sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
                >
                  <SpokeDrawer />
                </Box>
              </>
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
