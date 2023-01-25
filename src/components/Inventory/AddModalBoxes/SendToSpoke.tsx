import React, { useState } from "react";
import { Typography, TextField, Box } from "@mui/material";

interface SendProps {
  addToRequestList: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  paddingBottom: "15px",
};

const SendToSpoke = (props: SendProps) => {
  const [deviceName, setDeviceName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warehouse, setWarehouse] = useState("");

  return (
    <Box>
      <Typography sx={{ paddingBottom: "15px" }}>
        Send a device to Spoke:
      </Typography>
      <TextField
        fullWidth
        label="Device being sent"
        required
        sx={textFieldStyle}
        size="small"
        placeholder="E.g. MacBook Pro 16' M1 2021"
        onChange={(event) => setDeviceName(event.target.value)}
      />
      <TextField
        fullWidth
        label="Quantity"
        required
        sx={textFieldStyle}
        size="small"
        type="number"
        onChange={(event) => setQuantity(event.target.value)}
        InputProps={{
          inputProps: { min: 1 },
        }}
        defaultValue={1}
      />
      <TextField
        fullWidth
        label="Spoke Warehouse"
        required
        sx={textFieldStyle}
        size="small"
        onChange={(event) => setWarehouse(event.target.value)}
      />
    </Box>
  );
};

export default SendToSpoke;
