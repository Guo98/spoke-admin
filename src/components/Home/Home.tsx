import React from "react";
import { Typography, Box, Button, useTheme, Stack } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  const login = () => {
    const paramsAsObj = Object.fromEntries([...searchParams]);
    const portalUri = window.location.pathname.substring(1);

    if (
      Object.keys(paramsAsObj).indexOf("invitation") > -1 &&
      Object.keys(paramsAsObj).indexOf("organization") > -1 &&
      !isAuthenticated &&
      !isLoading
    ) {
      loginWithRedirect({
        invitation: paramsAsObj.invitation,
        organization: paramsAsObj.organization,
      });
    } else if (!isAuthenticated && !isLoading) {
      loginWithRedirect({
        redirectUri: window.location.href,
      });
    }
  };

  const signup = () => {
    window.open("https://www.withspoke.com/register", "_self");
  };

  const isDarkTheme = useTheme().palette.mode === "dark";

  return (
    <div>
      <Box
        sx={{
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
        }}
      >
        <img
          src={
            isDarkTheme
              ? "https://spokeimages.blob.core.windows.net/image/fullspokeinvert.png"
              : "https://spokeimages.blob.core.windows.net/image/fullspokenormal.png"
          }
          style={{
            height: "50%",
            width: "50%",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <Typography component="h1" variant="h3" textAlign="center"></Typography>
        <Stack
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: "20px" }}
        >
          <Button
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              width: "150px",
            }}
            variant="contained"
            onClick={login}
            id="login-button"
          >
            Login
          </Button>
          <Button
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              width: "150px",
            }}
            variant="contained"
            onClick={signup}
          >
            Sign Up
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default Home;
