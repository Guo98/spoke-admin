import React, { useState } from "react";
import {
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface SendProps {
  setSendDeviceName: Function;
  setWarehouse: Function;
  setQuantity: Function;
  warehouse: string;
  quantity: number;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  paddingBottom: "15px",
};

const SendToSpoke = (props: SendProps) => {
  const { setSendDeviceName, setWarehouse, setQuantity, warehouse, quantity } =
    props;

  const handleChange = (event: SelectChangeEvent) => {
    setWarehouse(event.target.value);
  };

  const roles = useSelector((state: RootState) => state.client.roles);

  return (
    <Box>
      <Typography>Send a device to Spoke:</Typography>
      {roles?.length > 0 &&
        (roles[0] === "flyr-poland" ||
          roles[0] === "flyr-eu" ||
          roles[0] === "pribas-eu") && (
          <Typography variant="caption" color="red">
            * This is currently only supported within the US.
          </Typography>
        )}
      <TextField
        fullWidth
        label="Device being sent"
        required
        sx={{ ...textFieldStyle, marginTop: "15px" }}
        size="small"
        placeholder="E.g. MacBook Pro 16' M1 2021"
        onChange={(event) => setSendDeviceName(event.target.value)}
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
        defaultValue={quantity}
      />
      <FormControl fullWidth sx={textFieldStyle} required size="small">
        <InputLabel id="warehouse-type-label">Spoke Warehouse</InputLabel>
        <Select
          labelId="warehouse-type-label"
          id="warehouse-select-standard"
          value={warehouse}
          onChange={handleChange}
          label="Spoke Warehouse"
        >
          <MenuItem value="Georgia, USA">Georgia, USA</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SendToSpoke;
