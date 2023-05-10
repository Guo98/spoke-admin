import React, { useEffect, useState, useMemo } from "react";
import { RouterProvider, BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, PaletteMode, useMediaQuery, styled } from "@mui/material";
import SpokeDrawer from "./components/LeftNav/Drawer";
import AppContainer from "./components/AppContainer/AppContainer";
import Box from "@mui/material/Box";
import { useAuth0 } from "@auth0/auth0-react";
import { useYbugApi } from "ybug-react";
import { useDispatch } from "react-redux";
import { orgMapping } from "./utilities/mappings";
import { ColorModeContext } from "./utilities/color-context";
import { blueGrey } from "@mui/material/colors";
import { updateClient, addRole } from "./app/store";
import AuthRouter from "./components/AppContainer/AuthRouter";
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
          {
            props: {
              color: "secondary" as
                | "secondary"
                | "success"
                | "error"
                | undefined,
            },
            style: { backgroundColor: "" },
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

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

function App() {
  const { user, isAuthenticated } = useAuth0();
  const YbugContext = useYbugApi();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"dark" | "light">("light");
  const [show, setShow] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.org_id) {
      localStorage.setItem("orgId", user.org_id);
      localStorage.setItem("spokeclient", btoa(orgMapping[user.org_id]));
      dispatch(updateClient(orgMapping[user.org_id]));
      dispatch(addRole(user.role));

      if (orgMapping[user.org_id] === "Flo Health") {
        if (user.role.length > 0) {
          if (user.role[0] === "flo-uk-emp") {
            setShow(false);
            window.open("https://withspoke.com/flo-health-uk", "_self");
          }
        }
      }

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
        {isAuthenticated && show && (
          <div>
            <Box
              //sx={{ display: "flex", flexDirection: "column" }}
              display={{ sm: "block", md: "flex" }}
              sx={{ overflowX: "hidden" }}
            >
              {window.location.pathname.substring(1) !== "logout" && (
                <>
                  <BrowserRouter>
                    <Box
                      component="nav"
                      sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
                    >
                      <SpokeDrawer />
                    </Box>
                  </BrowserRouter>
                </>
              )}
              <Box
                component="main"
                sx={{ flexGrow: 1, paddingBottom: "125px" }}
              >
                <RouterProvider router={AppContainer} />
              </Box>
            </Box>
          </div>
        )}
        {!isAuthenticated && <RouterProvider router={AuthRouter} />}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
