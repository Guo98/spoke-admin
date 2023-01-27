import React, { FC, ReactElement } from "react";
import {
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  FilledInput,
  IconButton,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Profile from "../Profile/Profile";
import "./Header.css";

interface HeaderProps {
  label: string;
}

const Header = (props: HeaderProps): ReactElement => {
  const { label } = props;
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
                {label}
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
          <Box display="flex" justifyContent="flex-end">
            <Profile />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
