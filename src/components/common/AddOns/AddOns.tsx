import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import { textfield_style } from "../../../utilities/styles";

interface AddOnsProps {
  device_name: string;
  setRetDeviceName: Function;
  serial_number: string;
  setRetSN: Function;
  condition: string;
  setRetCondition: Function;
  activation_key: string;
  setRetActivation: Function;
  note: string;
  setRetNote: Function;
  return_box: boolean;
  handleReturnChecked: Function;
}

const AddOns = (props: AddOnsProps) => {
  const {
    device_name,
    setRetDeviceName,
    serial_number,
    setRetSN,
    condition,
    setRetCondition,
    activation_key,
    setRetActivation,
    note,
    setRetNote,
    return_box,
    handleReturnChecked,
  } = props;

  const [hdmi_cable, setHDMI] = useState(false);
  const [charger, setCharger] = useState(false);

  const handleHDMIChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setHDMI(event.target.checked);
  };

  const handleChargerChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setCharger(event.target.checked);
  };

  const handleConditionChange = (event: SelectChangeEvent) => {
    setRetCondition(event.target.value);
  };

  return (
    <Stack pt={2} spacing={1}>
      <Typography variant="h6" component="h4">
        Add Ons
      </Typography>
      <FormControlLabel
        control={<Checkbox onChange={handleHDMIChecked} checked={hdmi_cable} />}
        label="USB-C to HDMI Cable"
      />
      <FormControlLabel
        control={<Checkbox onChange={handleChargerChecked} checked={charger} />}
        label="USB-C Macbook Pro Charger"
      />
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleReturnChecked(e.target.checked)
            }
            checked={return_box}
          />
        }
        label="Include Equipment Return Box"
      />
      {return_box && (
        <>
          <Divider textAlign="left">Return Info</Divider>
          <TextField
            sx={textfield_style}
            fullWidth
            label="Device Name"
            size="small"
            value={device_name}
            onChange={(e) => setRetDeviceName(e.target.value)}
          />
          <TextField
            sx={textfield_style}
            fullWidth
            label="Serial Number"
            size="small"
            value={serial_number}
            onChange={(e) => setRetSN(e.target.value)}
          />
          <FormControl fullWidth sx={textfield_style} size="small">
            <InputLabel id="cond-simple-select-label">Condition</InputLabel>
            <Select
              labelId="cond-simple-select-label"
              id="cond-simple-select"
              value={condition}
              label="Condition"
              onChange={handleConditionChange}
            >
              <MenuItem value="Working">Working</MenuItem>
              <MenuItem value="Damaged">Damaged</MenuItem>
            </Select>
          </FormControl>
          <TextField
            sx={textfield_style}
            fullWidth
            label="Activation Key"
            size="small"
            value={activation_key}
            onChange={(e) => setRetActivation(e.target.value)}
          />
          <TextField
            sx={textfield_style}
            fullWidth
            label="Return Note"
            size="small"
            value={note}
            onChange={(e) => setRetNote(e.target.value)}
          />
        </>
      )}
    </Stack>
  );
};

export default AddOns;
