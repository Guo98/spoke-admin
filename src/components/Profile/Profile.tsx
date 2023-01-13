import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import "./Profile.css";

const Profile = () => {
  const { isAuthenticated, user, logout } = useAuth0();
  const [username, setUsername] = useState<string | undefined>("");

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const popoverId = open ? "profile-popover" : undefined;

  useEffect(() => {
    if (isAuthenticated && user) {
      setUsername(user.given_name);
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="profile-padding">
      <Grid container>
        <Grid item xs={8}>
          <Typography sx={{ paddingTop: 1, textAlign: "right" }}>
            Welcome, {username}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Button sx={{ paddingTop: 0 }} onClick={handleClick}>
            <Avatar sx={{ marginLeft: 0 }}>{username?.charAt(0)}</Avatar>
          </Button>
          <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box>
              <Button
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Log Out
              </Button>
            </Box>
          </Popover>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
