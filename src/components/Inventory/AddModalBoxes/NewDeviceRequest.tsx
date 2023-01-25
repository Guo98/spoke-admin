import React, { useState } from "react";
import { Typography, TextField, Box } from "@mui/material";

interface NewDevice {
  setDeviceName: Function;
  setSpecifications: Function;
  setColor: Function;
  setRefURL: Function;
  setLocation: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  paddingBottom: "15px",
};

const NewDeviceRequest = (props: NewDevice) => {
  const { setDeviceName, setSpecifications, setColor, setRefURL, setLocation } =
    props;

  return (
    <Box>
      <Typography sx={{ paddingBottom: "15px" }}>
        Request a new device type:
      </Typography>
      <TextField
        fullWidth
        label="Device"
        required
        sx={textFieldStyle}
        size="small"
        placeholder="E.g. MacBook Pro 16' M1 2021"
        onChange={(event) => setDeviceName(event.target.value)}
      />
      <TextField
        fullWidth
        label="Requested Specifications"
        required
        sx={textFieldStyle}
        size="small"
        placeholder="E.g. 32GB/512SSD"
        onChange={(event) => setSpecifications(event.target.value)}
      />
      <TextField
        fullWidth
        label="Requested Color"
        required
        sx={textFieldStyle}
        size="small"
        placeholder="E.g. Space Gray or Silver"
        onChange={(event) => setColor(event.target.value)}
      />
      <TextField
        fullWidth
        label="Reference URL"
        required
        sx={textFieldStyle}
        size="small"
        placeholder="E.g. https://www.apple.com/macbook-pro/14-inch-space-gray-apple-m2-pro"
        onChange={(event) => setRefURL(event.target.value)}
      />
      <TextField
        fullWidth
        label="Location"
        required
        sx={textFieldStyle}
        size="small"
        placeholder="E.g. United States"
        onChange={(event) => setLocation(event.target.value)}
      />
    </Box>
  );
};

export default NewDeviceRequest;
