import React, { useState, ReactElement } from "react";
import {
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  FilledInput,
  IconButton,
  Box,
  Hidden,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Profile from "../Profile/Profile";
import "./Header.css";

interface HeaderProps {
  label: string;
  textChange: Function;
  showAll?: boolean;
}

const Header = (props: HeaderProps): ReactElement => {
  const { label, textChange } = props;
  const [text, setText] = useState("");
  const [clear, setClear] = useState(false);

  return (
    <>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} md={9}>
          <div className="search-padding">
            <FormControl className="rounded-edges" fullWidth variant="filled">
              <InputLabel
                htmlFor="outlined-adornment-password"
                sx={{
                  paddingLeft: "15px",
                }}
                id="header-searchbar-label"
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
                value={text}
                inputProps={{ disableunderline: true }}
                endAdornment={
                  <InputAdornment position="end" sx={{ paddingRight: "25px" }}>
                    <IconButton
                      aria-label={label}
                      onClick={() => {
                        if (clear) {
                          setText("");
                          textChange("");
                        } else {
                          textChange(text);
                        }
                        setClear((prevClear) => !prevClear);
                      }}
                      onMouseDown={() => {
                        if (clear) {
                          setText("");
                          textChange("");
                        } else {
                          textChange(text);
                        }
                        setClear((prevClear) => !prevClear);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          if (clear) {
                            setText("");
                            textChange("");
                          } else {
                            textChange(text);
                          }
                          setClear((prevClear) => !prevClear);
                        }
                      }}
                      edge="end"
                    >
                      {!clear ? <SearchIcon /> : <CloseIcon />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(event) => {
                  setText(event.target.value);
                  setClear(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (clear) {
                      setText("");
                      textChange("");
                    } else {
                      textChange(text);
                    }
                    setClear((prevClear) => !prevClear);
                  }
                }}
              />
            </FormControl>
          </div>
        </Grid>
        <Hidden mdDown>
          <Grid item md={3}>
            <Box display="flex" justifyContent="flex-end">
              <Profile mobile={false} showAll={props.showAll} />
            </Box>
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};

export default Header;

//5c6bc0
