import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  const login = () => {
    const paramsAsObj = Object.fromEntries([...searchParams]);
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
      loginWithRedirect();
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "url(https://spokeimages.blob.core.windows.net/image/spokelogo.png)",
      }}
    >
      <Box
        sx={{
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
        }}
      >
        <Typography component="h1" variant="h3" textAlign="center">
          Welcome to the Spoke Admin Portal
        </Typography>
        <Button
          sx={{
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "20px",
            borderRadius: "10px",
          }}
          variant="contained"
          onClick={login}
        >
          Login
        </Button>
      </Box>
    </div>
  );
};

export default Home;
