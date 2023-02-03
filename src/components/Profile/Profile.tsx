import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Typography,
  Avatar,
  Grid,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./Profile.css";
import { ColorModeContext } from "../../utilities/color-context";
import { resetData } from "../../services/inventoryAPI";

const Profile = () => {
  const { isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0();
  const [username, setUsername] = useState<string | undefined>("");
  const [userpic, setPic] = useState<string | undefined>("");
  const [mode, setMode] = useState(true);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const colorMode = useContext(ColorModeContext);

  useEffect(() => {
    if (isAuthenticated && user) {
      setUsername(user.given_name || user.nickname);
      setPic(user.picture);
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
          <Button
            sx={{ paddingTop: 0, paddingRight: 0, paddingLeft: 0 }}
            onClick={handleClick}
            aria-controls={open ? "profile-menu" : undefined}
            id="profile-button"
          >
            {userpic === "" ? (
              <Avatar sx={{ marginLeft: 0 }}>{username?.charAt(0)}</Avatar>
            ) : (
              <Avatar sx={{ marginLeft: 0 }} src={userpic} />
            )}
          </Button>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ "aria-labelledby": "profile-button" }}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem
              onClick={() => {
                colorMode.toggleColorMode();
                localStorage.setItem("spoke-theme", !mode ? "dark" : "light");
                setMode(!mode);
              }}
            >
              {!mode ? <LightModeIcon /> : <DarkModeIcon />}
              <Typography sx={{ paddingLeft: "5px" }}>Theme</Typography>
            </MenuItem>
            <MenuItem
              onClick={async () => {
                const accessToken = await getAccessTokenSilently();
                try {
                  await resetData(accessToken);
                } catch (e) {
                  console.error("Error in resetting data");
                }
                logout({ returnTo: window.location.origin });
              }}
            >
              <LogoutIcon />{" "}
              <Typography sx={{ paddingLeft: "5px" }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
