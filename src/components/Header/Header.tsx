import React, { useState, ReactElement, useEffect } from "react";
import {
  InputAdornment,
  FormControl,
  InputLabel,
  FilledInput,
  IconButton,
  Box,
  Hidden,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Profile from "../Profile/Profile";
import "./Header.css";

interface HeaderProps {
  label: string;
  textChange: Function;
  showAll?: boolean;
  search_value?: string;
}

const Header = (props: HeaderProps): ReactElement => {
  const { label, textChange } = props;
  const [text, setText] = useState(props.search_value || "");
  const [clear, setClear] = useState(props.search_value ? true : false);

  useEffect(() => {
    if (props.search_value) {
      setText(props.search_value);
      setClear(true);
    }
  }, [props.search_value]);

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        pt="20px"
      >
        <FormControl
          className="rounded-edges"
          variant="filled"
          sx={{ width: "80%" }}
        >
          <InputLabel
            htmlFor="search-bar"
            sx={{
              paddingLeft: "15px",
            }}
            id="header-searchbar-label"
          >
            {label}
          </InputLabel>
          <FilledInput
            id="search-bar"
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
                  id={!clear ? "search-button" : "clear-button"}
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
        <Hidden mdDown>
          <Box display="flex" justifyContent="flex-end">
            <Profile mobile={false} showAll={props.showAll} />
          </Box>
        </Hidden>
      </Stack>
    </>
  );
};

export default Header;

//5c6bc0
