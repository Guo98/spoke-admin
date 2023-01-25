import React, { FC, ReactElement } from "react";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import IconButton from "@mui/material/IconButton";
import Profile from "../Profile/Profile";
import "./Header.css";

const Header: FC = (): ReactElement => {
  return (
    <>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={9} lg={8}>
          <div className="search-padding">
            <FormControl className="rounded-edges" fullWidth variant="filled">
              <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{
                  paddingLeft: "15px",
                }}
              >
                Search orders, users, and accounts
              </InputLabel>
              <FilledInput
                id="outlined-adornment-password"
                sx={{
                  ":before": {
                    borderBottom: "0px",
                  },
                  ":after": {
                    borderBottom: "0px",
                  },
                  "&&&:before": {
                    borderBottom: "0px",
                  },
                }}
                inputProps={{ disableunderline: true }}
                endAdornment={
                  <InputAdornment position="end" sx={{ paddingRight: "25px" }}>
                    <IconButton
                      aria-label="search orders, users, and accounts button"
                      onClick={() => console.log("testing")}
                      onMouseDown={() => console.log("testing")}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={3}>
          <Profile />
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
